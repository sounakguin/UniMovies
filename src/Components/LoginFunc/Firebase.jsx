import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAdWEGlDCtW0-zRsk33j3ptBELOuDul2bg",
  authDomain: "unimovies-ea2cf.firebaseapp.com",
  projectId: "unimovies-ea2cf",
  storageBucket: "unimovies-ea2cf.appspot.com",
  messagingSenderId: "576546897089",
  appId: "1:576546897089:web:10de61325e7872ba736840"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
