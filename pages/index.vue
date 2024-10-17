<script setup lang="ts">
import { transactionView } from '~/constants';
import type { Database } from '~/models/database.types';

const selectedView = ref(transactionView[1])

const supabase = useSupabaseClient<Database>()

const { data: transactions } = await useAsyncData('transactions', async () => {
	const { data, error } = await supabase.from('transactions').select()
	if (error) return []
	return data
})
</script>

<template>
	<section class="flex items-center justify-between mb-10">
		<h1 class="text-4xl font-extrabold">
			Summary
		</h1>
		<div>
			<USelectMenu v-model="selectedView" :options="transactionView" />
		</div>
	</section>

	<section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 sm:gap-16 mb-10">
		<Trend color="green" title="Income" :amount="4000" :last-amount="3000" :loading="false" />
		<Trend color="red" title="Income" :amount="4000" :last-amount="5000" :loading="false" />
		<Trend color="green" title="Income" :amount="4000" :last-amount="3000" :loading="false" />
		<Trend color="red" title="Income" :amount="4000" :last-amount="4100" :loading="false" />
	</section>

	<section>
		<Transactions v-for="transaction in transactions" :key="transaction.id" :transaction="transaction" />
	</section>
</template>
