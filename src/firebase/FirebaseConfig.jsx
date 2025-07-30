// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {  getFirestore } from "firebase/firestore";
import {  getAuth} from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCBKeBwV2Nx5yRhX1tiW0i1YSbvCzkBwVk",
  authDomain: "blogapp-b9933.firebaseapp.com",
  projectId: "blogapp-b9933",
  storageBucket: "blogapp-b9933.firebasestorage.app",
  messagingSenderId: "1042476964905",
  appId: "1:1042476964905:web:a17bb4b991e66491691038",
  measurementId: "G-XLMMG08Z0S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const fireDB = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { fireDB, auth, storage }