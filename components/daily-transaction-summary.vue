<script setup lang="ts">
import type { Transaction } from '~/models/transaction.type';

const { transactions } = defineProps({
	date: {
		type: String,
		required: true,
	},
	transactions: {
		type: Array<Transaction>,
		required: true,
	}
})

const sum = computed(() => transactions
	.map(({ amount, type }) => ({ amount: amount ?? 0, type }))
	.reduce((total, { amount, type }) => type === 'Income' ? total + amount : total - amount, 0)
);
const { currency } = useCurrency(sum)
</script>

<template>
	<div
		class="grid grid-cols-2 py-4 border-b border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 font-bold">
		<div class="flex items-center justify-between">
			{{ date }}
		</div>

		<div class="flex items-center justify-end mr-10">
			{{ currency }}
		</div>
	</div>
</template>
