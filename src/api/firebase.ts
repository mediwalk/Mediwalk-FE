import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBR6YC5PLxEECIf5RVGu8O8IW__WCUcSO8",
  authDomain: "mediwalk-58926.firebaseapp.com",
  projectId: "mediwalk-58926",
  storageBucket: "mediwalk-58926.firebasestorage.app",
  messagingSenderId: "423699278356",
  appId: "1:423699278356:web:8132b137ebecf2ab8a1501",
  measurementId: "G-258G0LBGEZ",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
