import { v4 as uuidv4 } from 'uuid'
import type { ShallowRef } from 'vue'

export const useAvatar = (fileInput?: Readonly<ShallowRef<HTMLInputElement & { input: { files: File[] } } | null>>) => {
	const supabase = useSupabaseClient()
	const user = useSupabaseUser()
	const {
		toastSuccess,
		toastError,
	} = useAppToast()

	const uploading = ref(false)

	const uploadAvatar = async () => {
		try {
			uploading.value = true

			const currentAvatarUrl = user.value?.user_metadata?.avatar_url

			const avatarFile = fileInput?.value?.input?.files[0]
			if (!avatarFile) {
				toastError({
					title: 'Select a file to upload first',
				})
				return
			}

			const avatarFileExt = avatarFile.name.split('.').pop()
			const avatarFileName = `${uuidv4()}.${avatarFileExt}`
			const { error } = await supabase
				.storage
				.from('avatars')
				.upload(avatarFileName, avatarFile)

			if (error) throw error

			await supabase.auth.updateUser({
				data: {
					avatar_url: avatarFileName,
				},
			})

			if (currentAvatarUrl) {
				const { error } = await supabase
					.storage
					.from('avatars')
					.remove([user.value?.user_metadata.avatar_url])

				if (error) throw error
			}

			toastSuccess({
				title: "Avatar uploaded succesfully"
			})
		} catch (error) {
			toastError({
				title: "Error while uploading your new avatar"
			})
		} finally {
			uploading.value = false
		}
	}

	const { data: avatarUrl, refresh: refreshAvatar } = useAsyncData(async () => {
		const { data } = await supabase
			.storage
			.from('avatars')
			.getPublicUrl(user.value?.user_metadata?.avatar_url)
		return data.publicUrl ?? ''
	})

	watch(user, () => refreshAvatar())

	return {
		uploadAvatar,
		avatarUrl,
		uploading,
	}
}
