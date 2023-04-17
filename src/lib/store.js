import { writable, readable } from "svelte/store";
import { getFirestore, collection, setDoc, doc, getDoc, updateDoc } from "firebase/firestore";

export const USER = writable(null); // Should be set to null
export const USER_DATA = writable(null); // Should be set to null
USER_DATA.subscribe(value => {
    if(!value) return;
    if(!value.uid) return;


    const DB = getFirestore();
    const userRef = doc(DB, "users", value.uid);
    updateDoc(userRef, value).then(() => {

    }).catch(err => {
        console.log("ERROR UPDATING USER DATA IN FIRESTORE: ", err);
    });
});

export const LOGO = writable("/Car8.png");
export const globalStarRating = writable(5);
export const rateVehicle = writable({
    vin: "",
    vehicleType: "",
    vehicleBrand: "",
    vehicleModel: "",
    vehicleYear: null,
    coordinates: {
        longitude: 0,
        latitude: 0,
    }
})

export const recall = writable({});
export const complaints = writable([]);

export const VEHICLE_DB = readable([], function start(set){
    fetch("https://cdn.jsdelivr.net/gh/techgfxlimited/vehicles-db@main/vehicles.json")
        .then(res => res.json())
        .then(data => {
            set(data)
        });
})

export const version = writable("v1.0.3");

