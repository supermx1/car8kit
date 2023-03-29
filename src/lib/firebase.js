// Import the functions you need from the SDKs you need
import {initializeApp} from "firebase/app";
import {getAnalytics} from "firebase/analytics";
import {getAuth, onAuthStateChanged} from "firebase/auth";
import { initializeFirestore, CACHE_SIZE_UNLIMITED, enableIndexedDbPersistence, } from "firebase/firestore";
import { USER } from "$lib/store.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
    apiKey: "AIzaSyBzqLwQHj9B_DwB8IvqdHPYmW81o8dp_R0",
    authDomain: "car8-ng.firebaseapp.com",
    projectId: "car8-ng",
    storageBucket: "car8-ng.appspot.com",
    messagingSenderId: "998345560080",
    appId: "1:998345560080:web:f555c68572a691627e3a95",
    measurementId: "G-0FBBKHK0YX"
};

export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);




// fire state change on refresh, when a page is refreshed. The user is set
onAuthStateChanged(getAuth(), (user) => {
    USER.set(user);
    if(user){
        if(
            [
                "/",
                "/login",
                "/register"
            ].includes(window.location.pathname)
        ){
            window.location.pathname = "/home";
        }
    } else {

        // window.location.pathname = "/login";
    }
});
