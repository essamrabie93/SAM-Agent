
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, getDocs, doc, setDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { KBEntry, AssetEntry } from '../types';

// IMPORTANT: Replace these with your project's values from the Firebase Console
// Settings > Project Settings > General > Your apps > SDK setup and configuration (Config)
const firebaseConfig = {
  apiKey: "AIzaSyCUjoFhNw85B2q3m7l84nIuqSycxCEUvpk",
  authDomain: "sam-agent-856e0.firebaseapp.com",
  databaseURL: "https://sam-agent-856e0-default-rtdb.firebaseio.com",
  projectId: "sam-agent-856e0",
  storageBucket: "sam-agent-856e0.firebasestorage.app",
  messagingSenderId: "302724990926",
  appId: "1:302724990926:web:1f996a3dfa86279987cd9f",
  measurementId: "G-KJGJ2EB47L"
};

let db: any = null;

try {
  // Only initialize if we have a valid project ID
  if (firebaseConfig.projectId !== "YOUR_PROJECT_ID") {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    console.log("🔥 Firebase Connected Successfully");
  }
} catch (e) {
  console.warn("Firebase initialization skipped: Config not provided.");
}

export const isFirebaseActive = () => db !== null;

export const fetchCloudKB = async (): Promise<KBEntry[]> => {
  if (!db) return [];
  const querySnapshot = await getDocs(collection(db, "kb"));
  return querySnapshot.docs.map(doc => doc.data() as KBEntry);
};

export const saveCloudKBEntry = async (entry: KBEntry) => {
  if (!db) return;
  await setDoc(doc(db, "kb", entry.id), entry);
};

export const deleteCloudKBEntry = async (id: string) => {
  if (!db) return;
  await deleteDoc(doc(db, "kb", id));
};

export const fetchCloudAssets = async (): Promise<AssetEntry[]> => {
  if (!db) return [];
  const querySnapshot = await getDocs(collection(db, "assets"));
  return querySnapshot.docs.map(doc => doc.data() as AssetEntry);
};

export const saveCloudAsset = async (asset: AssetEntry) => {
  if (!db) return;
  // We use email as the document ID because it is unique
  await setDoc(doc(db, "assets", asset.email.toLowerCase().trim()), asset);
};

export const deleteCloudAsset = async (email: string) => {
  if (!db) return;
  await deleteDoc(doc(db, "assets", email.toLowerCase().trim()));
};
