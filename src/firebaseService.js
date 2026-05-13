import { db } from './firebase'
import {
  collection, getDocs, addDoc, deleteDoc,
  updateDoc, doc, query, where, serverTimestamp
} from 'firebase/firestore'

// ── CLASSES ──────────────────────────────────────
export async function getClasses() {
  const snapshot = await getDocs(collection(db, 'classes'))
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function ajouterClasseDB(nom) {
  const ref = await addDoc(collection(db, 'classes'), { nom })
  return ref.id
}

export async function supprimerClasseDB(id) {
  await deleteDoc(doc(db, 'classes', id))
}

export async function modifierClasseDB(id, nom) {
  await updateDoc(doc(db, 'classes', id), { nom })
}

// ── ÉTUDIANTS ────────────────────────────────────
export async function getEtudiants() {
  const snapshot = await getDocs(collection(db, 'etudiants'))
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function ajouterEtudiantDB(nom, classeId) {
  const ref = await addDoc(collection(db, 'etudiants'), { nom, classeId })
  return ref.id
}

export async function supprimerEtudiantDB(id) {
  await deleteDoc(doc(db, 'etudiants', id))
}

export async function modifierEtudiantDB(id, nom) {
  await updateDoc(doc(db, 'etudiants', id), { nom })
}

// ── NOTES ────────────────────────────────────────
export async function getNotes() {
  const snapshot = await getDocs(collection(db, 'notes'))
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function ajouterNoteDB(note) {
  const ref = await addDoc(collection(db, 'notes'), note)
  return ref.id
}

export async function supprimerNoteDB(id) {
  await deleteDoc(doc(db, 'notes', id))
}

// ── PROFESSEURS ───────────────────────────────────
export async function ajouterProfesseurDB(form) {
  await addDoc(collection(db, 'professeurs'), {
    prenom: form.prenom,
    nom: form.nom,
    email: form.email.toLowerCase(),
    motDePasse: form.motDePasse,
    etablissement: form.etablissement,
    matiere: form.matiere,
    classesGerees: form.classesGerees,
    bloque: false,
    enligne: false,
    createdAt: new Date().toISOString()
  })
}

export async function getProf(email, motDePasse) {
  const q = query(
    collection(db, 'professeurs'),
    where('email', '==', email.toLowerCase())
  )
  const snapshot = await getDocs(q)
  if (snapshot.empty) return null
  const d = snapshot.docs[0]
  const prof = { id: d.id, ...d.data() }
  if (prof.motDePasse !== motDePasse) return null
  if (prof.bloque) return 'bloque'
  return prof
}

export async function getProfs() {
  const snapshot = await getDocs(collection(db, 'professeurs'))
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function bloquerProfDB(id, bloque) {
  await updateDoc(doc(db, 'professeurs', id), { bloque })
}

export async function setEnLigneDB(id, enligne) {
  await updateDoc(doc(db, 'professeurs', id), {
    enligne,
    derniereConnexion: enligne ? new Date().toISOString() : null
  })
}