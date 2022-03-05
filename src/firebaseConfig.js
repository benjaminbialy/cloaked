import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { initializeApp } from 'firebase/app';
import { getDatabase } from "firebase/database";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';


// your firebaseConfig object

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);
const database = getDatabase(app);

export { auth, db, database };