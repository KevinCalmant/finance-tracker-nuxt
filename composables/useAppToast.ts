export const useAppToast = () => {
	const toast = useToast()

	type toasterParameters = Pick<Parameters<typeof toast.add>[0], 'title' | 'description'>

	return {
		toastSuccess: ({ title, description = undefined }: toasterParameters) => {
			toast.add({
				title,
				description,
				icon: 'i-heroicons-check-circle',
				color: 'green',
			})
		},
		toastError: ({ title, description = undefined }: toasterParameters) => {
			toast.add({
				title,
				description,
				icon: 'i-heroicons-exclamation-circle',
				color: 'red'
			})
		}
	}
}
