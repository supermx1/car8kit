<script>
    import {
        Page,
        Dialog,
        DialogButton,
        Navbar,
        Link
    } from 'konsta/svelte';
    import { fly } from 'svelte/transition';
    import {GoogleAuthProvider, getAuth, signInWithPopup, signInWithRedirect, signInWithEmailAndPassword} from "firebase/auth";
    import {LOGO, USER} from "$lib/store.js";
    import {goto} from "$app/navigation";


    let show = true;
    let email = "";
    let password = "";
    let errorMessage="";
    let errorTitle="";
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
                    errorTitle = "Woah!";
                }
                if (error.code === "auth/invalid-email") {
                    alertOpened = true;
                    errorMessage = "Invalid email";
                    errorTitle = "Woah!";
                }
                if (error.code === "auth/popup-closed-by-user") {
                    alertOpened = true;
                    errorMessage = "Something went wrong";
                    errorTitle = "Woah!";
                }
                console.log(error)
            }).finally(() => {
            // spinner = false;
        });
    }
</script>

<Page class="" >
    <div class="p-5 bg-blue-900 dark:bg-blue-900 h-screen" transition:fly="{{ x: 200, duration: 200 }}">

        <Navbar
                class="top-0 sticky"
                transparent="true"
        >
            <Link slot="left" href="/" class="" navbar><i class="fa-solid fa-chevron-left text-3xl flex-col text-white"></i></Link>
        </Navbar>

        <div class="mt-10">
                <img src={$LOGO} alt="logo" class="w-[25%] m-auto"/>
                <h1 class="text-3xl text-white font-bold text-center mt-5 mb-8">Sign in</h1>
        </div>


        <form on:submit={signInWithEmail}>
            <div class="relative mb-4.5">
                <input bind:value={email} type="email" id="email" required class="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-50 bg-transparent rounded-lg border-1 border-gray-50 appearance-none focus:outline-none focus:ring-0 focus:border-gray-50 peer" placeholder=" " />
                <label for="email" class="absolute text-sm text-gray-50 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-blue-900  px-2 peer-focus:px-2 peer-focus:text-gray-50 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">Email</label>
            </div>
            <div class="relative mb-4.5">
                <i on:mousedown={()=> show = !show} class="{show && password !='' ? 'block' : 'hidden'} fa-solid fa-eye text-white absolute inset-y-0 right-4 flex items-center pl-3"></i>
                <i on:mousedown={()=> show = !show} class="{show ? 'hidden' : 'block'} fa-solid fa-eye-slash text-white absolute inset-y-0 right-4 flex items-center pl-3"></i>
                <input on:input={(e)=>password=e.target.value} type={!show ? 'text': 'password'}  id="password" required class="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-50 bg-transparent rounded-lg border-1 border-gray-50 appearance-none focus:outline-none focus:ring-0 focus:border-gray-50 peer" placeholder=" " />
                <label for="password" class="absolute text-sm text-gray-50 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-blue-900  px-2 peer-focus:px-2 peer-focus:text-gray-50 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">Password</label>
            </div>
            <button disabled={disabled || email == "" || password == ""} type="submit" class="w-full text-black border border-white bg-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
            <div class="relative flex justify-center">
                <span class="text-sm px-3 bg-blue-900 text-white"> Or continue to </span>
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

        <div class="absolute inset-x-0 bottom-3 w-full p-5">

            <p class="text-white text-lg text-center font-light">Don't have an account? <a href="/register" class="underline font-bold">Sign up</a> </p>

        </div>
    </div>

    <Dialog opened={alertOpened} onBackdropClick={() => (alertOpened = false)}>
        <svelte:fragment slot="title">{errorTitle}</svelte:fragment>
        { errorMessage}
        {#if errorMessage == "User not found"}
            , but you can sign up for an account here
        {/if}
        <svelte:fragment slot="buttons">
            {#if errorMessage == "User not found"}
                <DialogButton onClick={() => goto("/register")}>Sign Up</DialogButton>
            {/if}
            <DialogButton onClick={() => (alertOpened = false)}>Dismiss</DialogButton>
        </svelte:fragment>
    </Dialog>


</Page>

<style>

</style>