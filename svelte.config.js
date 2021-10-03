import preprocess from 'svelte-preprocess';
import static_adapter  from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		// hydrate the <div id="svelte"> element in src/app.html
		target: '#svelte',
		adapter: static_adapter (), 
		paths: (process.env.NODE_ENV === 'production' ? {
			base: '/hex',
			assets: 'https://angramme.github.io/hex',
		} : {}),
	},
	preprocess: preprocess(),
};

export default config;
