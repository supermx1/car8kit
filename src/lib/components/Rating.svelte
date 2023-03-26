<script>
    const name = Math.random().toString(36).substring(2);
    export let selected = 0;
    export let value = 0;
</script>

<ul class="items-center w-full text-sm font-medium text-gray-900  flex mb-6 mt-2">
    <li class="w-full border-b border-gray-200 border-b-0 ">
        <div class="flex items-center pl-3">
            <input type="radio"  class="text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2 hidden peer"
                   bind:group={selected}
                   {value}
                   {name}
                   id={"Yes" + name}
            >
            <label for={"Yes" + name} class="inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100">Yes</label>
        </div>
    </li>
    <li class="w-full border-b border-gray-200 border-b-0">
        <div class="flex items-center pl-3">
            <input  type="radio"  class="text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2 hidden peer"
                   bind:group={selected}
                   value={0}
                   {name}
                   id={"No" + name}
            >
            <label for={"No" + name} class="inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100">No</label>
        </div>
    </li>
</ul>

<!--<div class="flex max-w-[18rem] mb-3 mt-1 gap-3">-->
<!--    <div-->
<!--            class="rate-radio m-0 bg-green-200 border-green-600 px-4 py-2 flex rounded-lg items-center justify-center"-->
<!--    >-->
<!--        <input-->
<!--                type="radio"-->
<!--                bind:group={selected}-->
<!--                {value}-->
<!--                {name}-->
<!--                id={"Yes" + name}-->
<!--                class="w-4 h-4"-->
<!--        />-->

<!--        <label class="mt-1 m-0 ml-1" for={"Yes" + name}>Yes</label>-->
<!--    </div>-->

<!--    <div-->
<!--            class="rate-radio m-0 bg-red-200 border-red-600 px-4 py-2 flex rounded-lg items-center justify-center"-->
<!--    >-->
<!--        <input-->
<!--                type="radio"-->
<!--                bind:group={selected}-->
<!--                value={0}-->
<!--                {name}-->
<!--                id={"No" + name}-->
<!--                class="w-4 h-4"-->
<!--        />-->

<!--        <label class="mt-1 m-0 ml-1" for={"No" + name}>No</label>-->
<!--    </div>-->
<!--</div>-->

