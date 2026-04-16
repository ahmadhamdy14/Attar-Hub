import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyADjmnAO27aGCGiNcpOKlW-LU_yarBLyrI",
  authDomain: "attar-hub.firebaseapp.com",
  projectId: "attar-hub",
  storageBucket: "attar-hub.appspot.com",
  messagingSenderId: "463116358273",
  appId: "1:463116358273:web:c9a55d779bbc93a2bdb380",
};

const app = initializeApp(firebaseConfig);

// 🔐 Auth
export const auth = getAuth(app);

// 🗄️ Firestore
export const db = getFirestore(app);


export const storage = getStorage(app);