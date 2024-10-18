<script setup lang="ts">
import { transactionViewPeriod } from '~/constants'
import type { Transaction } from '~/models/transaction.type';

const selectedView = ref(transactionViewPeriod[1])
const isAddModalOpen = ref(false)
const editedTransaction = ref<Transaction>()
const { previous, current } = useSelectedTimePeriod(selectedView)

const { transactionGroupedByDate, refresh, status, incomeCount, incomeTotal, expenseCount, expenseTotal } = await useFetchTransactions(current)
const { refresh: refreshPrevious, incomeTotal: previousIncomeTotal, expenseTotal: previousExpenseTotal } = await useFetchTransactions(previous)

const toggleAddModal = () => {
	isAddModalOpen.value = !isAddModalOpen.value
}

const onSave = () => {
	refresh()
	refreshPrevious()
}
</script>

<template>
	<section class="flex items-center justify-between mb-10">
		<h1 class="text-4xl font-extrabold">
			Summary
		</h1>
		<div>
			<USelectMenu v-model="selectedView" :options="transactionViewPeriod" />
		</div>
	</section>

	<section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 sm:gap-16 mb-10">
		<Trend color="green" title="Income" :amount="incomeTotal" :last-amount="previousIncomeTotal"
			:loading="status === 'pending'" />
		<Trend color="red" title="Expense" :amount="expenseTotal" :last-amount="previousExpenseTotal"
			:loading="status === 'pending'" />
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
			<TransactionModal v-model="isAddModalOpen" :edited-transaction="editedTransaction" @saved="onSave" />
			<UButton icon="i-heroicons-plus-circle" color="white" variant="solid" label="Add" @click="toggleAddModal" />
		</div>
	</section>

	<section v-if="status === 'success'">
		<div v-for="(dailyTransactions, date) in transactionGroupedByDate" :key="date" class="mb-10">
			<DailyTransactionSummary :date="date" :transactions="dailyTransactions" />
			<Transactions v-for="transaction in dailyTransactions" :key="transaction.id" :transaction="transaction"
				@deleted="refresh" />
		</div>
	</section>
	<section v-else>
		<USkeleton v-for="i in 4" :key="i" class="h-8 w-full mb-2" />
	</section>

</template>
