<script>
    import {
        Page,
    } from 'konsta/svelte';
    import { goto } from '$app/navigation';
    import {onMount} from "svelte";
    import {register} from 'swiper/element/bundle';

    register();
    const onProgress = (e) => {
        const [swiper, progress] = e.detail;
        // console.log(progress)
    };
    const onSlideChange = (e) => {
        // console.log('slide changed')
    }
    onMount(() => {
        // if (USER) goto("/home");
    })

</script>

<Page class="">
    <div class="bg-blue-900 dark:bg-blue-900 h-screen">
        <div class="px-10 pt-20">
            <img src="/Car8.png" alt="logo" class="w-[50%] m-auto"/>
        </div>


        <div class="flex h-80 items-center justify-center">
            <swiper-container
                    centered-slides={true}
                    pagination={{
                         hideOnClick: true,
                                }}
                    on:progress={onProgress}
                    on:slidechange={onSlideChange}
            >
                <swiper-slide><img src="/3333.webp" alt="logo" class="w-full m-auto"/></swiper-slide>
                <swiper-slide><img src="/3333.webp" alt="logo" class="w-full m-auto"/></swiper-slide>
            </swiper-container>
        </div>
        <div class="p-10">
            <div class="absolute inset-x-0 bottom-3 w-full p-5">
                <button class="mb-3 w-full text-black border border-white bg-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                        on:click={()=>{goto("/login")}}>Sign in
                </button>
                <button class=" w-full text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                        on:click={()=>{goto("/register")}}
                >
                    Create an account
                </button>
            </div>
        </div>
    </div>



</Page>

<style>

    .swiper, swiper-container {
        height: 100% !important;
        margin-top: 10rem !important;
    }

    .swiper-horizontal>.swiper-pagination-bullets, .swiper-pagination-bullets.swiper-pagination-horizontal, .swiper-pagination-custom, .swiper-pagination-fraction {
        top: 15rem !important;
    }

</style>