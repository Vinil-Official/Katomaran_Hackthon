// Import the functions you need from the SDKs you need
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getApps, initializeApp } from "firebase/app";
import { getAuth, getReactNativePersistence, initializeAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC1m8ZFe40hn8tS6kgE8og3-FN3H8gUNX8",
  authDomain: "myhackthon-cb680.firebaseapp.com",
  projectId: "myhackthon-cb680",
  storageBucket: "myhackthon-cb680.firebasestorage.app",
  messagingSenderId: "909233606464",
  appId: "1:909233606464:web:682413f9ffd3876a14f4a5"
};
let auth;
if(getApps().length==0){
// Initialize Firebase
const app = initializeApp(firebaseConfig);
auth=initializeAuth(app,{
    persistence:getReactNativePersistence(ReactNativeAsyncStorage)
})
}else{
    auth=getAuth();
}

export default auth;