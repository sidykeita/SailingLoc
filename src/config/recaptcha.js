// Configuration reCAPTCHA (frontend)
// Utilise les variables d'environnement Vite

export const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY || '';
export const isRecaptchaEnabled = String(import.meta.env.VITE_RECAPTCHA_ENABLED || 'false').toLowerCase() === 'true' && !!RECAPTCHA_SITE_KEY;
