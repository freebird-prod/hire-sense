// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBcACA_EAbs_X1kYTUiIpxqujJtPh7teCg",
    authDomain: "dharun-kumar-apps.firebaseapp.com",
    projectId: "dharun-kumar-apps",
    storageBucket: "dharun-kumar-apps.firebasestorage.app",
    messagingSenderId: "303638793489",
    appId: "1:303638793489:web:43ec01542e6a3859a590b0",
    measurementId: "G-9Z2ZSKMYYD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
// const analytics = getAnalytics(app);