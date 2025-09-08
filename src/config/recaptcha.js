// Configuration reCAPTCHA (frontend)
// Utilise les variables d'environnement Vite

// Debug
console.log('VITE_RECAPTCHA_ENABLED:', import.meta.env.VITE_RECAPTCHA_ENABLED);
console.log('VITE_RECAPTCHA_SITE_KEY:', import.meta.env.VITE_RECAPTCHA_SITE_KEY);

export const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY || '';
export const isRecaptchaEnabled = String(import.meta.env.VITE_RECAPTCHA_ENABLED || 'false').toLowerCase() === 'true' && !!RECAPTCHA_SITE_KEY;

// Debug
console.log('RECAPTCHA_SITE_KEY:', RECAPTCHA_SITE_KEY);
console.log('isRecaptchaEnabled:', isRecaptchaEnabled);
