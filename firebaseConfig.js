import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBXeWfDPNNxCpjRdZ_UvLSmCqijJOovN9M",
  authDomain: "productrealtime.firebaseapp.com",
  projectId: "productrealtime",
  storageBucket: "productrealtime.appspot.com",
  messagingSenderId: "317615249069",
  appId: "1:317615249069:web:abc18e07aa68a427e49824",
};

export const app = initializeApp(firebaseConfig);
export const database = getFirestore(app);
