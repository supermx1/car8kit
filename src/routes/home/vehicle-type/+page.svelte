<script>
    import {
        Page, Navbar, Link
    } from 'konsta/svelte';
    import { fly } from 'svelte/transition';
    import { rateVehicle } from "$lib/store.js";
    import {goto} from "$app/navigation";
    import Header from "$lib/components/Header.svelte";

</script>
<svelte:head>
    <title>New - Vehicle Type</title>
    <meta name="description" content="New - Vehicle Type" />
</svelte:head>
<Page>
    <div transition:fly="{{ x: 200, duration: 200 }}">


    <!-- BG TOP -->
        <Header title="Vehicle Type"/>
    <!-- BG BOTTOM -->
    <div class="px-5">

        <h1 class="text-xl text-gray-900 font-bold py-5">Choose Vehicle</h1>
        <ul class="grid w-full gap-6 md:grid-cols-2 mb-6">
            <li>
                <input type="radio" id="car" bind:group={$rateVehicle.vehicleType} name="vehicleType" value="Car" class="hidden peer">
                <label for="car" class="inline-flex items-center justify-between w-full p-5 bg-white border {$rateVehicle.vehicleType == 'Car' ? 'border-blue-600 text-blue-600' : 'text-gray-500 border-gray-200' } rounded-lg cursor-pointer  peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100">
                    <img src="/car.png" alt="car" class="h-14 mr-3" />
                    <div class="block">
                        <div class="w-full text-lg font-semibold">Car</div>
                        <div class="w-full text-sm">Select from various car brands and models</div>
                    </div>
                </label>
            </li>
            <li>
                <input type="radio" id="motorcycle" bind:group={$rateVehicle.vehicleType} name="vehicleType" value = "Motorcycle" class="hidden peer">
                <label for="motorcycle" class="inline-flex items-center justify-between w-full p-5 bg-white border {$rateVehicle.vehicleType == 'Motorcycle' ? 'border-blue-600 text-blue-600' : 'text-gray-500 border-gray-200' } rounded-lg cursor-pointer peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100">
                    <img src="/bike.png" alt="car" class="h-14 mr-3" />
                    <div class="block">
                        <div class="w-full text-lg font-semibold">Motorcycle</div>
                        <div class="w-full text-sm">Select from various motorcycle brands and models</div>
                    </div>
                </label>
            </li>
        </ul>

        <button disabled={$rateVehicle.vehicleType == null ? true : false} class="w-full text-white bg-blue-800 hover:bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                on:click={()=>goto("/home/select-vehicle")}
        >
            Continue
        </button>

    </div>

    </div>
</Page>
