import type { Database } from "~/models/database.types"
import type { Transaction } from "~/models/transaction.type"

export const useFetchTransactions = async () => {
	const supabase = useSupabaseClient<Database>()

	const { data: transactions, refresh, status } = await useAsyncData<Transaction[]>('transactions', async () => {
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

	const expense = computed(() => transactions.value?.filter(({ type }) => type === 'Expense'))
	const expenseCount = computed(() => expense.value?.length)
	const expenseTotal = computed(() => expense.value?.reduce((total: number, { amount }) => total + (amount ?? 0), 0) ?? 0)

	return {
		transactions,
		transactionGroupedByDate,
		refresh,
		status,
		incomeCount,
		incomeTotal,
		expenseCount,
		expenseTotal
	}
}
