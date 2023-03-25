import { writable, readonly, derived } from "svelte/store";

export const VEHICLE = writable({});

export const RECALLS = derived(VEHICLE, async ($vehicle, set) => {
    if($vehicle.make && $vehicle.model && $vehicle.year){
        fetch(`https://nhtsa.techgfx.workers.dev/recalls/recallsByVehicle?make=${$vehicle.make}&model=${$vehicle.model}&modelYear=${$vehicle.year}`)
            .then(res => res.json())
            .then(data => {
                console.log(data)
                set(data)
            });
    } else {
        set({
            results: [],
            Count: 0
        });
    }
});

export const COMPLAINTS = derived(VEHICLE, async ($vehicle, set) => {

    if($vehicle.make && $vehicle.model && $vehicle.year){
        fetch(`https://nhtsa.techgfx.workers.dev/complaints/complaintsByVehicle?make=${$vehicle.make}&model=${$vehicle.model}&modelYear=${$vehicle.year}`)
        .then(res => res.json())
        .then(data => {
            console.log(data)
            set(data);
        });
    } else {
        set({
            results: [],
            count: 0
        });
    }
});