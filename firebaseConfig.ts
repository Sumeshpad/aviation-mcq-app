import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDN4k9yizuZSxduvGFEFYZ9vhacHVOLN08",
    authDomain: "aviation-mcq-app.firebaseapp.com",
    projectId: "aviation-mcq-app",
    storageBucket: "aviation-mcq-app.firebasestorage.app",
    messagingSenderId: "122681192357",
    appId: "1:122681192357:web:b9afe321cdc20766b9c24c"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };