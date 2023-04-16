<script>
    import {page} from "$app/stores";
</script>

<div class="h-screen bg-blue-900 flex items-center justify-center text-white">
    {$page.error.message}
</div>