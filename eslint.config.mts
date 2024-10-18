import { createConfigForNuxt } from '@nuxt/eslint-config/flat'

export default createConfigForNuxt({
	// options here
	features: {
		stylistic: {
			semi: false,
			commaDangle: 'always-multiline',
			indent: 'tab',
			quotes: 'single',
			arrowParens: true,
		},
	},
})
