<script>
  import { USER } from "$lib/store.js";
  import Footer from "$lib/components/Footer.svelte";
</script>


{#if $USER}
  <slot />
  <Footer />
{:else}
  Loading..
{/if}