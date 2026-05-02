<script setup lang="ts">
import { gameAssets } from "~/data/assets"

const pageAssets = [
  ...gameAssets.pictures.artwork,
//   ...gameAssets.pictures.ui,
]

const { progress, loading, startLoading } = useAssetManager(pageAssets, {
  minDuration: 1500,
  continueOnError: true,
})

onMounted(async () => {
  await startLoading()
})

const artworkRoom = gameAssets.pictures.artwork.find(p =>
  p.includes("ruangan-kosong")
) ?? gameAssets.pictures.artwork[0]

usePageMusic(true)
</script>

<template>
    <!-- Loading -->
    <Transition name="fade">
        <LoadingScreen v-if="loading" :progress="progress" />
    </Transition>
    <!-- PAGE -->
    <div v-if="!loading" class="">
        <GameMainMenu :asset="artworkRoom" />
    </div>
</template>

<!-- last update 27-04-2026 by Niaz -->