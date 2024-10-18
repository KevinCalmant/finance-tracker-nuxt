import { z } from "zod"
import type { IncomeType } from "./income.types"

export const selectOptionsSchema = z.object({
	value: z.custom<IncomeType>(),
	label: z.custom<IncomeType>()
})

export type SelectionOptions = z.infer<typeof selectOptionsSchema>
