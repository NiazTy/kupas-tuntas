<script setup lang="ts">
import { gameAssets } from '~/data/assets'

const props = defineProps<{
  button: string
  size?: string
}>()

const buttonAssets = gameAssets.pictures.ui.button

const src = computed(() => {
  const match = buttonAssets.find(p => p.includes(props.button))

  // Dev warning kalau nama tombol tidak ditemukan
  if (!match && import.meta.dev) {
    console.warn(
      `[ButtonMenu] Tombol "${props.button}" tidak ditemukan di gameAssets.pictures.ui.button.\n` +
      `Tersedia: ${buttonAssets.map(p => p.split('/').pop()).join(', ')}`
    )
  }

  return match ?? buttonAssets[0]
})
</script>

<template>
  <button class="hover:cursor-pointer" type="button">
    <img
      :src="src"
      :alt="button"
      :class="['object-cover hover:-translate-y-1 transition-all opacity-90', size ?? 'h-16']"
    />
  </button>
</template>