import { sveltekit } from '@sveltejs/kit/vite';
import {SvelteKitPWA} from '@vite-pwa/sveltekit';
import { defineConfig } from 'vite';


export default defineConfig({
	server: {
		port: 5174,
	},
	plugins: [
		sveltekit(),
		SvelteKitPWA({
				srcDir: './src',
				mode: 'production',
				strategies: 'injectManifest',
				filename: 'prompt-sw.ts',
				scope: '/',
				base: '/',
				manifest: {
					name: 'Car8',
					short_name: 'Car8',
					description: 'Car8',
					lang: 'en-US',
					start_url: '/',
					display: 'standalone',
					background_color: '#3048d5',
					theme_color: '#3048d5',
					icons: [
						{
							src: '/icons/128x128.png',
							sizes: '128x128',
							type: 'image/png'
						},
						{
							src: '/icons/144x144.png',
							sizes: '144x144',
							type: 'image/png'
						},
						{
							src: '/icons/152x152.png',
							sizes: '152x152',
							type: 'image/png'
						},
						{
							src: '/icons/192x192.png',
							sizes: '192x192',
							type: 'image/png'
						},
						{
							src: '/icons/256x256.png',
							sizes: '256x256',
							type: 'image/png'
						},
						{
							src: '/icons/512x512.png',
							sizes: '512x512',
							type: 'image/png'
						},
						{
							src: '/icons/512x512.png',
							sizes: '512x512',
							type: 'image/png',
							purpose: 'any maskable',
						}
					]
				},
				injectManifest: {
					globPatterns: ['client/**/*.{js,css,ico,png,svg,webp,woff,woff2}']
				},
				devOptions: {
					enabled: true,
					type: 'module',
					navigateFallback: '/',
				},
				// if you have shared info in svelte config file put in a separate module and use it also here
				kit: {}
			}
		)
	]
});
