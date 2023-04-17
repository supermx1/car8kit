// Import the functions you need from the SDKs you need
import {initializeApp} from "firebase/app";
import {getAnalytics} from "firebase/analytics";
import {getAuth, onAuthStateChanged} from "firebase/auth";
import { getFirestore, collection, setDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { initializeFirestore, CACHE_SIZE_UNLIMITED, enableIndexedDbPersistence, } from "firebase/firestore";
import { USER, USER_DATA } from "$lib/store.js";
import { goto } from "$app/navigation";

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


// fire state change on refresh, when a page is refreshed. The user is set1
let isLoggingOut = false;

onAuthStateChanged(getAuth(), async (user) => {
    createUserData(user).then();
    USER.set(user);
    if (user) {
        if ([
            '/',
            '/login',
            '/register',
        ].includes(window.location.pathname)) {
            window.location.pathname = '/home';
        }
    } else {
        if (window.location.pathname !== '/login') {
            window.location.pathname = '/login';
        }
    }
});

// Create user data
async function createUserData (user){
    if(!user.uid) return;
    const db = getFirestore();
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);
    if(!userSnap.exists()){
        await setDoc(userRef, {
            reviews: [],
            uid: user.uid,
            email: user.email,
            name: user.displayName,
            photoURL: user.photoURL,
            phoneNumber: user.phoneNumber,
            emailVerified: user.emailVerified,
            createdAt: new Date().toISOString(),
        });
    }
    else {
        // set in store
        USER_DATA.set(userSnap.data());

    }
}