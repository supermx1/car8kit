<script>
    import {
        Page, Navbar, Link, Toast, Button, Toolbar, Sheet, Block
    } from 'konsta/svelte';
    import { fly } from 'svelte/transition';
    import {rateVehicle, globalStarRating, USER, USER_DATA} from "$lib/store.js";
    import {formatDate} from "$lib/util.js";
    import {goto} from "$app/navigation";
    import Rating from "$lib/components/Rating.svelte";
    import { countries } from "$lib/countries.js";
    import {onMount} from "svelte";
    import Header from "$lib/components/Header.svelte";
    import { app } from '$lib/firebase.js';
    import { getFirestore, collection, addDoc } from "firebase/firestore";

    const db = getFirestore(app);
    let toastCenterOpened = false;
    let sheetOpened = false;

    let loading = false;
    let errMSG = "";
    let error = false;
    let questionsLoading = false;
    let AVG = 0;
    let ENTRIES = 0;
    let ANSWERED = 0;
    let TOTAL = 0;
    let country= "";
    let mileage = 0;
    let unit = "KM";


    let questions = [];
    $: _categories = categorize(questions);
    $: calc(_categories);

    function categorize(q) {
        const categories = [];
        for (const i of q) {
            const category = i["category"]["categoryTitle"];
            if (!categories[category]) {
                categories[category] = {
                    name: category,
                    questions: [],
                };
            }
            categories[category]["questions"].push(i);
        }
        return Object.keys(categories).map((key) => categories[key]);
    }

    function calc() {
        let entires = 0;
        let total = 0;
        let answered = 0;
        let sumTotal = 0;

        for (const q of questions) {
            entires++;
            sumTotal += q.score;

            if (q.ans > 0) {
                answered++;
                total += q.ans;
            }
        }

        AVG = Number((total * 5) / sumTotal).toFixed(1);
        ENTRIES = entires;
        TOTAL = total;
        ANSWERED = answered;

        //
    }

    async function getQuestions() {
        questionsLoading = true;
        try {
            const response = await fetch(
                `https://car8-questions.pages.dev/qs.json`
            );
            const result = await response.json();
            if($rateVehicle.vehicleType) {
                questions = result.data.filter(q=> q.vehicleType.type === $rateVehicle.vehicleType);
            } else {
                error = true;
                errMSG = "Sorry, couldn't load checklist. Try again."
            }
            questionsLoading = false;
        } catch (e) {
            error = true;
            errMSG = `Something went wrong! + ' ' + ${e}`
            toastCenterOpened = true;
            console.log("error", e)
        }
    }

    async function submitData() {
        let _date = new Date().toLocaleDateString("en-NG", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour12: true,
            hour: "2-digit",
            minute: "2-digit",
        });
        loading = true;
        const qs = questions.map(q => {
            return {
                question: q.question,
                ans: q.ans,
            }
        })
        const review = {
            id: $USER_DATA.uid + '_' + $rateVehicle.vin,
            rating: AVG,
            uid: $USER.uid,
            vehicleType: $rateVehicle.vehicleType,
            vehicleBrand: $rateVehicle.vehicleBrand,
            vehicleModel: $rateVehicle.vehicleModel,
            vehicleYear: $rateVehicle.vehicleYear,
            coordinates: $rateVehicle.coordinates,
            vin: $rateVehicle.vin,
            date: _date,
            country: country,
            mileage: mileage,
            unit: unit,
            questions: qs,
            purchased: false,
            deleted: false,
        };
        $USER_DATA.reviews = [...$USER_DATA.reviews, review];

        loading = false;
        await goto("/home");

    }



    onMount( ()=>{
        getQuestions();
        // if ($rateVehicle.vehicleType == "") {
        //     goto("/home/vehicle-type");
        // } else if ($rateVehicle.vin == "") {
        //     goto("/home/select-vehicle");
        // }
    });
</script>
<svelte:head>
    <title>New - Rate Vehicle</title>
    <meta name="description" content="New - Rate Vehicle" />
</svelte:head>
<Page>
    <div transition:fly="{{ x: 200, duration: 200 }}">
        <!-- BG TOP -->
        <Header title="Rate Vehicle"/>
<!--        <pre><code>{JSON.stringify(questions, null, 2)}</code></pre>-->
        <!-- BG BOTTOM -->
        {#if $rateVehicle.vehicleBrand != ""}
            <div
                    class="bg-white p-3 h-20 w-20 absolute right-5 -mt-5 flex flex-col rounded-lg items-center justify-center shadow-sm"
            >
<!--                <img-->
<!--                        src="https://github.com/techgfxlimited/vehicles-db/raw/main/logos/optimized/{$rateVehicle.vehicleBrand.toLowerCase()}.png"-->
<!--                        class="max-h-[50px]"-->
<!--                        alt="car-logo"-->
<!--                        height="50px"-->
<!--                />-->
                <div class="text-center font-bold text-sm mt-1">
                    <i class="fa-solid fa-star text-2xl {AVG >= 0 && AVG < 2 ? 'text-gray-300' : AVG >= 2 && AVG <  3.5 ? 'text-yellow-400' : AVG >= 3.5 && AVG <= 5 ? 'text-yellow-300' : '' } mr-1"></i>
                    {AVG == 5 ? 5 : AVG}/{$globalStarRating}
                </div>
            </div>
        {/if}

        <div class="px-5">
            <div class="py-5">
                <h1 class="text-xl text-gray-900 font-bold">Checklist</h1>
                <p class="text-sm text-gray-600">{$rateVehicle.vehicleYear + " " + $rateVehicle.vehicleBrand + " " + $rateVehicle.vehicleModel}</p>
                <!-- Error Alert-->
                {#if error}
                    <div id="alert-2" class="flex p-4 mt-2 text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
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
            </div>
            <div class="overflow-x-hidden overflow-y-auto h-[75vh] pb-[25%] no-scrollbar">
                {#if questionsLoading}
                    <div class="flex items-center justify-center mb-12">
                        <i class="fa-solid fa-circle-notch text-blue-900 animate-spin fill-blue-900 text-2xl"></i>
                        <p class="text-gray-600 ml-3">Fetching checklist...</p>
                    </div>
                {:else}
                    {#each _categories as c}
                        <div class="mb-5">
                    <span class="divide-y text-lg font-bold line-after mb-3"
                    ><span>{c.name}</span></span
                    >
                            {#each c.questions as q, i}
                                <div class="">{i + 1 + ". " + q.question}</div>
                                <Rating bind:selected={q.ans} bind:value={q.score} />
                            {/each}
                        </div>
                    {/each}
                {/if}

                <button class="w-full text-white bg-blue-800 hover:bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                        on:click={()=> sheetOpened = true}
                >
                        Continue
                </button>

            </div>



        </div>
        <Sheet
                class="pb-safe w-full"
                opened={sheetOpened}
                onBackdropClick={() => (sheetOpened = false)}
        >
            <Toolbar top>
                <div class="left" />
                <div class="right">
                    <Link toolbar onClick={() => (sheetOpened = false)}>Close</Link>
                </div>
            </Toolbar>
            <Block class="w-full">
                <div class="mt-3 flex gap-3">
                    <div class="flex-1">
                        <label for="mileage" class="block mb-2 text-sm font-medium text-gray-900">Current Mileage</label>
                        <input type="number" id="mileage" name="mileage" placeholder="Current Mileage" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700" bind:value={mileage} />
                    </div>
                    <div class="flex items-end">
                        <select id="unit" bind:value={unit} class="bg-gray-50 min-w-[5rem] border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700">
                            <option value="KM">KM</option>
                            <option value="Miles">Mi</option>
                        </select>
                    </div>

                </div>
                <div class="mt-4">
                    <button disabled={$rateVehicle.vehicleType == null} class="w-full text-white bg-blue-800 hover:bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                            on:click={submitData}
                    >
                        {#if loading}
                            <i class="fa-solid fa-circle-notch m-auto text-gray-200 animate-spin fill-blue-600"></i>
                        {:else}
                            Save Rating
                        {/if}
                    </button>
                </div>
            </Block>
        </Sheet>

    </div>



</Page>
