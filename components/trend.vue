<script setup lang="ts">
const { amount, lastAmount } = defineProps({
	title: {
		type: String,
		required: true,
	},
	amount: {
		type: Number,
		required: true,
	},
	lastAmount: {
		type: Number,
		required: true,
	},
	color: {
		type: String as PropType<'green' | 'red'>,
		required: true,
	},
	loading: {
		type: Boolean,
		required: true,
	},
})

const { currency } = useCurrency(amount)
const trendingUp = computed(() => amount >= lastAmount)
const percentageTrend = computed(() => {
	if (amount === 0 || lastAmount === 0) return '∞%'

	const bigger = Math.max(amount, lastAmount)
	const lower = Math.min(amount, lastAmount)
	const ratio = ((bigger - lower) / lower) * 100

	return `${Math.ceil(ratio)} % `
})
</script>

<template>
	<div>
		<div class="font-bold" :class="[color]">{{ title }}</div>

		<div class="text-2xl font-extrabold text-black dark:text-white mb-2">
			<USkeleton v-if="loading" class="h-8 w-full" />
			<div v-else>{{ currency }}</div>
		</div>

		<div>
			<USkeleton v-if="loading" class="h-6 w-full" />
			<div v-else class="flex space-x-1 items-center text-sm">
				<UIcon :name="`i-heroicons-arrow-trending-${trendingUp ? 'up' : 'down'}`" class="w-6 h-6"
					:class="[trendingUp ? 'green' : 'red']" />
				<div class="text-gray-500 dark:text-gray-400">
					{{ percentageTrend }} vs last period
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.green {
	@apply text-green-600 dark:text-green-400;
}

.red {
	@apply text-red-600 dark:text-red-400;
}
</style>
