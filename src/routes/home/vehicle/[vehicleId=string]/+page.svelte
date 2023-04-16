<script>
    import {
        Page, Navbar, Link, Toast, Button, Toolbar, Sheet, Block, Popup,  Dialog,
        DialogButton,
    } from 'konsta/svelte';
    import { onMount } from "svelte";
    import Header from "$lib/components/Header.svelte";
    import { page } from "$app/stores";
    import { app } from '$lib/firebase.js';
    import { doc, getFirestore, getDoc, deleteDoc, updateDoc } from "firebase/firestore";
    import {globalStarRating, rateVehicle, USER_DATA} from "$lib/store.js";
    import {COMPLAINTS, RECALLS, VEHICLE} from "$lib/vehicle-store.js";
    import {formatDate} from "$lib/util.js";
    import {goto} from "$app/navigation";
    const db = getFirestore(app);

    const vehicleID = $page.params.vehicleId;
    const docRef = doc(db, "records", vehicleID);
    let vehicleData = null;
    let purchased = false;
    let toastCenterOpened = false;
    let fetched = false;
    let msg = "";
    let recallPopupOpened = false;
    let complaintPopupOpened = false;
    let deleteDialogShow = false;

    $: {
        if(vehicleData)
        $VEHICLE = {make: vehicleData.vehicleBrand, model: vehicleData.vehicleModel, year: vehicleData.vehicleYear};
    }

    // Get a record by its ID
    async function fetchVehicleData() {
        const _vehicleData = ($USER_DATA['reviews'].filter((item) => item.id == vehicleID))[0];
        if(_vehicleData) {
            vehicleData = _vehicleData;
            purchased = vehicleData.purchased;
            fetched = true;
        }
        else {
            // handle not found error
        }
    }

    // Delete a record by its ID
    async function deleteVehicle() {
        let i = 0;
        for(const x in $USER_DATA['reviews']){
            if($USER_DATA['reviews'][x].id == vehicleID){
                $USER_DATA['reviews'].splice(i, 1);
                $USER_DATA['reviews'] = $USER_DATA['reviews'];
                break;
            }
        }
        deleteDialogShow = false;
        await goto("/home");
    }
    // Update a record by its ID
    // $: updatePurchased(purchased);
    async function updatePurchased() {
        if(!fetched) return;
        vehicleData.purchased = purchased;
        $USER_DATA['reviews'] = $USER_DATA['reviews'];
        if (vehicleData.purchased) {
            toastCenterOpened = true;
            msg = "Congratulations! Enjoy your new vehicle";
            setTimeout(() =>{
                toastCenterOpened = false;
            },5000)

        } else {
            toastCenterOpened = true;
            msg = "Oh no! We hope you find a better one soon";
            setTimeout(() =>{
                toastCenterOpened = false;
            },5000)
        }
    }

onMount(() => {
    // Call the function to fetch data when the component is rendered
        fetchVehicleData();
    });

</script>
<svelte:head>
    {#if vehicleData}
    <title>Vehicle - {vehicleData.vehicleBrand} </title>
    <meta name="description" content="Vehicle - {vehicleData.vehicleBrand}" />
    {/if}
</svelte:head>
{#if vehicleData}
    <!-- Render the data when it is available -->
    <Page>

            <!-- BG TOP -->
            <Header title="Vehicle Details"/>
            <!--        <pre><code>{JSON.stringify(questions, null, 2)}</code></pre>-->
            <!-- BG BOTTOM -->

                <div
                        class="bg-white p-3 h-20 w-20 absolute right-5 -mt-5 flex flex-col rounded-lg items-center justify-center shadow-sm"
                >
                                    <img
                                            src="https://github.com/techgfxlimited/vehicles-db/raw/main/logos/optimized/{vehicleData.vehicleBrand.toLowerCase()}.png"
                                            class="max-h-[50px]"
                                            alt="car-logo"
                                            height="50px"
                                    />
                    <div class="font-bold text-sm mt-1">
                        <span class="flex">
                            <i class="fa-solid fa-star {vehicleData.rating >= 0 && vehicleData.rating < 2 ? 'text-gray-300' : vehicleData.rating >= 2 && vehicleData.rating <  3.5 ? 'text-yellow-400' : vehicleData.rating >= 3.5 && vehicleData.rating <= 5 ? 'text-yellow-300' : '' }"></i>
                            {vehicleData.rating == 5 ? 5 : vehicleData.rating}/{$globalStarRating}
                        </span>
                    </div>
                </div>

            <div class="px-5">
                <div class="py-5">
                    <h1 class="text-xl text-gray-900 font-bold">{vehicleData.vehicleYear + " " + vehicleData.vehicleBrand + " " + vehicleData.vehicleModel}</h1>
                    <p class="text-sm text-gray-400">{vehicleData.date}</p>
                </div>
                <div class="overflow-x-hidden overflow-y-auto h-[75vh] pb-[25%] no-scrollbar">

                    <p>VIN: {vehicleData.vin}</p>
                    <p>Mileage: {vehicleData?.mileage + " " + vehicleData?.unit }</p>
                    <p>Location: <Link href="https://www.google.com/maps/dir//{vehicleData.coordinates.latitude},{vehicleData.coordinates.longitude}" target="_blank"> <i class="fa-solid fa-location-dot text-blue-800 mr-1"></i>Find on map</Link></p>
                    <h1 class="text-xl text-gray-900 font-bold mb-2 mt-3">Recommendation</h1>
                    <p class="mb-4 {vehicleData.rating >= 0 && vehicleData.rating < 2 ? 'text-red-300' : vehicleData.rating >= 2 && vehicleData.rating <  3.5 ? 'text-yellow-400' : vehicleData.rating >= 3.5 && vehicleData.rating <= 5 ? 'text-yellow-300' : '' }">
                        {#if vehicleData.rating >= 0 && vehicleData.rating < 2}
                            <i class="fa-solid fa-triangle-exclamation text-red-300"></i> Don't buy this vehicle
                        {:else if vehicleData.rating >= 2 && vehicleData.rating <  3.5}
                            <i class="fa-solid fa-triangle-exclamation text-yellow-400"></i> Great vehicle, but keep searching
                        {:else if vehicleData.rating >= 3.5 && vehicleData.rating <= 5}
                            <i class="fa-solid fa-triangle-exclamation text-yellow-300"></i> Great choice, you should consider this one
                        {/if}
                    </p>
                    <h1 class="text-xl text-gray-900 font-bold mb-2 mt-3">Research</h1>
                    <p>Cars.com: <Link href="https://www.cars.com/research/{vehicleData.vehicleBrand}-{vehicleData.vehicleModel}-{vehicleData.vehicleYear}/" target="_blank"><i class="fa-solid fa-arrow-up-right-from-square mr-1"></i>Learn More</Link>

                        {#if $RECALLS.Count > 0 || $COMPLAINTS.count > 0 }
                            <ul class="my-5 space-y-4 text-left text-gray-500 border-dashed border-2 border-gray-300 border rounded py-3 px-4">
                                {#if $RECALLS.Count > 0}
                                    <li class="flex items-center space-x-3">
                                        <!-- Icon -->
                                        <i class="fa-solid fa-triangle-exclamation text-yellow-400"></i>
                                        <span><b>{$RECALLS.Count}</b>{$RECALLS.Count > 1 ? ' recall records found. ' : ' recall record found. ' }<Link class="mt-2 text-sm text-blue-500 hover:underline" onClick={() => recallPopupOpened = true}>Learn more</Link></span>
                                    </li>
                                {/if}
                                {#if $COMPLAINTS.count > 0}
                                    <li class="flex items-center space-x-3">
                                        <!-- Icon -->
                                        <i class="fa-solid fa-triangle-exclamation text-yellow-400"></i>
                                        <span><b>{$COMPLAINTS.count }</b>{$COMPLAINTS.count > 1 ? ' complaints found. ' : ' complaint found. ' }<Link class="mt-2 text-sm text-blue-500 hover:underline" onClick={() => complaintPopupOpened = true}>Learn more</Link></span>
                                    </li>
                                {/if}
                            </ul>
                        {:else}
                            <div class="my-8"></div>
                        {/if}

                        <label class="relative inline-flex items-center cursor-pointer mb-4">
                            <input type="checkbox"  bind:checked={purchased} class="sr-only peer" on:change={updatePurchased}>
                            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none  rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            <span class="ml-3 text-sm font-medium text-gray-900">Mark as purchased</span>
                        </label>

                        <button on:click={() => deleteDialogShow = true } class="mt-16 w-full text-red-500 bg-transparent border-red-500 border hover:bg-red-500 hover:text-white font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Delete
                        </button>
                </div>

            </div>



        <!--    POPUP FOR RECALLS -->
        <Popup opened={recallPopupOpened} onBackdropClick={() => recallPopupOpened = false}>
            <Page>
                <Navbar large="true" transparent="true" title="Recalls" subtitle={vehicleData.vehicleYear + " " + vehicleData.vehicleBrand + " " + vehicleData.vehicleModel}>
                    <Link slot="right" navbar onClick={() => recallPopupOpened = false}>
                        <i class="fa-solid fa-xmark mr-1 text-3xl"></i>
                    </Link>
                </Navbar>
                <Block class="space-y-4 pb-10">

                    {#each $RECALLS.results as r}
                        <div class="max-w-sm p-6 bg-white border border-gray-200 rounded-lg">

                            <h5 class="mb-1 text-2xl font-bold tracking-tight text-gray-900 capitalize">{r.Component.toLowerCase()}</h5>
                            <p class="mb-2 font-normal text-blue-800">{r.ReportReceivedDate}</p>

                            <p class="mb-3 font-normal text-gray-700">{r.Consequence}</p>
                        </div>
                    {/each}

                </Block>
            </Page>
        </Popup>
        <!--    POPUP FOR COMPLAINTS -->
        <Popup opened={complaintPopupOpened} onBackdropClick={() => complaintPopupOpened = false}>
            <Page>
                <Navbar large="true" transparent="true" title="Complaints" subtitle={vehicleData.vehicleYear + " " + vehicleData.vehicleBrand + " " + vehicleData.vehicleModel}>
                    <Link slot="right" navbar onClick={() => complaintPopupOpened = false}>
                        <i class="fa-solid fa-xmark mr-1 text-3xl"></i>
                    </Link>
                </Navbar>
                <Block class="space-y-4 pb-10">
                    <div id="alert-3" class="flex p-4 text-yellow-800 rounded-lg bg-yellow-50" role="alert">
                        <i class="fa-solid fa-circle-info text-yellow-500 mt-1"></i>
                        <span class="sr-only">Info</span>
                        <div class="ml-3 text-sm font-medium">
                            These complaints are only meant to provide additional insights on the vehicle you are about to rate.
                        </div>
                    </div>
                    <Link class="text-sm text-blue-500 border-blue-500 border hover:underline w-full bg-transparent hover:bg-blue-700 hover:text-white font-medium rounded-lg px-5 py-2.5 mr-2 mb-2" href="https://www.carcomplaints.com/{vehicleData.vehicleBrand}/{vehicleData.vehicleModel}/{vehicleData.vehicleYear}/" target="_blank">See more reported complaints</Link>
                    {#if $COMPLAINTS.results}
                        {#each $COMPLAINTS.results as r}
                            <div class="max-w-sm p-6 bg-white border border-gray-200 rounded-lg">

                                <h5 class="mb-1 text-2xl font-bold tracking-tight text-gray-900 capitalize">{r.components.toLowerCase()}</h5>
                                <p class="mb-2 font-normal text-blue-800">{formatDate(r.dateComplaintFiled)}</p>
                                <p class="mb-3 font-normal text-gray-700">{r.summary}</p>
                            </div>
                        {/each}
                    {/if}
                </Block>
            </Page>
        </Popup>

        <Toast position="center" opened={toastCenterOpened}>
            <Button
                    slot="button"
                    clear
                    inline
                    onClick={() => (toastCenterOpened = false)}
            >
                Close
            </Button>
            <div class="shrink">{msg}</div>
        </Toast>

        <Dialog opened={deleteDialogShow} onBackdropClick={() => (deleteDialogShow = false)}>
            <svelte:fragment slot="title">Delete Review</svelte:fragment>
            Are you sure you want to delete this review?

            <svelte:fragment slot="buttons">
                <DialogButton onClick={() => (deleteDialogShow = false)}>
                    Cancel
                </DialogButton>
                <DialogButton class="text-red-500" onClick={() => deleteVehicle()}>
                    Delete
                </DialogButton>
            </svelte:fragment>
        </Dialog>


    </Page>

{:else}
    <!-- Show a loading state while data is being fetched -->
    <div class="h-screen bg-blue-900 flex items-center justify-center">
        <i class="fa-solid fa-circle-notch text-white animate-spin fill-blue-600 text-3xl"></i>
        <p class="text-white ml-3">Loading...</p>
    </div>
{/if}