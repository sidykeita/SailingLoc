import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import reservationService from '../../services/reservation.service';
import boatService from '../../services/boat.service';
import blockedDateService from '../../services/blockedDate.service';
import { useNavigate } from 'react-router-dom';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { 
  CalendarIcon, 
  ClockIcon, 
  UserIcon, 
  MapPinIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import logoColor from '../../assets/images/logo-SailingLOC-couleur.png';
import ReservationDetailModal from '../../components/ReservationDetailModal';
import ReservationEditModal from '../../components/ReservationEditModal';

const Calendrier = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [view, setView] = useState('month'); // month, week, day
  const [events, setEvents] = useState([]);
  const [boats, setBoats] = useState([]);
  const [selectedBoatId, setSelectedBoatId] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [editError, setEditError] = useState('');

  // Blocage formulaire
  const [blockStart, setBlockStart] = useState('');
  const [blockEnd, setBlockEnd] = useState('');
  const [blockReason, setBlockReason] = useState('maintenance');
  const [blockNotes, setBlockNotes] = useState('');
  const [blockError, setBlockError] = useState('');
  const [creatingBlock, setCreatingBlock] = useState(false);

  const handleLogout = () => {
    logout();
    // La redirection sera gérée par le ProtectedRoute
  };

  useEffect(() => {
    const fetchBoats = async () => {
      try {
        const data = await boatService.getMyBoats();
        setBoats(data);
        if (data.length > 0) setSelectedBoatId(data[0]._id);
      } catch {
        setBoats([]);
      }
    };
    fetchBoats();
  }, []);

  const fetchEvents = async () => {
    if (!currentUser) return;
    try {
      let reservationsData = [];

      if (currentUser.role === 'propriétaire') {
        reservationsData = await reservationService.getMyBoatsReservations();
      } else if (currentUser.role === 'locataire') {
        reservationsData = await reservationService.getMyReservations();
      } else {
        setEvents([]);
        return;
      }
      const mappedReservations = (reservationsData || [])
        .filter(r => r.status === 'confirmed' && r.startDate && r.endDate)
        .filter(r => !selectedBoatId || (r.boat?._id || r.boat || r.boatId) === selectedBoatId)
        .map(r => ({
          id: r._id || r.id,
          reservationId: r._id || r.id,
          title: `Réservation ${r.boat?.name || r.boat?.title || 'Bateau'}`,
          start: new Date(r.startDate),
          end: new Date(r.endDate),
          client: r.user?.firstName ? `${r.user.firstName} ${r.user.lastName || ''}`.trim() : (r.tenantName || ''),
          location: r.boat?.port || '',
          type: 'reservation',
          status: r.status,
          boatId: r.boat?._id || r.boat || r.boatId,
          period: {
            start: new Date(r.startDate),
            end: new Date(r.endDate)
          }
        }));

        // Charger les blocages si propriétaire et bateau sélectionné
        let mappedBlocks = [];
        if (currentUser.role === 'propriétaire' && selectedBoatId) {
          try {
            const blocks = await blockedDateService.listByBoat(selectedBoatId);
            mappedBlocks = (blocks || []).map(b => ({
              id: b._id,
              title: `Bloqué: ${b.reason}`,
              start: new Date(b.startDate),
              end: new Date(b.endDate),
              type: 'block',
              reason: b.reason,
              notes: b.notes,
              boatId: b.boat,
              status: 'indisponible'
            }));
          } catch(e) {
            // ignorer pour ne pas casser l'affichage
          }
        }

        setEvents([ ...mappedReservations, ...mappedBlocks ]);
      } catch (error) {
        setEvents([]);
      }
  };

  useEffect(() => {
    fetchEvents();
  }, [currentUser, selectedBoatId]);

  const months = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  const weekDays = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getEventsForDate = (date) => {
    if (!date) return [];
    const dayTime = new Date(date).setHours(0, 0, 0, 0);
    return events.filter(event => {
      if (selectedBoatId && event.boatId && event.boatId !== selectedBoatId) return false;
      const start = event.start ? new Date(event.start).setHours(0,0,0,0) : (event.date ? new Date(event.date).setHours(0,0,0,0) : null);
      const end = event.end ? new Date(event.end).setHours(0,0,0,0) : start;
      if (start === null) return false;
      return start <= dayTime && dayTime <= end;
    });
  };

  // Fermer le panneau latéral/modal
  const closeReservationDetail = () => setSelectedReservation(null);

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const getEventTypeColor = (type) => {
    switch (type) {
      case 'reservation':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'block':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'maintenance':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'inspection':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const days = getDaysInMonth(currentDate);
  const today = new Date();

  return (
    <div className="min-h-screen bg-background">
      {/* Header - identique à OwnerDashboard */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
          <Link to="/">
              <div className="h-12">
                <img src={logoColor} alt="SailingLOC" className="h-full" />
              </div>
            </Link>
          </div>
          
          <div className="flex items-center">
            <span className="text-dark mr-4">Bonjour, {currentUser?.name || ((currentUser?.firstName || '') + ' ' + (currentUser?.lastName || '')).trim() || 'Propriétaire'}</span>
            <button 
              onClick={handleLogout}
              className="bg-neutral hover:bg-gray-300 text-dark py-2 px-4 rounded-md transition-colors"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      {/* Main content - même arrière-plan et titre que OwnerDashboard */}
      <main className="bg-background min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <h1 className="font-pacifico text-primary text-3xl mb-8">Calendrier</h1>

          {/* En-tête simplifié: suppression du switch de vue */}
          <div className="mb-2" />

          {/* Actions rapides (propriétaire) */}
          {(currentUser?.role === 'propriétaire' || currentUser?.role === 'owner') && (
            <section className="mb-8">
              <h2 className="text-marine text-lg font-semibold mb-3">Actions rapides</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <button
                  type="button"
                  onClick={() => {
                    if (boats.length > 0 && selectedBoatId) {
                      navigate(`/boats/${selectedBoatId}`);
                    } else {
                      navigate('/boats/motor');
                    }
                  }}
                  className="card p-4 flex items-center gap-3 hover:shadow-md transition-shadow text-left"
                >
                  <CalendarIcon className="h-6 w-6 text-primary" />
                  <div>
                    <div className="font-semibold text-marine">Réservation propriétaire</div>
                    <div className="text-sm text-gray-500">Réserver via la fiche bateau</div>
                  </div>
                </button>
              </div>
            </section>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Calendar */}
            <div className="lg:col-span-3">
              <div className="card p-6">
                {/* Sélection du bateau */}
                {boats.length > 0 ? (
                  <div className="mb-4">
                    <label htmlFor="boat-select" className="mr-2 font-semibold">Bateau :</label>
                    <select
                      id="boat-select"
                      value={selectedBoatId || ''}
                      onChange={e => setSelectedBoatId(e.target.value)}
                      className="border rounded px-2 py-1"
                    >
                      {boats.map(boat => (
                        <option key={boat._id} value={boat._id}>{boat.name}</option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className="mb-4 text-red-600 font-semibold">Aucun bateau trouvé. Ajoutez un bateau pour voir le calendrier.</div>
                )}
                {/* Calendar Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-marine">
                    {months[currentDate.getMonth()]} {currentDate.getFullYear()}
                  </h2>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => navigateMonth(-1)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <ChevronLeftIcon className="h-5 w-5 text-gray-600" />
                    </button>
                    <button
                      onClick={() => setCurrentDate(new Date())}
                      className="px-3 py-1 text-sm font-medium text-primary hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      Aujourd'hui
                    </button>
                    <button
                      onClick={() => navigateMonth(1)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <ChevronRightIcon className="h-5 w-5 text-gray-600" />
                    </button>
                  </div>
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden">
                  {/* Week day headers */}
                  {weekDays.map(day => (
                    <div key={day} className="bg-gray-50 p-3 text-center">
                      <span className="text-sm font-medium text-gray-700">{day}</span>
                    </div>
                  ))}
                  
                  {/* Calendar days */}
                  {/* Affichage type FullCalendar : une seule barre continue par réservation multi-jours */}

                  {/* Cases jours du calendrier : */}
                  {days.map((day, index) => {
                    const isToday = day && day.toDateString() === today.toDateString();
                    const isSelected = selectedDate && day && day.toDateString() === selectedDate.toDateString();
                    // Ne rien faire si la case est vide (pas de jour)
                    const handleClick = () => { if (day) setSelectedDate(day); };
                    return (
                      <div
                        key={index}
                        className={`bg-white min-h-[60px] p-1 ${day ? 'cursor-pointer hover:bg-gray-50' : 'cursor-default'} transition-colors ${
                          isSelected ? 'ring-2 ring-primary' : ''
                        }`}
                        onClick={day ? () => setSelectedDate(day) : undefined}
                        style={{ position: 'relative' }}
                      >
                        {day && (
                          <>
                            <div className="flex justify-between items-start mb-1">
                              <span className={`text-sm font-medium ${
                                isToday
                                  ? 'bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center'
                                  : day.getMonth() !== currentDate.getMonth()
                                    ? 'text-gray-400'
                                    : 'text-gray-900'
                              }`}>
                                {day.getDate()}
                              </span>
                            </div>
                            {/* Événements (réservations + blocages) couvrant ce jour, juste sous la date */}
                            {(events && selectedBoatId) && events.filter(res => {
                              if (res.boatId !== selectedBoatId) return false;
                              const dayTime = day && day instanceof Date ? new Date(day).setHours(0,0,0,0) : null;
                              const startTime = res.start && res.start instanceof Date ? new Date(res.start).setHours(0,0,0,0) : null;
                              const endTime = res.end && res.end instanceof Date ? new Date(res.end).setHours(0,0,0,0) : null;
                              return dayTime !== null && startTime !== null && endTime !== null && startTime <= dayTime && endTime >= dayTime;
                            }).map(res => (
                              <div
                                key={res.id + '-d' + day.getTime()}
                                className={`h-5 border rounded px-1 text-[11px] font-semibold flex items-center overflow-hidden truncate cursor-pointer mt-2 ${res.type==='block' ? 'bg-red-200 border-red-400 text-red-900' : 'bg-blue-200 border-blue-400 text-blue-900'}`}
                                title={`${res.title} — Du ${res.start.toLocaleDateString('fr-FR')} au ${res.end.toLocaleDateString('fr-FR')}`}
                                onClick={e => { e.stopPropagation(); setSelectedReservation(res); }}
                              >
                                {res.title}
                              </div>
                            ))}
                          </>
                        )}
                      </div>
                    );
                  })}


                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Mini Calendar */}
              <div className="card p-4">
                <h3 className="font-semibold text-marine mb-3">Navigation rapide</h3>
                <div className="text-center">
                  <div className="text-sm font-medium text-gray-700 mb-2">
                    {months[currentDate.getMonth()]} {currentDate.getFullYear()}
                  </div>
                  <div className="grid grid-cols-7 gap-1 text-xs">
                    {weekDays.map(day => (
                      <div key={day} className="p-1 text-gray-500 font-medium">
                        {day.charAt(0)}
                      </div>
                    ))}
                    {days.map((day, index) => (
                      <button
                        key={index}
                        className={`p-1 rounded hover:bg-gray-100 ${
                          day && day.toDateString() === today.toDateString()
                            ? 'bg-primary text-white'
                            : day && day.getMonth() !== currentDate.getMonth()
                              ? 'text-gray-400'
                              : 'text-gray-700'
                        }`}
                        onClick={() => day && setSelectedDate(day)}
                      >
                        {day ? day.getDate() : ''}
                      </button>
                    ))}
                  </div>
                </div>
              </div>


              {/* Event Statistics */}
              <div className="card p-4">
                <h3 className="font-semibold text-marine mb-3">Statistiques du mois</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Réservations</span>
                    <span className="font-semibold text-primary">
                      {events.filter(e => e.type === 'reservation').length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Maintenances</span>
                    <span className="font-semibold text-orange-600">
                      {events.filter(e => e.type === 'maintenance').length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Inspections</span>
                    <span className="font-semibold text-purple-600">
                      {events.filter(e => e.type === 'inspection').length}
                    </span>
                  </div>
                  <hr className="my-2" />
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-900">Total événements</span>
                    <span className="font-bold text-marine">{events.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Selected Date Events Detail */}
          {selectedDate && (
            <div className="mt-8">
              <div className="card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-marine">
                    Événements du {selectedDate.toLocaleDateString('fr-FR', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </h3>
                  <button
                    onClick={() => setSelectedDate(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>

                {/* Formulaire de blocage rapide (propriétaire) */}
                {currentUser?.role === 'propriétaire' && boats.length > 0 && selectedBoatId && (
                  <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <h4 className="font-semibold text-gray-800 mb-3">Bloquer le calendrier</h4>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
                      <div className="flex flex-col">
                        <label className="text-xs text-gray-600 mb-1">Du</label>
                        <input type="date" className="border rounded px-2 py-1" value={blockStart} onChange={e=>setBlockStart(e.target.value)} />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-xs text-gray-600 mb-1">Au</label>
                        <input type="date" className="border rounded px-2 py-1" value={blockEnd} onChange={e=>setBlockEnd(e.target.value)} />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-xs text-gray-600 mb-1">Raison</label>
                        <select className="border rounded px-2 py-1" value={blockReason} onChange={e=>setBlockReason(e.target.value)}>
                          <option value="maintenance">Maintenance</option>
                          <option value="personnel">Personnel</option>
                          <option value="inspection">Inspection</option>
                          <option value="autre">Autre</option>
                        </select>
                      </div>
                      <div className="md:col-span-2 flex flex-col">
                        <label className="text-xs text-gray-600 mb-1">Notes</label>
                        <input type="text" placeholder="Notes (optionnel)" className="border rounded px-2 py-1" value={blockNotes} onChange={e=>setBlockNotes(e.target.value)} />
                      </div>
                    </div>
                    {blockError && <div className="text-red-600 text-sm mt-2">{blockError}</div>}
                    <div className="mt-3 flex justify-end">
                      <button className="btn-primary" disabled={creatingBlock} onClick={async ()=>{
                        try {
                          setBlockError('');
                          setCreatingBlock(true);
                          if (!blockStart || !blockEnd) { setBlockError('Veuillez sélectionner une plage de dates'); return; }
                          const payload = { boatId: selectedBoatId, startDate: blockStart, endDate: blockEnd, reason: blockReason, notes: blockNotes };
                          await blockedDateService.create(payload);
                          // reset
                          setBlockNotes('');
                          // rafraîchir les événements
                          const blocks = await blockedDateService.listByBoat(selectedBoatId);
                          const mappedBlocks = (blocks||[]).map(b=>({ id:b._id, title:`Bloqué: ${b.reason}`, start:new Date(b.startDate), end:new Date(b.endDate), type:'block', reason:b.reason, notes:b.notes, boatId:b.boat, status:'indisponible'}));
                          // conserver les réservations existantes
                          setEvents(prev => [ ...(prev.filter(e=>e.type!=='block')), ...mappedBlocks ]);
                        } catch(e) {
                          setBlockError(e?.response?.data?.message || e?.message || 'Erreur lors du blocage');
                        } finally {
                          setCreatingBlock(false);
                        }
                      }}>Bloquer</button>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  {getEventsForDate(selectedDate).length > 0 ? (
                    getEventsForDate(selectedDate).map(event => (
                      <div key={event.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h4 className="font-semibold text-gray-900">{event.title}</h4>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEventTypeColor(event.type)}`}>
                                {event.type}
                              </span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                                {event.status}
                              </span>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                              <div className="flex items-center space-x-2">
                                <ClockIcon className="h-4 w-4" />
                                <span>{event.start?.toLocaleDateString('fr-FR')} → {event.end?.toLocaleDateString('fr-FR')}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <UserIcon className="h-4 w-4" />
                                <span>{event.client || (event.type==='block' ? 'Propriétaire' : '')}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <MapPinIcon className="h-4 w-4" />
                                <span>{event.location}</span>
                              </div>
                            </div>
                            {event.type==='block' && event.notes && (
                              <div className="text-sm text-gray-700 mt-2">Notes: {event.notes}</div>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-2 ml-4">
                            <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                              <EyeIcon className="h-4 w-4" />
                            </button>
                            {event.type==='reservation' && (
                              <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors" onClick={() => { setEditTarget(event); setEditOpen(true); }}>
                                <PencilIcon className="h-4 w-4" />
                              </button>
                            )}
                            {event.type==='block' && (
                              <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" onClick={async ()=>{
                                try {
                                  await blockedDateService.remove(event.id);
                                  setEvents(prev => prev.filter(e => !(e.type==='block' && e.id===event.id)));
                                } catch(e) {
                                  // TODO: notification
                                }
                              }}>
                                <TrashIcon className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="mt-6 text-center text-gray-500">
                      <CalendarIcon className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                      <p>Aucun événement prévu pour cette date</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Bouton retour au dashboard */}
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => navigate('/owner/dashboard')}
              className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-6 rounded-md transition-colors"
            >
              Retour au tableau de bord
            </button>
          </div>
        </div>
      </main>
      {/* Panneau latéral de détail réservation */}
      <ReservationDetailModal reservation={selectedReservation} onClose={() => setSelectedReservation(null)} />

      {/* Modale d'édition de réservation */}
      <ReservationEditModal
        reservation={editTarget ? { ...editTarget, startDate: editTarget.start, endDate: editTarget.end, status: editTarget.status } : null}
        open={editOpen}
        errorMessage={editError}
        onClose={() => { setEditOpen(false); setEditTarget(null); setEditError(''); }}
        onSave={async (form) => {
          try {
            setEditError('');
            // Client-side validation to avoid 409: check overlap with same boat events (excluding current)
            const s = new Date(form.startDate);
            const e = new Date(form.endDate);
            // Normalize to midnight to avoid time-based off-by-one
            s.setHours(0,0,0,0);
            e.setHours(0,0,0,0);
            if (!(s instanceof Date) || isNaN(s) || !(e instanceof Date) || isNaN(e) || s >= e) {
              setEditError('Plage de dates invalide.');
              return;
            }
            const overlaps = (ev) => {
              const evStart = new Date(ev.start); evStart.setHours(0,0,0,0);
              const evEnd = new Date(ev.end || ev.start); evEnd.setHours(0,0,0,0);
              // Strict comparisons to allow adjacent ranges (no conflict if e === evStart or s === evEnd)
              return s < evEnd && e > evStart;
            };
            const sameBoatFilter = (ev) => (!selectedBoatId || ev.boatId === selectedBoatId);
            const currentId = editTarget?.reservationId || editTarget?.id;
            const conflictReservation = events
              .filter(ev => ev.type === 'reservation' && (ev.reservationId || ev.id) !== currentId && sameBoatFilter(ev))
              .some(overlaps);
            if (conflictReservation) {
              setEditError('Chevauchement avec une autre réservation.');
              return;
            }
            const conflictBlock = events
              .filter(ev => ev.type === 'block' && sameBoatFilter(ev))
              .some(overlaps);
            if (conflictBlock) {
              setEditError('Chevauchement avec une période bloquée.');
              return;
            }
            const id = editTarget?.reservationId || editTarget?.id;
            await reservationService.updateReservation(id, {
              startDate: form.startDate,
              endDate: form.endDate,
              status: form.status,
            });
            setEditOpen(false);
            setEditTarget(null);
            await fetchEvents();
          } catch (e) {
            const msg = e?.message || e?.response?.data?.message || 'Échec de la mise à jour';
            setEditError(msg);
            console.error('Update reservation failed', e);
          }
        }}
      />

      {/* Footer - identique à OwnerDashboard */}
      <footer className="bg-primary text-white mt-12 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-montserrat font-bold text-lg mb-4">À PROPOS</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:underline">À propos</a></li>
                <li><a href="#" className="hover:underline">Politique de confidentialité</a></li>
                <li><a href="#" className="hover:underline">CGU</a></li>
                <li><a href="#" className="hover:underline">Mentions légales</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-montserrat font-bold text-lg mb-4">NOUS FAIRE CONFIANCE</h3>
              <div className="flex items-center mb-2">
                <svg className="w-5 h-5 text-coral" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
                <svg className="w-5 h-5 text-coral" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
                <svg className="w-5 h-5 text-coral" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
                <svg className="w-5 h-5 text-coral" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
                <svg className="w-5 h-5 text-coral" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
              </div>
              <p>Note : 4.8 / 5 calculée à partir de 5 000 avis</p>
              <a href="#" className="text-coral hover:underline mt-2 inline-block">Avis de notre communauté</a>
            </div>
            
            <div>
              <h3 className="font-montserrat font-bold text-lg mb-4">CONTACT</h3>
              <p className="mb-2">Besoin de conseils ?</p>
              <p className="mb-2">Nous sommes joignables :</p>
              <p className="mb-1">Du lundi au vendredi : 8h00 à 20h00</p>
              <p className="mb-2">Samedi et Dimanche : 10h00 à 18h00</p>
              <a href="mailto:contact@sailingloc.com" className="flex items-center text-coral hover:underline">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
                contact@sailingloc.com
              </a>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-blue-700 text-center">
            <p>&copy; 2025 SailingLoc. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Calendrier;
