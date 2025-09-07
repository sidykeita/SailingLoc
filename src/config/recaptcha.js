// Clé de test - À remplacer par votre clé de production dans les environnements de production
export const RECAPTCHA_SITE_KEY = '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'; // Clé de test de Google

export const isRecaptchaEnabled = process.env.NODE_ENV === 'production';
