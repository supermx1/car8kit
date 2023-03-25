import { writable, readable } from "svelte/store";
export const USER = writable(null); // Should be set to null

export const LOGO = writable("/Car8.png");
export const globalStarRating = writable(5);
export const rateVehicle = writable({
    vin: "",
    vehicleType: null,
    vehicleBrand: "",
    vehicleModel: "",
    vehicleYear: null,
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

