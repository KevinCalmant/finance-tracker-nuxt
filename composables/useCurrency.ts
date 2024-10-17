export const useCurrency = (amount: number | Ref<number>) => {
	const currency = computed(() => new Intl.NumberFormat('fr-FR', {
		style: 'currency',
		currency: 'EUR',
	}).format(isRef(amount) ? amount.value : amount))

	return {
		currency,
	}
}
