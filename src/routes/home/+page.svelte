<script>
    import {
        Page,
    } from 'konsta/svelte';
    import { fly } from 'svelte/transition';
    import { USER } from "$lib/store.js";
    import {onMount} from "svelte";
    import {goto} from "$app/navigation";
    import ListItem from "$lib/components/ListItem.svelte";
    import Profile from "$lib/components/Profile.svelte";


    let searchText = "";

    let cars = [
        {
            id: 1,
            vehicleYear: 2009,
            vehicleMake: "Ford",
            vehicleModel: "Edge",
            vin: "VX12357975ER58964",
            date: "2022-07-20 00:20:01.0",
            rating: 4.5,
            purchased: false,
        },
        {
            id: 2,
            vehicleYear: 2010,
            vehicleMake: "Honda",
            vehicleModel: "Accord",
            vin: "VX12357975ER58964",
            date: "2022-07-20 00:20:01.0",
            rating: 4.2,
            purchased: true,
        },
        {
            id: 3,
            vehicleYear: 2010,
            vehicleMake: "Honda",
            vehicleModel: "Accord",
            vin: "VX12357975ER58964",
            date: "2022-07-20 00:20:01.0",
            rating: 4.2,
            purchased: true,
        },
        {
            id: 4,
            vehicleYear: 2010,
            vehicleMake: "Honda",
            vehicleModel: "Accord",
            vin: "VX12357975ER58964",
            date: "2022-07-20 00:20:01.0",
            rating: 4.2,
            purchased: true,
        },
        {
            id: 5,
            vehicleYear: 2010,
            vehicleMake: "Honda",
            vehicleModel: "Accord",
            vin: "VX12357975ER58964",
            date: "2022-07-20 00:20:01.0",
            rating: 4.2,
            purchased: true,
        },
        {
            id: 6,
            vehicleYear: 2010,
            vehicleMake: "Honda",
            vehicleModel: "Accord",
            vin: "VX12357975ER58964",
            date: "2022-07-20 00:20:01.0",
            rating: 4.2,
            purchased: true,
        },
    ];
    $: filteredList = cars.filter(
        (car) =>
            car.vehicleMake.toLowerCase().indexOf(searchText.toLowerCase()) !== -1
    );




</script>
<svelte:head>
    <title>Home</title>
    <meta name="description" content="Home Page" />
</svelte:head>

<Page>

    <!-- BG TOP -->
    <div class="bg-blue-900 h-[20vh] p-5" transition:fly="{{ x: 200, duration: 200 }}">
        <div class="flex">
            <h1 class="text-3xl text-white font-bold">Welcome</h1>
            <div class="ml-auto order-2">
              <!-- Profile Component -->
             <Profile/>
            </div>
        </div>
        <p class="block text-md text-white mb-3">{$USER?.displayName}</p>
        <form>
            <label for="default-search" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
            <div class="relative">
                <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <i class="fa-solid fa-magnifying-glass w-5 h-5 text-gray-500 dark:text-gray-400"></i>
                </div>
                <input bind:value={searchText} type="search" id="default-search" class="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700" placeholder="Search VIN" required>
                <button type="submit" class="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2">Search</button>
            </div>
        </form>
    </div>

    <!-- BG BOTTOM -->
    <div>

        <h1 class="text-xl text-gray-900 font-bold p-5">Rated Vehicles</h1>
        <div class="px-5 overflow-x-hidden overflow-y-auto h-[70vh] no-scrollbar">
            {#each filteredList as d}
                <ListItem data={d} />
            {/each}
        </div>

    </div>


</Page>
