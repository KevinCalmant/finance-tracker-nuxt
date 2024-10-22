<script setup lang="ts">
const fileInput = useTemplateRef<HTMLInputElement & { input: { files: File[] } }>('fileInput')

const {
	avatarUrl,
	uploadAvatar,
	uploading,
} = useAvatar(fileInput)
</script>

<template>
	<div>
		<div class="mb-4">
			<UFormGroup label="Current avatar" class="w-full" help="This would be blank by default">
				<UAvatar :src="avatarUrl ?? ''" size="3xl" />
			</UFormGroup>
		</div>

		<div class="mb-4">
			<UFormGroup label="New avatar" class="w-full" name="avatar"
				help="After choosing an image click Save to actually upload the new avatar">
				<UInput type="file" ref="fileInput" />
			</UFormGroup>
		</div>

		<UButton type="submit" color="black" variant="solid" label="Save" :loading="uploading"
			@click.prevent="uploadAvatar" />
	</div>
</template>
