import type { TransactionViewPeriod } from "~/constants";
import { startOfYear, endOfYear, subYears, startOfMonth, endOfMonth, subMonths, startOfDay, endOfDay, subDays } from "date-fns"
import type { Period } from "~/models/period.types";

export const useSelectedTimePeriod = (selectedViewPeriod: Ref<TransactionViewPeriod>) => {
	const today = new Date()
	const current = computed(() => {
		switch (selectedViewPeriod.value) {
			case 'Yearly':
				return {
					from: startOfYear(today),
					to: endOfYear(today),
				}
			case 'Monthly':
				return {
					from: startOfMonth(today),
					to: endOfMonth(today),
				}
			case 'Daily':
				return {
					from: startOfDay(today),
					to: endOfDay(today),
				}
		}
	})

	const previous = computed(() => {
		switch (selectedViewPeriod.value) {
			case 'Yearly':
				return {
					from: startOfYear(subYears(today, 1)),
					to: endOfYear(subYears(today, 1)),
				}
			case 'Monthly':
				return {
					from: startOfMonth(subMonths(today, 1)),
					to: endOfMonth(subMonths(today, 1)),
				}
			case 'Daily':
				return {
					from: startOfDay(subDays(today, 1)),
					to: endOfDay(subDays(today, 1)),
				}
		}
	})

	return {
		current,
		previous,
	}
}
