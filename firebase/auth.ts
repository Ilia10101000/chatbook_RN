import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage, ref } from "firebase/storage";
import { getDatabase } from "firebase/database";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import {
  API_API_KEY,
  API_AUTH_DOMAIN,
  API_PROJECT_ID,
  API_DATABASE_URL,
  API_STORAGE_BUCKET,
  API_MESSAGING_SENDER_ID,
  API_APP_ID,
} from "@env";

const firebaseConfig = {
  apiKey: API_API_KEY,
  authDomain: API_AUTH_DOMAIN,
  databaseURL: API_DATABASE_URL,
  projectId: API_PROJECT_ID,
  storageBucket: API_STORAGE_BUCKET,
  messagingSenderId: API_MESSAGING_SENDER_ID,
  appId: API_APP_ID,
};


const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
const db = getFirestore(app);
const realTimeDB = getDatabase(app);
const storage = getStorage(app);


export { app, auth, db, realTimeDB, storage, ref };

