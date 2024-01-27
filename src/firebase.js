// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDzpPpkcaarX7VzwAd6k_RrAKGS2SZUPR8",
  authDomain: "photo-image-manager.firebaseapp.com",
  projectId: "photo-image-manager",
  storageBucket: "photo-image-manager.appspot.com",
  messagingSenderId: "887349565317",
  appId: "1:887349565317:web:e872d052520810c53ad6ec",
};




// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage=getStorage(app);
const db=getFirestore(app);
export {storage,db};