import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js';

const firebaseConfig = {
  apiKey: "AIzaSyDU22HV3tR_N0znMg8VO85xBh9CeOlF33w",
  authDomain: "gamepulse-482d3.firebaseapp.com",
  projectId: "gamepulse-482d3",
  storageBucket: "gamepulse-482d3.firebasestorage.app",
  messagingSenderId: "490295698723",
  appId: "1:490295698723:web:43191c38f0858986c49896",
  measurementId: "G-GFK4S3LVVP"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
