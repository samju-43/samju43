import emailjs from '@emailjs/browser'

const SERVICE_ID = 'service_cqmezgg'       // ← remplace
const TEMPLATE_ID = 'template_vcbbnbd'     // ← remplace
const PUBLIC_KEY = 'xa0MEtWhVubgzQtl2'        // ← remplace

// Génère un code à 6 chiffres
export function genererCode() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Envoie le code par mail
export async function envoyerCodeConfirmation(email, prenom, nom, code) {
  await emailjs.send(
    SERVICE_ID,
    TEMPLATE_ID,
    {
      prenom,
      nom,
      code,
      To_email: email,
    },
    PUBLIC_KEY
  )
}