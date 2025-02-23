// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth} from "firebase/auth"
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCEK7HWVSQeuWL04idbC9lcONZYgM8lKWY",
  authDomain: "hive-1d75b.firebaseapp.com",
  projectId: "hive-1d75b",
  storageBucket: "hive-1d75b.firebasestorage.app",
  messagingSenderId: "261182857203",
  appId: "1:261182857203:web:eb954542bafc2f5e843c86",
  measurementId: "G-9C5LC9XN03"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export {auth, db};