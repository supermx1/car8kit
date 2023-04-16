<script>
    import {
        Page, Navbar, Link,  Popup, Block, Toast, Button
    } from 'konsta/svelte';
    import { Geolocation } from '@capacitor/geolocation';
    import {rateVehicle, USER_DATA} from "$lib/store.js";
    import * as L from 'leaflet/dist/leaflet.js'
    import  'leaflet/dist/leaflet.css'
    import { fly } from 'svelte/transition';
    import Header from "$lib/components/Header.svelte";
    import {onMount} from "svelte";

    let disabled = true;
    let loading = false;
    let error = false;
    let latitude = 0;
    let longitude = 0;


    async function getCurrentPosition() {
        let coords = await Geolocation.getCurrentPosition();
        latitude = coords.coords.latitude;
        longitude = coords.coords.longitude;
    }

    let map;
    let mapID = (Date.now()).toString(36) + Math.random().toString(36).substring(2);
    let carIcon = L.icon({
        iconUrl: '/car-icon.png',
        iconSize:     [35, 35], // size of the icon
        iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
        popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
    });
    let motorcycleIcon = L.icon({
        iconUrl: '/motorbike-icon.png',
        iconSize:     [35, 35], // size of the icon
        iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
        popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
    });

    let myIcon = L.icon({
        iconUrl: '/my-icon.png',
        iconSize:   [20, 20], // point of the icon which will correspond to marker's location
        iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
        popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
    });

    async function loadMap(lat, long){
        map = L.map(mapID).setView([lat, long], 13);
        L.tileLayer('https://mt0.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
            tileSize: 256,
            // attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
            maxZoom: 19,
        }).addTo(map);

        L.marker([lat, long], {icon: myIcon}).addTo(map)
            .bindPopup('You are here')
            .openPopup();

        for(const m of $USER_DATA['reviews']) {
            let marker = L.marker([m.coordinates.latitude, m.coordinates.longitude], {icon: m.vehicleType == "Car" ? carIcon : motorcycleIcon}).addTo(map);
            marker.bindPopup(`
            <a href="${'/home/vehicle/' + m.id}">
            <b>${m.vehicleYear} ${m.vehicleBrand} ${m.vehicleModel}</b>
            <br>${m.vin}<br><i class="fa-solid fa-star text-yellow-300 mr-1"></i>${m.rating}</a>
            `);
        }
    }

    onMount(async () => {
        await getCurrentPosition();
        await loadMap(latitude, longitude);
    });


</script>
<svelte:head>
    <title>Map</title>
    <meta name="description" content="Map" />
</svelte:head>
<Page>
    <div transition:fly="{{ x: 200, duration: 200 }}">
        <!-- BG TOP -->
        <Header title="Map"/>

            <div class="overflow-x-hidden overflow-y-auto h-[85vh] sm:pb-0 no-scrollbar relative z-10">
                <!--- Map --->
                <div id={mapID} class="map" style="height:100%; width:100%"></div>
            </div>

    </div>


</Page>

