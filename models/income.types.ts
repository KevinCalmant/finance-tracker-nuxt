export const icomeTypes = ['Income', 'Expense', 'Investments', 'Savings'] as const
export type IncomeType = typeof icomeTypes[number]
