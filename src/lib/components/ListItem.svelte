<script>
    import {globalStarRating} from "$lib/store.js";

    export let data = {};

</script>
<!--&& data.deleted == false-->
{#if data.date && data.vin}
    <!-- svelte-ignore a11y-click-events-have-key-events -->

    <a href={'/home/vehicle/' + data.id}>
        <div
                style="grid-template-columns: 1fr 4fr 1fr;"
                class="shadow-sm grid bg-white rounded-lg items-center px-2 py-4 mb-5 hover:cursor-pointer"
        >
            <div>
                <div class="h-[30px]">
                    <img
                            src="https://github.com/techgfxlimited/vehicles-db/raw/main/logos/optimized/{data.vehicleBrand.toLowerCase()}.png"
                            alt="car-logo"
                    />
                </div>
            </div>
            <div class="ml-3">
                <p class="text-md font-bold m-0 line-clamp-1">
                    {data.vehicleYear +
                    " " +
                    data.vehicleBrand +
                    " " +
                    data.vehicleModel}

                </p>
                <p class="text-gray-500 mb-1 mt-0 text-sm">{data.vin}
                    {#if data.purchased == true}
                        <i class="fa-solid fa-circle-check text-green-600 text-sm"></i>
                    {/if}
                </p>
                <p class="text-gray-500 text-xs m-0">{data.date}</p>
            </div>
            <div class="flex flex-col justify-center items-center px-2 pr-2">
                <i class="fa-solid fa-star text-lg {data.rating >= 0 && data.rating < 2 ? 'text-gray-300' : data.rating >= 2 && data.rating <  3.5 ? 'text-yellow-400' : data.rating >= 3.5 && data.rating <= 5 ? 'text-yellow-300' : '' } "></i>
                <p class="text-center font-bold text-md m-0">
                    {data.rating}/{$globalStarRating}
                </p>
            </div>
        </div>
    </a>
{/if}

<style>
    a {
        color: inherit !important;
    }

    a:hover {
        text-decoration: none;
    }
</style>
