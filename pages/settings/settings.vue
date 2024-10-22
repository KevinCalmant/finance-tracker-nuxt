<script setup lang="ts">
import { z } from 'zod';
import { transactionViewPeriod, type TransactionViewPeriod } from '~/constants';

const supabase = useSupabaseClient()
const user = useSupabaseUser()
const {
	toastSuccess,
	toastError,
} = useAppToast()

const pending = ref(false)

const state = ref({
	transactionView: user.value?.user_metadata?.preferences?.transactionView ?? transactionViewPeriod[1],
})

const schema = z.object({
	transactionView: z.custom<TransactionViewPeriod>(),
})

const onSubmit = async () => {
	try {
		const { error } = await supabase.auth.updateUser({
			data: {
				preferences: {
					transactionView: state.value.transactionView,
				}
			},
		})

		if (error) throw error
		toastSuccess({
			title: 'Settings updated with success',
		})
	} catch (error) {
		toastError({
			title: 'Error while updating setting'
		})
	} finally {
		pending.value = false
	}
}
</script>

<template>
	<UForm @submit.prevent="onSubmit" :schema="schema" :state="state">
		<UFormGroup label="Transaction View" class="mb-4" help="Choose how you would like to view transactions">
			<USelect v-model="state.transactionView" :options="transactionViewPeriod" />
		</UFormGroup>

		<UButton type="submit" color="black" variant="solid" label="Save" :loading="pending" />
	</UForm>
</template>
