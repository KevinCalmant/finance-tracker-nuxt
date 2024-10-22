<script setup lang="ts">
import { icomeTypes } from '~/models/income.types';
import { transactionCategories, transactionSchema, type Transaction } from '~/models/transaction.type';
import type { Database } from '~/models/database.types';
import type { PropType } from 'vue';

const isOpen = defineModel({
	required: true,
	type: Boolean,
})

const props = defineProps({
	transaction: Object,
})

const isEditing = computed(() => !!props.transaction)
const emits = defineEmits(['saved'])

const initialState = props.transaction ? { ...props.transaction } : {
	amount: undefined,
	created_at: undefined,
	type: undefined,
	description: undefined,
	category: undefined,
}

const supabase = useSupabaseClient<Database>()
const {
	toastSuccess,
	toastError,
} = useAppToast()
const isLoading = ref(false)
console.log(props.transaction)
const state = ref({ ...initialState })

const transactionTypeOptions = icomeTypes as unknown as string[]
const transactionCategoryOptions = transactionCategories as unknown as string[]

const onSubmit = async () => {
	try {
		isLoading.value = true
		// @ts-ignore
		const { error } = await supabase.from("transactions").upsert({
			...state.value,
			id: props.transaction?.id
		})

		if (error) throw error

		toastSuccess({
			title: 'Transaction added'
		})
		state.value = initialState
		emits('saved')
		isOpen.value = false
	} catch (error) {
		toastError({
			title: 'Transaction not saved',
		})
	} finally {
		isLoading.value = false
	}
}
</script>

<template>
	<UModal v-model="isOpen" class="space-y-4">
		<UCard>
			<template #header>
				{{ isEditing ? 'Add' : 'Edit' }} Transaction
			</template>

			<div>
				<UForm :schema="transactionSchema" :state="state" @submit.prevent="onSubmit">
					<UFormGroup name="type" label="Transaction type" class="mb-4" :required="true">
						<UInputMenu :disabled="isEditing" v-model="state.type" :options="transactionTypeOptions"
							placeholder="Select the transaction type" />
					</UFormGroup>

					<UFormGroup label="Amount" name="amount" class="mb-4" :required="true">
						<UInput v-model="state.amount" type="number" placeholder="amount"
							icon="i-heroicons-currency-euro" />
					</UFormGroup>

					<UFormGroup label="Transaction date" name="created_at" class="mb-4" :required="true">
						<UInput v-model="state.created_at" type="date" placeholder="amount"
							icon="i-heroicons-calendar-days-20-solid" />
					</UFormGroup>

					<UFormGroup name="category" label="Category" class="mb-4" hint="Optional">
						<UInputMenu v-model="state.category" :options="transactionCategoryOptions"
							placeholder="Category" />
					</UFormGroup>

					<UFormGroup name="description" label="Description" hint="Optional" class="mb-4">
						<UInput v-model="state.description" placeholder="Description" />
					</UFormGroup>

					<UButton type="submit" color="black" variant="solid" label="Save" :loading="isLoading" />
				</UForm>
			</div>
		</UCard>
	</UModal>
</template>
