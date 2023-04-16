<script>
  import { USER } from "$lib/store.js";
  import Footer from "$lib/components/Footer.svelte";
  import {goto} from "$app/navigation";
</script>


{#if $USER}
  <slot />
  <Footer />
  {:else}
  <div class="h-screen bg-blue-900 flex items-center justify-center">
    <i class="fa-solid fa-circle-notch text-white animate-spin fill-blue-600 text-3xl"></i>
    <p class="text-white ml-3">Loading...</p>
  </div>
{/if}