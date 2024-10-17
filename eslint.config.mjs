import { createConfigForNuxt } from '@nuxt/eslint-config/flat';

export default createConfigForNuxt({
	// options here
	features: {
		stylistic: {
			semi: false,
			commaDangle: 'always',
			indent: 'tab',
			quotes: 'single',
			arrowParens: true,
		},
	},
});
