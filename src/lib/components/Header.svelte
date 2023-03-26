<script>
    import { Navbar, Link } from 'konsta/svelte';
    import Profile from './Profile.svelte';

    export let title = "";
</script>

<!-- BG TOP -->
<div class="bg-blue-900 h-[15vh] py-5 px-3">
    <Navbar
            class="top-0 sticky mb-5"
            transparent="true"
    >
        <div slot="left">
            <h1 class="text-2xl text-white font-bold"><Link slot="left" onClick={() => history.back()} class="" navbar><i class="fa-solid fa-chevron-left text-2xl flex-col text-white mr-3"></i></Link>{title}</h1>
        </div>
        <Profile slot="right" />
    </Navbar>
</div>

<!-- BG BOTTOM -->