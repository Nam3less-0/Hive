// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { setPersistence } from "firebase/auth";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // <-- Import getStorage

// Your web app's Firebase configuration
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
const storage = getStorage(app); // <-- Initialize storage
const provider = new GoogleAuthProvider();

// For logging in with Google (only if account exists in Firestore)
const signInWithGoogleForLogin = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      // ✅ Allow login
      return { user, exists: true };
    } else {
      // ❌ Not registered — kick out
      await signOut(auth);
      await user.delete(); // Optional: remove untracked Firebase Auth user
      return { user: null, exists: false, error: "No account found. Please register first." };
    }

  } catch (error) {
    console.error("Google Login Error:", error);
    return { user: null, exists: false, error: "Login failed. Try again." };
  }
};




// For registering with Google (create user + save to Firestore)
const signInWithGoogleForRegister = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      // ❌ Prevent duplicate registration
      await signOut(auth);
      await user.delete(); // Optional: clean up
      return { user: null, exists: true, error: "This Google account is already registered. Please login." };
    }

    // ✅ New user — register
    await setDoc(userRef, {
      uid: user.uid,
      name: user.displayName,
      email: user.email,
      createdAt: new Date()
    });

    return { user, exists: false };

  } catch (error) {
    console.error("Google Registration Error:", error);
    return { user: null, exists: false, error: "Registration failed. Try again." };
  }
};

const logOut = async () => {
  try {
    await signOut(auth);
    console.log("User signed out.");
  } catch (error) {
    console.error("Sign-Out Error:", error);
  }
};


export { auth, db, storage, signInWithGoogleForLogin, signInWithGoogleForRegister, logOut }; // <-- Export storage
