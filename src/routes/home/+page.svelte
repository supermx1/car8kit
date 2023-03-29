<script>
    import {
        Page, Navbar, Link
    } from 'konsta/svelte';
    import { fly } from 'svelte/transition';
    import {rateVehicle, USER} from "$lib/store.js";
    import {onMount} from "svelte";
    import {goto} from "$app/navigation";
    import Profile from "$lib/components/Profile.svelte";
    import ListItem from "$lib/components/ListItem.svelte";
    import { app } from '$lib/firebase.js';
    import {collection, getDocs, query, where, getFirestore, getDocFromCache} from "firebase/firestore";

    const db = getFirestore(app);

    let cars = [];
    let loading = false;
    let error = false;
    async function getData() {
        loading = true;
        try {
            const q = query(collection(db, "records"), where("uid", "==", $USER.uid));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                cars = [...cars, doc.data()];
                console.log("cars log",cars);
            });
            loading = false;
        } catch (e) {
            error = true;
            console.log("Error getting documents: ", e);
        }

    }

    let searchText = "";

    $: filteredList = cars.filter(
        (car) =>
            car?.vin?.toLowerCase().indexOf(searchText.toLowerCase()) !== -1
    );

    onMount(()=>{
            getData();
            $rateVehicle.vin = "";
            $rateVehicle.vehicleType = null;
            $rateVehicle.vehicleBrand = "";
            $rateVehicle.vehicleModel = "";
            $rateVehicle.vehicleYear = "";
    })
</script>
<svelte:head>
    <title>Home</title>
    <meta name="description" content="Home Page" />
</svelte:head>
<Page>
    <div transition:fly="{{ x: 200, duration: 200 }}">
    <!-- BG TOP -->
    <div class="bg-blue-900 h-[25vh] p-5">
        <Navbar
                class="top-0 sticky mb-5"
                transparent="true"
        >
            <div slot="left">
                <h1 class="text-3xl text-white font-bold mt-5">Welcome,</h1>
                <p class="block text-md text-white mb-3">{$USER.displayName == null ? 'User' : $USER?.displayName }</p>
            </div>
            <Profile slot="right" />
        </Navbar>
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

        <h1 class="text-xl text-gray-900 font-bold p-5">
            {filteredList.length == 1 ? filteredList.length + ' Rated Vehicle' : filteredList.length > 1 ? filteredList.length + ' Rated Vehicles' : ' Rated Vehicles' }
        </h1>
        <div class="overflow-x-hidden overflow-y-auto h-[70vh] no-scrollbar">
            {#if loading}
                <div class="flex items-center justify-center">
                    <i class="fa-solid fa-circle-notch text-blue-900 animate-spin fill-blue-900 text-2xl"></i>
                    <p class="text-gray-600 ml-3">Loading rated vehicles...</p>
                </div>
            {:else }
                {#if filteredList.length > 0}
                    <div class="px-5">
                        {#each filteredList as d}
                            <ListItem data={d} />
                        {/each}
                    </div>

                {:else}
                    <div class="px-5">
                        <div class="border-dashed border-2 text-gray-300 border-gray-200 border rounded py-8 px-5">
                            <p class="text-gray-500 dark:text-gray-400 text-center">You have not rated any vehicles</p>
                            <button class="w-full text-white bg-blue-800 hover:bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 mt-6 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                                    on:click={()=>{goto("/home/vehicle-type")}}
                            >
                                Get Started
                            </button>
                        </div>
                    </div>
                {/if}
            {/if}

        </div>

    </div>
    </div>
</Page>
