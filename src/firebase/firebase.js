import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth, signInAnonymously } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBF7l5efj-BLr64d0k8lYVTCO_O8skRE3c",
  authDomain: "smart-curtains-windows.firebaseapp.com",
  databaseURL: "https://smart-curtains-windows-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "smart-curtains-windows",
  storageBucket: "smart-curtains-windows.firebasestorage.app",
  messagingSenderId: "1098651263177",
  appId: "1:1098651263177:web:16847bf14bc81469672d18"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

signInAnonymously(auth)
  .then(() => {
    console.log("Signed in anonymously");
  })
  .catch((error) => {
    console.error("Anonymous sign-in failed:", error);
  });

export { db, auth };
