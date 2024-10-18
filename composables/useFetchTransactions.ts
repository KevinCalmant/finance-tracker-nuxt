import type { Database } from "~/models/database.types"
import type { Period } from "~/models/period.types"
import type { Transaction } from "~/models/transaction.type"

const fetchTransactions = async (period: ComputedRef<Period | undefined>) => await useAsyncData<Transaction[]>(`transactions-${period?.value?.to.toDateString()}`, async () => {
	const supabase = useSupabaseClient<Database>()
	const { data, error } = await supabase
		.from('transactions')
		.select()
		.gte('created_at', period?.value?.from.toISOString().split('T')[0])
		.lte('created_at', period?.value?.to.toISOString().split('T')[0])
		.order('created_at', { ascending: false })
		.order('id', { ascending: false })
	if (error) return []
	return data
})


export const useFetchTransactions = async (period: ComputedRef<Period | undefined>) => {
	const { data: transactions, status, refresh } = await fetchTransactions(period)

	const transactionGroupedByDate = computed(() => groupBy(transactions.value ?? [], ({ created_at }) =>
		new Date(created_at).toISOString().split('T')[0],
	))

	watch(period, () => refresh())

	const icome = computed(() => transactions.value?.filter(({ type }) => type === 'Income'))
	const incomeCount = computed(() => icome.value?.length)
	const incomeTotal = computed(() => icome.value?.reduce((total, { amount }) => total + (amount || 0), 0) ?? 0)

	const expense = computed(() => transactions.value?.filter(({ type }) => type === 'Expense'))
	const expenseCount = computed(() => expense.value?.length)
	const expenseTotal = computed(() => expense.value?.reduce((total, { amount }) => total + (amount || 0), 0) ?? 0)

	return {
		transactions,
		transactionGroupedByDate,
		refresh,
		status,
		incomeCount,
		incomeTotal,
		expenseCount,
		expenseTotal,
	}
}
