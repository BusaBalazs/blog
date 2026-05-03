import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCyPTB239lfNIRigkZ9N5JjndQ9x2lvPFg",
  authDomain: "blog-dev-4f6d0.firebaseapp.com",
  projectId: "blog-dev-4f6d0",
  storageBucket: "blog-dev-4f6d0.firebasestorage.app",
  messagingSenderId: "902785405922",
  appId: "1:902785405922:web:47f3db657e1f471751dfbb"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);