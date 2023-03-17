import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter(),
    files: {
      lib: "src/lib"
    }
  },
  preprocess: vitePreprocess()
};

export default config;