<script setup lang="ts">
import { z } from 'zod';

const supabase = useSupabaseClient()
const user = useSupabaseUser()

const {
	toastSuccess,
	toastError,
} = useAppToast()

const pending = ref(false)

const initialState = {
	name: user.value!.user_metadata?.full_name,
	email: user.value!.email
}
const state = ref(initialState)

const schema = z.object({
	name: z.string().min(2).optional(),
	email: z.string().email(),
})

const onSubmit = async () => {
	try {
		pending.value = true
		const {
			name,
			email,
		} = state.value
		const { error } = await supabase.auth.updateUser({
			...(email !== user.value?.email ? { email } : {}),
			data: {
				full_name: name,
			},
		})

		if (error) throw error
		toastSuccess({
			title: 'Profile updated with success',
		})
	} catch (error) {
		toastError({
			title: 'Error while updated profile'
		})
	} finally {
		pending.value = false
	}
}
</script>

<template>
	<UForm :state="state" :schema="schema" @submit.prevent="onSubmit">
		<UFormGroup label="Full Name" name="name" class="mb-4">
			<UInput v-model="state.name" type="string" />
		</UFormGroup>
		<UFormGroup class="mb-4" label="Email" name="email"
			help="You will receive a confirmation email on both the old and the new addresses if you modify the email address">
			<UInput v-model="state.email" type="email" />
		</UFormGroup>
		<UButton type="submit" color="black" variant="solid" :loading="pending">Save</UButton>
	</UForm>
</template>
