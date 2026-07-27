/* ============ FIREBASE CONFIG ============ */
const firebaseConfig = {
  apiKey: "AIzaSyBjMv5lhUQxDQdC3mihSH4Ep3ctFGxUZQY",
  authDomain: "cjnsite-d3f3f.firebaseapp.com",
  projectId: "cjnsite-d3f3f",
  storageBucket: "cjnsite-d3f3f.firebasestorage.app",
  messagingSenderId: "491318197551",
  appId: "1:491318197551:web:5a3c8fd938d94d924cf5da",
  measurementId: "G-JES3G3L45V"
};

var db = null;
var auth = null;
var storage = null;
var firebaseReady = false;

try {
  firebase.initializeApp(firebaseConfig);
  if (typeof firebase.firestore === 'function') {
    db = firebase.firestore();
  }
  if (typeof firebase.auth === 'function') {
    auth = firebase.auth();
  }
  if (typeof firebase.storage === 'function') {
    storage = firebase.storage();
  }
  firebaseReady = true;
} catch (err) {
  console.warn("Firebase init failed (placeholder config?):", err);
  firebaseReady = false;
}

// Detect placeholder configs (e.g. apiKey starts with YOUR_) so we don't try to talk to Firestore
const isRealConfig = firebaseConfig.apiKey && !firebaseConfig.apiKey.includes('YOUR_');
if (!isRealConfig) {
  console.warn('Firebase placeholder config detected — using demo data only');
  firebaseReady = false;
}
