<script>
    export let data = {};

    function fDate(dt) {
        const date = new Date(dt);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour12: true,
            hour: "2-digit",
            minute: "2-digit",
        });
    }
</script>

{#if data.date && data.vin}
    <!-- svelte-ignore a11y-click-events-have-key-events -->

    <a href="/view-rated/{data.id}">
        <div
                class="shadow-sm flex bg-white rounded-lg items-center justify-between px-2 py-4 mb-5 hover:cursor-pointer"
        >
            <div>
                <img
                        src="https://github.com/filippofilip95/car-logos-dataset/raw/master/logos/optimized/{data.vehicleMake.toLowerCase()}.png"
                        class="max-h-[50px]"
                        alt="car-logo"
                />
            </div>
            <div class="flex-1 ml-3">
                <p class="text-lg font-bold m-0">
                    {data.vehicleYear +
                    " " +
                    data.vehicleMake +
                    " " +
                    data.vehicleModel}
                    {#if data.purchased == true}
                        <i class="fa-solid fa-circle-check text-green-600 text-sm"></i>
                    {/if}
                </p>
                <p class="text-gray-500 mb-1 mt-0 text-sm">{data.vin}</p>
                <p class="text-gray-500 text-xs m-0">{fDate(data.date)}</p>
            </div>
            <div class="flex flex-col justify-center items-center px-2 pr-4">
                <i class="fa-solid fa-star text-lg text-yellow-300"></i>
                <p class="text-center font-bold text-md m-0">
                    {data.rating.toFixed(1)}/5
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
