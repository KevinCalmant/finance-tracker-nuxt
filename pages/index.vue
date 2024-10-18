<script setup lang="ts">
import { transactionView } from '~/constants'
import type { Database } from '~/models/database.types'
import type { Transaction } from '~/models/transaction.type';

const selectedView = ref(transactionView[1])
const isAddModalOpen = ref(false)
const editedTransaction = ref<Transaction>()

const supabase = useSupabaseClient<Database>()

const { data: transactions, refresh: refreshTransactions, status } = await useAsyncData('transactions', async () => {
	const { data, error } = await supabase.from('transactions').select().order('created_at', { ascending: false }).order('id', { ascending: false })
	if (error) return []
	return data
})

const transactionGroupedByDate = computed(() => groupBy(transactions.value ?? [], ({ created_at }) =>
	new Date(created_at).toISOString().split('T')[0],
))

const icome = computed(() => transactions.value?.filter(({ type }) => type === 'Income'))
const incomeCount = computed(() => icome.value?.length)
const incomeTotal = computed(() => icome.value?.reduce((total: number, { amount }) => total + (amount ?? 0), 0) ?? 0)

const expense = computed(() => transactions.value?.filter(({ type }) => type === 'Income'))
const expenseCount = computed(() => expense.value?.length)
const expenseTotal = computed(() => expense.value?.reduce((total: number, { amount }) => total + (amount ?? 0), 0) ?? 0)

const toggleAddModal = () => {
	isAddModalOpen.value = !isAddModalOpen.value
}
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
		<Trend color="green" title="Income" :amount="incomeTotal" :last-amount="3000" :loading="false" />
		<Trend color="red" title="Expense" :amount="expenseTotal" :last-amount="5000" :loading="false" />
		<Trend color="green" title="Investments" :amount="4000" :last-amount="3000" :loading="false" />
		<Trend color="red" title="Savings" :amount="4000" :last-amount="4100" :loading="false" />
	</section>

	<section class="flex justify-between mb-10">
		<div>
			<h2 class="text-2xl font-extrabold">Transactions</h2>
			<div class="text-gray-500 dark:text-gray-400">
				You have {{ incomeCount }} incomes and {{ expenseCount }} expenses this period
			</div>
		</div>

		<div>
			<TransactionModal v-model="isAddModalOpen" :edited-transaction="editedTransaction" @saved="refreshTransactions" />
			<UButton icon="i-heroicons-plus-circle" color="white" variant="solid" label="Add" @click="toggleAddModal" />
		</div>
	</section>

	<section v-if="status === 'success'">
		<div v-for="(dailyTransactions, date) in transactionGroupedByDate" :key="date" class="mb-10">
			<DailyTransactionSummary :date="date" :transactions="dailyTransactions" />
			<Transactions v-for="transaction in dailyTransactions" :key="transaction.id" :transaction="transaction"
				@deleted="refreshTransactions" />
		</div>
	</section>
	<section v-else>
		<USkeleton v-for="i in 4" :key="i" class="h-8 w-full mb-2" />
	</section>

</template>
