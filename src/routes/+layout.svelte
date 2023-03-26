<script>
    import '$lib/firebase.js';
    import '../app.css';
    import { App, useTheme } from 'konsta/svelte';
    import { Capacitor } from '@capacitor/core';
    import { onMount } from 'svelte';
    import { pwaInfo } from 'virtual:pwa-info';

    let ReloadPrompt

    let theme = "";

    onMount(async () => {
      if (pwaInfo) {
        const { registerSW } = await import('virtual:pwa-register')
        registerSW({
          immediate: true,
          onRegistered(r) {
            // uncomment following code if you want check for updates
            // r && setInterval(() => {
            //    console.log('Checking for sw update')
            //    r.update()
            // }, 20000 /* 20s for testing purposes */)
            console.log(`SW Registered: ${r}`)
          },
          onRegisterError(error) {
            console.log('SW registration error', error)
          }
        })
      }
      pwaInfo && (ReloadPrompt = (await import('$lib/ReloadPrompt.svelte')).default)
      theme = Capacitor.getPlatform() === 'ios' ? 'ios' : Capacitor.getPlatform() === 'material' ? 'material' : Capacitor.getPlatform() === 'web' ? 'ios' : '';
    })

    $: webManifest = pwaInfo ? pwaInfo.webManifest.linkTag : ''


    //
    // let theme;
    // theme = useTheme((newValue) => {
    //   // to keep it reactive, update value on theme update in parent components
    //   theme = newValue;
    // });

    console.log(theme); // -> 'ios'
  </script>

  <svelte:head>
    {@html webManifest}
  </svelte:head>
  
  <App theme="material" safeAreas class="touch-action-none">
    <slot />
  </App>

{#if ReloadPrompt}
  <svelte:component this={ReloadPrompt} />
{/if}
