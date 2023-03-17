<script>
    import {
        Page,
        Dialog,
        DialogButton,
    } from 'konsta/svelte';
    import { fly } from 'svelte/transition';
    import {register} from 'swiper/element/bundle';
    import {GoogleAuthProvider, getAuth, signInWithPopup, signInWithRedirect, signInWithEmailAndPassword} from "firebase/auth";
    import {USER} from "$lib/store.js";
    import {goto} from "$app/navigation";

    register();
    const onProgress = (e) => {
        const [swiper, progress] = e.detail;
        console.log(progress)
    };
    const onSlideChange = (e) => {
        console.log('slide changed')
    }
    let email = "";
    let password = "";
    let errorMessage="";
    let alertOpened = false;
    let spinner = false;
    let spinner2 = false;
    let disabled = false;

    function signInWithGoogle() {
        spinner2 = true;
        disabled = true;
        console.log('signing in with google')
        const auth = getAuth();
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider).then((result) => {
            $USER = result.user;
        }).then(()=>{
            spinner2 = true;
            disabled = true;
            goto("/home")
        }).catch((error) => {
            spinner2 = false;
            disabled = false;
            console.log(error);
        })
    }

    function signInWithEmail() {
        spinner = true;
        disabled = true;
        const auth = getAuth();
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                spinner = false;
                disabled = false;
                $USER = userCredential.user;

            })
            .catch((error) => {
                spinner = false;
                disabled = false;
                if (error.code === "auth/user-not-found") {
                    alertOpened = true;
                    errorMessage = "User not found";
                }
                if (error.code === "auth/invalid-email") {
                    alertOpened = true;
                    errorMessage = "Invalid email";
                }
                console.log(error)
            }).finally(() => {
            // spinner = false;
        });
    }
</script>

<Page class="" >
    <div class="p-5 bg-blue-900 dark:bg-blue-900 h-screen" transition:fly="{{ x: 200, duration: 200 }}">
        <!--        <img alt="logo" class="w-[50%] m-auto" src="/Car8.png"/>-->

        <div class="flex">
            <a href="/" ><i class="fa-solid fa-arrow-left text-3xl flex-col mt-1 mr-5 text-white"></i></a>
            <div>
                <h1 class="text-4xl text-white font-bold">Sign In</h1>
                <p class="text-white">Sign in to your account or <br/><a href="/register" class="underline text-lg"> create an account</a></p>
            </div>


        </div>


        <div class="absolute inset-x-0 bottom-3 w-full p-5">
            <form on:submit|preventDefault>
                <div class="relative mb-4.5">
                    <input bind:value={email} type="email" id="email" class="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-50 bg-transparent rounded-lg border-1 border-gray-50 appearance-none focus:outline-none focus:ring-0 focus:border-gray-50 peer" placeholder=" " />
                    <label for="email" class="absolute text-sm text-gray-50 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-blue-900  px-2 peer-focus:px-2 peer-focus:text-gray-50 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">Email</label>
                </div>
                <div class="relative mb-4.5">
                    <input bind:value={password} type="password" id="password" class="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-50 bg-transparent rounded-lg border-1 border-gray-50 appearance-none focus:outline-none focus:ring-0 focus:border-gray-50 peer" placeholder=" " />
                    <label for="password" class="absolute text-sm text-gray-50 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-blue-900  px-2 peer-focus:px-2 peer-focus:text-gray-50 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">Password</label>
                </div>
                <button {disabled} on:click={signInWithEmail} class=" w-full text-black border border-white bg-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                        >
                    {#if spinner}
                        <i class="fa-solid fa-circle-notch m-auto text-gray-600 animate-spin fill-blue-600"></i>


                    {:else}
                        Sign in
                    {/if}
                </button>
            </form>

            <div class="my-3 relative">
                <div aria-hidden="true" class="absolute inset-0 flex items-center">
                    <div class="w-full border-t border-white"></div>
                </div>
                <div class="relative flex justify-center text-sm">
                    <span class=" px-3 bg-blue-900 text-white"> Or continue with </span>
                </div>
            </div>
            <button class="flex items-center justify-around gap-x-0 w-full text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 focus:outline-none " on:click={signInWithGoogle}>

                {#if spinner2}
                    <i class="fa-solid fa-circle-notch m-auto text-gray-200 animate-spin fill-blue-600 text-base"></i>
                {:else}
                    <img src="/Google-Button.png" class="w-5 h-5 inline-block mr-2" alt="google logo"/>
                    <span class="m-auto">Sign in with Google</span>
                {/if}
            </button>
        </div>
    </div>


    <Dialog opened={alertOpened} onBackdropClick={() => (alertOpened = false)}>
        <svelte:fragment slot="title">Error</svelte:fragment>
        { errorMessage}
        <svelte:fragment slot="buttons">
            <DialogButton onClick={() => (alertOpened = false)}>Dismiss</DialogButton>
        </svelte:fragment>
    </Dialog>


</Page>

<style>

</style>