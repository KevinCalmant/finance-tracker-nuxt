export const transactionViewPeriod = ['Yearly', 'Monthly', 'Daily'] as const as unknown as string[]
export type TransactionViewPeriod = typeof transactionViewPeriod[number]
