import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "smart-curtains-windows.firebaseapp.com",
  databaseURL: "https://smart-curtains-windows-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "smart-curtains-windows",
  storageBucket: "smart-curtains-windows.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app); // ganti jadi `db` agar sesuai dengan file lain

export { db }; // ekspor sebagai `db`
