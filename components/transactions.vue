<script setup lang="ts">
import type { Database } from '~/models/database.types';
import type { Transaction } from '~/models/transaction.type';

const { transaction } = defineProps({
	transaction: {
		type: Object as PropType<Transaction>,
		required: true
	}
})

const emit = defineEmits(['deleted'])

const isLoading = ref(false)
const toast = useToast()
const supabase = useSupabaseClient<Database>()

const { currency } = useCurrency(transaction.amount ?? 0)
const isIncome = computed(() => transaction.type === 'Income')
const iconName = computed(() =>
	`i-heroicons-arrow-${isIncome.value ? 'up-right' : 'down-left'}`
);
const iconClass = computed(() =>
	isIncome.value ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
);

const deleteTransaction = async () => {
	isLoading.value = true
	try {
		await supabase.from('transactions').delete().eq('id', transaction.id)
		toast.add({
			title: 'Transaction deleted',
			icon: 'i-heroicons-check-circle',
			color: 'green',
		})
		emit('deleted')
	} catch (error) {
		toast.add({
			title: 'Transaction deletion failed',
			icon: 'i-heroicons-exclamation-circle',
			color: 'red',
		})
	} finally {
		isLoading.value = false
	}
}

const items = [
	[
		{
			label: 'Edit',
			icon: 'i-heroicons-pencil-square-20-solid',
			click: () => console.log('Edit'),
		},
		{
			label: 'Delete',
			icon: 'i-heroicons-trash-20-solid',
			click: () => deleteTransaction(),
		}
	]
]
</script>

<template>
	<div class="grid grid-cols-2 py-4 border-b border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-100">
		<div class="flex items-center justify-between">
			<div class="flex items-center space-x-1">
				<UIcon :name="iconName" :class="iconClass" />
				<div>{{ transaction.description }}</div>
			</div>

			<div>
				<UBadge v-if="transaction.category" color="white">{{ transaction.category }}</UBadge>
			</div>
		</div>
		<div class="flex items-center justify-end space-x-2">
			<div>{{ currency }}</div>
			<div>
				<UDropdown :items="items" :popper="{ placement: 'bottom-start' }">
					<UButton color="white" variant="ghost" trailing-icon="i-heroicons-ellipsis-horizontal" :loading="isLoading" />
				</UDropdown>
			</div>
		</div>
	</div>
</template>
