import { z } from "zod"
import type { IncomeType } from "./income.types"

export const transactionCategories = ['Food', 'Housing', 'Car', 'Entertainment'] as const
export type TransactionCategories = typeof transactionCategories[number]

export type Transaction = {
	amount: number | null
	category: string | null
	created_at: string
	description: string | null
	id: number
	type: string | null
}

export const transactionSchema = z.object({
	amount: z.number(),
	created_at: z.string().transform((date) => new Date(date)),
	type: z.custom<IncomeType>(),
	description: z.string().optional(),
	category: z.custom<TransactionCategories>(),
})

export type TransactionSchema = z.infer<typeof transactionSchema>
