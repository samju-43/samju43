// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA0ZxcNrXWFnZA09g3N06OjDRsArSZxFOM",
  authDomain: "samju43-77197.firebaseapp.com",
  projectId: "samju43-77197",
  storageBucket: "samju43-77197.firebasestorage.app",
  messagingSenderId: "609854553114",
  appId: "1:609854553114:web:d742373fa6dd716bdde5a3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

