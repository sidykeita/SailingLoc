import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import boatService from '../../services/boat.service';
import blockedDateService from '../../services/blockedDate.service';
import { API_URL } from '../../lib/api';

const OwnerReserve = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [boats, setBoats] = useState([]);
  const [boatId, setBoatId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [blocked, setBlocked] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        const myBoats = await boatService.getMyBoats();
        const list = Array.isArray(myBoats) ? myBoats : [];
        setBoats(list);
        if (list.length > 0) setBoatId(list[0]._id || list[0].id);
      } catch (_) {
        setBoats([]);
      } finally { setLoading(false); }
    };
    init();
  }, []);

  useEffect(() => {
    const loadCalendars = async () => {
      if (!boatId) { setBlocked([]); setReservations([]); return; }
      try {
        const [blocks, resvSvc] = await Promise.all([
          blockedDateService.listByBoat(boatId).catch(()=>[]),
          import('../../services/reservation.service')
        ]);
        const resv = await resvSvc.default.getReservationsByBoat(boatId).catch(()=>[]);
        setBlocked(blocks || []);
        setReservations((resv || []).filter(r => r.status === 'confirmed'));
      } catch (_) {
        setBlocked([]); setReservations([]);
      }
    };
    loadCalendars();
  }, [boatId]);

  const daysBetween = (a, b) => {
    const A = new Date(a), B = new Date(b);
    A.setHours(0,0,0,0); B.setHours(0,0,0,0);
    return Math.max(1, Math.floor((B - A) / (1000*60*60*24)));
  };

  const isOverlapStrict = (s1, e1, s2, e2) => {
    const S1 = new Date(s1), E1 = new Date(e1), S2 = new Date(s2), E2 = new Date(e2);
    S1.setHours(0,0,0,0); E1.setHours(0,0,0,0); S2.setHours(0,0,0,0); E2.setHours(0,0,0,0);
    return (S1 < E2 && E1 > S2); // adjacent allowed
  };

  const hasClientConflict = useMemo(() => {
    if (!startDate || !endDate) return false;
    return (
      reservations.some(r => isOverlapStrict(startDate, endDate, r.startDate, r.endDate)) ||
      blocked.some(b => isOverlapStrict(startDate, endDate, b.startDate, b.endDate))
    );
  }, [startDate, endDate, reservations, blocked]);

  const selectedBoat = useMemo(() => (
    boats.find(b => (b._id || b.id) === boatId)
  ), [boats, boatId]);

  const computedTotal = useMemo(() => {
    if (!startDate || !endDate || !selectedBoat) return 0;
    const days = daysBetween(startDate, endDate);
    const daily = Number(selectedBoat.dailyPrice) || 0;
    return daily * days;
  }, [startDate, endDate, selectedBoat]);

  const submit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!boatId || !startDate || !endDate) { setError('Veuillez choisir un bateau et une plage de dates.'); return; }
    if (hasClientConflict) { setError('Conflit avec une réservation existante ou une période bloquée.'); return; }
    try {
      setSubmitting(true);
      const res = await fetch(`${API_URL}/reservations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('token') ? `Bearer ${localStorage.getItem('token')}` : '',
        },
        body: JSON.stringify({
          boatId,
          startDate,
          endDate,
          price: computedTotal,
          guestName: guestName || undefined,
          guestEmail: guestEmail || undefined
        })
      });
      if (!res.ok) {
        const data = await res.json().catch(()=>({message:'Erreur'}));
        throw new Error(data.message || 'Erreur lors de la création');
      }
      setSuccess('Réservation propriétaire créée avec succès.');
      // reset minimal
      setStartDate(''); setEndDate('');
    } catch (err) {
      setError(err.message || 'Erreur inconnue');
    } finally { setSubmitting(false); }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Chargement…</div>;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="font-pacifico text-primary text-3xl mb-6">Réservation propriétaire</h1>

        <div className="card p-6 max-w-3xl">
          {error && <div className="mb-3 text-red-600">{error}</div>}
          {success && <div className="mb-3 text-green-700">{success}</div>}

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Bateau</label>
              <select className="border rounded px-3 py-2 w-full" value={boatId} onChange={e=>setBoatId(e.target.value)}>
                {boats.map(b => (
                  <option key={b._id || b.id} value={b._id || b.id}>{b.name} • {Number(b.dailyPrice||0)}€/jour</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Du</label>
                <input type="date" className="border rounded px-3 py-2 w-full" value={startDate} onChange={e=>setStartDate(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Au</label>
                <input type="date" className="border rounded px-3 py-2 w-full" value={endDate} onChange={e=>setEndDate(e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nom du client (optionnel)</label>
                <input type="text" className="border rounded px-3 py-2 w-full" value={guestName} onChange={e=>setGuestName(e.target.value)} placeholder="Ex: Jean Dupont" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email du client (optionnel)</label>
                <input type="email" className="border rounded px-3 py-2 w-full" value={guestEmail} onChange={e=>setGuestEmail(e.target.value)} placeholder="Ex: jean@example.com" />
              </div>
            </div>

            <div className="flex items-center justify-between py-2">
              <div className="text-sm text-gray-700">
                {startDate && endDate ? (
                  <>
                    <span className="font-medium">Durée:</span> {daysBetween(startDate, endDate)} jours
                  </>
                ) : (
                  <span>Sélectionnez vos dates</span>
                )}
              </div>
              <div className="text-lg font-semibold text-marine">Total: {computedTotal.toLocaleString()}€</div>
            </div>

            {hasClientConflict && (
              <div className="text-sm text-red-600">Conflit avec une réservation existante ou une période bloquée.</div>
            )}

            <div className="pt-2">
              <button type="submit" className="btn-primary" disabled={submitting || !boatId || !startDate || !endDate || hasClientConflict}>
                {submitting ? 'Création…' : 'Créer la réservation'}
              </button>
              <button type="button" className="btn-secondary ml-2" onClick={()=>navigate('/owner/dashboard')}>Retour</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OwnerReserve;
