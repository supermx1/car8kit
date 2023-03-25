<script>
    import {
        Page, Navbar, Link,
    } from 'konsta/svelte';
    import { fly } from 'svelte/transition';
    import { rateVehicle, globalStarRating } from "$lib/store.js";
    import {goto} from "$app/navigation";
    import Profile from "$lib/components/Profile.svelte";
    import Rating from "$lib/components/Rating.svelte";
    import {onMount} from "svelte";

    let AVG = 0;
    let ENTRIES = 0;
    let ANSWERED = 0;
    let TOTAL = 0;
    // $: $rateVehicle.vehicleType === "Car" ? "categories" : $rateVehicle.vehicleType === "Motorcycle" ? "bikecategories" : "";

    let questions = [];
    $: _categories = categorize(questions);
    $: _categories && calc();

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
        try {
            const response = await fetch(
                `https://car8-questions.pages.dev/qs.json`
            );
            const result = await response.json();
            console.log("result", result);
            questions = result.data;
        } catch (error) {
            console.log("error", error)
        }
    }

    onMount( ()=>{
        getQuestions();
    });
</script>
<svelte:head>
    <title>New - Rate Vehicle</title>
    <meta name="description" content="New - Rate Vehicle" />
</svelte:head>
<Page>
    <div transition:fly="{{ x: 200, duration: 200 }}">

        <!-- BG TOP -->
        <div class="bg-blue-900 h-[15vh] py-5">
            <Navbar
                    class="top-0 sticky mb-5"
                    transparent="true"
            >
                <div slot="left">
                    <h1 class="text-2xl text-white font-bold">
                        <Link slot="left" onClick={() => history.back()} class="" navbar><i class="fa-solid fa-chevron-left text-2xl flex-col text-white mr-3"></i></Link>Rate Vehicle</h1>

                </div>
                <Profile slot="right" />
            </Navbar>
        </div>
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
                <p class="text-center font-bold text-md m-0 mt-2">
                    {AVG}/{$globalStarRating}
                </p>
            </div>
        {/if}

        <!-- BG BOTTOM -->
        <div class="px-5">
            <div class="py-5">
                <h1 class="text-xl text-gray-900 font-bold">Checklist</h1>
                <p class="text-sm text-gray-600">{$rateVehicle.vehicleYear + " " + $rateVehicle.vehicleBrand + " " + $rateVehicle.vehicleModel}</p>
            </div>
            <div class="overflow-x-hidden overflow-y-auto h-[60vh] no-scrollbar">
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
            </div>

            <button disabled={$rateVehicle.vehicleType == null ? true : false} class="w-full text-white bg-blue-800 hover:bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                    on:click={()=>goto("/home/select-vehicle")}
            >
                Continue
            </button>

        </div>

    </div>
</Page>
