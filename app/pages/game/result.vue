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
        <!-- Grain -->
        <div class="absolute inset-0 opacity-20 pointer-events-none"
            style="background-image: url('data:image/svg+xml,%3Csvg viewBox=%220 0 256 256%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22 opacity=%221%22/%3E%3C/svg%3E'); background-size: 200px 200px;" />
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 rounded-full bg-[#810000]/15 blur-[130px] pointer-events-none" />
        <!-- Ornamen sudut -->
        <div class="absolute top-5 left-5 w-12 h-12 border-t border-l border-[#d3b484]/40 pointer-events-none" />
        <div class="absolute top-5 right-5 w-12 h-12 border-t border-r border-[#d3b484]/40 pointer-events-none" />
        <div class="absolute bottom-5 left-5 w-12 h-12 border-b border-l border-[#d3b484]/40 pointer-events-none" />
        <div class="absolute bottom-5 right-5 w-12 h-12 border-b border-r border-[#d3b484]/40 pointer-events-none" />
        <div class="absolute inset-5 border border-[#d3b484]/10 pointer-events-none" />
        <!-- Label pojok -->
        <div class="absolute top-8 right-16 flex items-center gap-3">
            <div class="h-px w-10 bg-[#d3b484]/30" />
            <span class="text-[#d3b484]/40 text-[10px] tracking-[0.4em] font-snpro uppercase">Hasil Akhir</span>
        </div>
        <GameResult />
    </div>
</template>