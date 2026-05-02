<!-- pages/game/result.vue -->

<script setup>
import { gameAssets } from "~/data/assets"

const pageAssets = [
  ...gameAssets.pictures.ui.root
//   ...gameAssets.pictures.ui,
]
const { progress, loading, startLoading } = useAssetManager(pageAssets, {
    minDuration: 1500,
    continueOnError: true,
})

onMounted(async () => {
    await startLoading()
})

definePageMeta({
  layout: "header"
})
</script>

<template>
    <!-- Loading -->
    <Transition name="fade">
        <LoadingScreen v-if="loading" :progress="progress" />
    </Transition>
    <!-- PAGE -->
    <div v-if="!loading" class="relative min-h-screen bg-[#0d0a06] flex items-center justify-center overflow-hidden px-6 py-16">
        <Ornament3 />
        <!-- Label pojok -->
        <div class="absolute top-8 right-16 flex items-center gap-3">
            <div class="h-px w-10 bg-[#d3b484]/30" />
            <span class="text-[#d3b484]/40 text-[10px] tracking-[0.4em] font-snpro uppercase">Hasil Akhir</span>
        </div>
        <GameResult />
    </div>
</template>