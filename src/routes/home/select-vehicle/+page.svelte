<script>
    import {
        Page, Navbar, Link,  Popup, Block, Toast, Button
    } from 'konsta/svelte';
    import { fly } from 'svelte/transition';
    import { rateVehicle } from "$lib/store.js";
    import {goto} from "$app/navigation";
    import Profile from "$lib/components/Profile.svelte";
    import { car } from "$lib/vehicles.js";
    import { VEHICLE, RECALLS, COMPLAINTS} from "$lib/vehicle-store.js";
    import {formatDate} from "$lib/util.js";
    import {onMount} from "svelte";
    import Header from "$lib/components/Header.svelte";

    let popupOpened = false;
    let recallPopupOpened = false;
    let complaintPopupOpened = false;


    // Return distinct array and sort
    let vehicle = [...new Set(car.map((Vehicle) => Vehicle.Make))].sort();
    $: model = getModel($rateVehicle.vehicleBrand);
    $: year = getYear($rateVehicle.vehicleModel);

    // Get Model By Brand
    function getModel(Brand) {
        let vBrand = car.filter(({ Make }) => Brand == Make);
        if (vBrand.length) {
            // Return distinct array and sort
            return [...new Set(vBrand.map((Vehicle) => Vehicle.Model))].sort();
        }
        // Return empty if nothing matches
        else return [];
    }
    // Get Year By Model
    function getYear(_Model) {
        let vModel = car.filter(({ Model }) => _Model == Model);
        if (vModel.length) {
            // Return distinct array and sort
            return [...new Set(vModel.map((Vehicle) => Vehicle.Year))]
                .sort()
                .reverse();
        }
        // Return empty if nothing matches
        else return [];
    }


    let vinDisabled = false;
    let disabled = true;
    let loading = false;
    let error = false;
    let errMSG = "";

    window.onoffline = (e) => {
        console.log("offline")
        disabled = true;
    };

    window.ononline = (e) => {
        console.log("online")
        disabled = false;
    };

    let extraModel = ""
    let extraYear = ""


    async function getVIN(vin) {
        vinDisabled = true;
        loading = true;
        try {
            const response = await fetch(
                `https://vpic.nhtsa.dot.gov/api/vehicles/decodevinvalues/${vin}?format=json`,
                {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                }
            );
            const result = await response.json();
            const make = result.Results[0].Make;
            const model = result.Results[0].Model;
            const year = result.Results[0].ModelYear;
            $VEHICLE = {make, model, year};
            // recalls = await getRecalls(make, model, year);
            // complaints = await getComplaints(make, model, year);
            loading = false;
            vinDisabled = false;
            if (make) {
                $rateVehicle.vehicleBrand =
                    make.toUpperCase().substring(0,1) + make.slice(1).toLowerCase();
                    extraModel = model.toUpperCase().substring(0,1) + model.slice(1).toLowerCase();
                    extraYear = String(year)
                setTimeout(() => {
                    $rateVehicle.vehicleModel = extraModel;
                    $rateVehicle.vehicleYear = extraYear;
                }, 10);
            } else {
                error = true;
                errMSG = "VIN not found!";
                $rateVehicle.vehicleBrand = "";
                $rateVehicle.vehicleModel = "";
                $rateVehicle.vehicleYear = "";
                extraYear = ""
                extraModel = ""
            }
        } catch (error) {
            error = true;
            errMSG = "Something went wrong!";
            console.log("error", error);
            vinDisabled = false;
            loading = false;
        }
    }

    function submitForm(){
        goto("/home/rate-vehicle");
    }

onMount(()=>{
    window.onoffline = (e) => {
        console.log("offline")
        disabled = true;
    };
    window.ononline = (e) => {
        console.log("online")
        disabled = false;
    };

    // if ($rateVehicle.vehicleType == "") {
    //     goto("/home/vehicle-type");
    // }

    // if ($rateVehicle.vin.length >= 16) {
    //     getVIN($rateVehicle.vin);
    // }
})
</script>
<svelte:head>
    <title>New - Select Vehicle</title>
    <meta name="description" content="New - Select Vehicle" />
</svelte:head>
<Page>
    <div transition:fly="{{ x: 200, duration: 200 }}">
    <!-- BG TOP -->
        <Header title="Brand & Model"/>
    <!-- BG BOTTOM -->
    {#if $rateVehicle.vehicleBrand != ""}
        <div
                class="bg-white p-3 h-20 w-20 absolute right-5 -mt-5 flex flex-col rounded-lg items-center justify-center shadow-sm"
        >
            <img
                    src="https://github.com/techgfxlimited/vehicles-db/raw/main/logos/optimized/{$rateVehicle.vehicleBrand.toLowerCase()}.png"
                    class="max-h-[50px]"
                    alt="car-logo"
                    height="50px"
            />
        </div>
    {/if}
    <div class="px-5">
        <h1 class="text-xl text-gray-900 font-bold py-5">Verify VIN</h1>
        <!-- Error Alert-->
        {#if error}
            <div id="alert-2" class="flex p-4 mb-4 text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
                <i class="fa-solid fa-circle-info text-red-500"></i>
                <span class="sr-only">Info</span>
                <div class="ml-3 text-sm font-medium">
                    {errMSG}
                </div>
                <button on:click={() => error = false} type="button" class="ml-auto -mx-1.5 -my-1.5 bg-red-50 text-red-500 rounded-lg focus:ring-2 focus:ring-red-400 p-1.5 hover:bg-red-200 inline-flex h-8 w-8 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-gray-700" data-dismiss-target="#alert-2" aria-label="Close">
                    <span class="sr-only">Close</span>
                    <i class="fa-solid fa-xmark text-red-500"></i>
                </button>
            </div>
        {/if}
        <div class="overflow-x-hidden overflow-y-auto h-[70vh] pb-[20%] sm:pb-0 no-scrollbar">
            <form on:submit|preventDefault={submitForm}>
                <div>
                    <label for="vin" class="block mb-2 text-sm font-medium text-gray-900">VIN</label>
                    <input type="text" disabled={vinDisabled} bind:value={$rateVehicle.vin}
                           on:input={() => {
                        if ($rateVehicle.vin.length >= 16){
                            console.log("ON KEYUP GET VIN");
                            getVIN($rateVehicle.vin);
                        }
                    }}
                           minlength="16" maxlength="17" id="vin" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700" placeholder="VIN" required>
                    <Link class="mt-2 text-sm text-blue-500 hover:underline" onClick={() => popupOpened = true}>
                        How to find VIN?
                    </Link>
                </div>
                {#if $rateVehicle.vehicleBrand != "" || !navigator.onLine}
                    <div class="mt-3">
                        <label for="brand" class="block mb-2 text-sm font-medium text-gray-900">Brand</label>
                        <select bind:value={$rateVehicle.vehicleBrand} id="brand" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700" required>
                            <option value="" disabled selected>Select Brand</option>
                            {#each vehicle as v}
                                <option value={v}>{v}</option>
                            {/each}
                        </select>
                    </div>
                    <div class="mt-3">
                        <label for="model" class="block mb-2 text-sm font-medium text-gray-900">Model</label>
                        <select bind:value={$rateVehicle.vehicleModel} id="model" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700" required>
                            {#if extraModel != ""}
                                <option value={extraModel}>{extraModel}</option>
                            {/if}
                            <option value="" disabled selected>Other Models</option>
                            {#each model as m}
                                <option value={m}>{m}</option>
                            {/each}
                        </select>
                    </div>
                    <div class="mt-3">
                        <label for="year" class="block mb-2 text-sm font-medium text-gray-900">Year</label>
                        <select bind:value={$rateVehicle.vehicleYear} id="year" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700"  required>
                            {#if extraYear != ""}
                                <option value={String(extraYear)}>{extraYear}</option>
                            {/if}
                            <option value="" disabled selected>Other Models</option>
                            {#each year as y}
                                <option value={String(y)}>{y}</option>
                            {/each}
                        </select>
                    </div>
                {/if}

                {#if $RECALLS.Count > 0 || $COMPLAINTS.count > 0 }
                    <ul class="my-5 space-y-4 text-left text-gray-500 border-dashed border-2 border-gray-300 border rounded py-3 px-4">
                        {#if $RECALLS.Count > 0}
                            <li class="flex items-center space-x-3">
                                <!-- Icon -->
                                <i class="fa-solid fa-triangle-exclamation text-yellow-400"></i>
                                <span>{$RECALLS.Count > 1 ? $RECALLS.Count + ' recall records found. ' : $RECALLS.Count + ' recall record found. ' }<Link class="mt-2 text-sm text-blue-500 hover:underline" onClick={() => recallPopupOpened = true}>Learn more</Link></span>
                            </li>
                        {/if}
                        {#if $COMPLAINTS.count > 0}
                            <li class="flex items-center space-x-3">
                                <!-- Icon -->
                                <i class="fa-solid fa-triangle-exclamation text-yellow-400"></i>
                                <span>{$COMPLAINTS.count > 1 ? $COMPLAINTS.count + ' complaints found. ' : $COMPLAINTS.count + ' complaint found. ' }<Link class="mt-2 text-sm text-blue-500 hover:underline" onClick={() => complaintPopupOpened = true}>Learn more</Link></span>
                            </li>
                        {/if}
                    </ul>
                {:else}
                    <div class="my-8"></div>
                {/if}
                <button type="submit" disabled={$rateVehicle.vehicleModel == "" || $rateVehicle.vehicleBrand == "" || $rateVehicle.vehicleYear == ""} class="w-full text-white bg-blue-800 hover:bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed">
                    {#if loading}
                        <i class="fa-solid fa-circle-notch m-auto text-gray-200 animate-spin fill-blue-600"></i>
                    {:else}
                        Continue
                    {/if}
                </button>


            </form>
        </div>

    </div>
    </div>


    <!--    POPUP FOR HOW TO FIND VIN -->
    <Popup opened={popupOpened} onBackdropClick={() => popupOpened = false}>
        <Page>
            <Navbar transparent="true">
                <Link slot="right" navbar onClick={() => popupOpened = false}>
                    <i class="fa-solid fa-xmark mr-1 text-3xl"></i>
                </Link>
            </Navbar>
            <Block class="space-y-4">
                <img src="/locate-vin.png" alt=""/>
                <h2 class="mb-2 text-lg font-semibold text-gray-900">How to locate VIN:</h2>
                <ul class="max-w-md space-y-6 text-gray-500 list-inside dark:text-gray-400">
                    <li class="flex">
                        <i class="fa-solid fa-circle-check mr-3 mt-1 text-blue-800 flex-shrink-0"></i>
                        <div class="block">
                            <b>Dashboard:</b> The VIN can often be seen through the windshield on the driver's side of the dashboard.
                        </div>

                    </li>
                    <li class="flex">
                        <i class="fa-solid fa-circle-check mr-3 mt-1 text-blue-800"></i>
                        <div class="block">
                        <b>Door jamb:</b> Look on the driver's side door jamb for a sticker or plate that displays the VIN.
                        </div>
                    </li>
                    <li class="flex">
                        <i class="fa-solid fa-circle-check mr-3 mt-1 text-blue-800"></i>
                        <div class="block">
                        <b>Engine block:</b> The VIN may be stamped directly onto the engine block.
                        </div>
                    </li>
                </ul>
            </Block>
        </Page>
    </Popup>
    <!--    POPUP FOR RECALLS -->
    <Popup opened={recallPopupOpened} onBackdropClick={() => recallPopupOpened = false}>
        <Page>
            <Navbar large="true" transparent="true" title="Recalls" subtitle={$rateVehicle.vehicleYear + " " + $rateVehicle.vehicleBrand + " " + $rateVehicle.vehicleModel}>
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
            <Navbar large="true" transparent="true" title="Recalls" subtitle={$rateVehicle.vehicleYear + " " + $rateVehicle.vehicleBrand + " " + $rateVehicle.vehicleModel}>
                <Link slot="right" navbar onClick={() => complaintPopupOpened = false}>
                    <i class="fa-solid fa-xmark mr-1 text-3xl"></i>
                </Link>
            </Navbar>
            <Block class="space-y-4 pb-10">
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



</Page>
