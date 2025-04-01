// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAhjAo4m-9ijxXxidbb7W3UimUlT-YZTJA",
  authDomain: "image-bd997.firebaseapp.com",
  projectId: "image-bd997",
  storageBucket: "image-bd997.firebasestorage.app",
  messagingSenderId: "709914194941",
  appId: "1:709914194941:web:dd922f5cfb18b89bad1f94",
  measurementId: "G-PVK94V2T4Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };