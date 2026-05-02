<!-- GamesScoreBoard -->
<script setup>
defineProps({
    score: Number,
    timer: Number
})
</script>

<template>
    <div class="relative w-full max-w-lg">
        <!-- Shadow offset -->
        <div class="absolute inset-0 translate-x-1.5 translate-y-1.5 border border-[#d3b484]/10 pointer-events-none" />
        <!-- Box -->
        <div class="relative border border-[#d3b484]/25 bg-[#1a1208]/70 px-6 py-3 flex items-center justify-between">
            <!-- Ornamen sudut -->
            <div class="absolute top-1.5 left-1.5 w-3 h-3 border-t border-l border-[#d3b484]/30" />
            <div class="absolute top-1.5 right-1.5 w-3 h-3 border-t border-r border-[#d3b484]/30" />
            <div class="absolute bottom-1.5 left-1.5 w-3 h-3 border-b border-l border-[#d3b484]/30" />
            <div class="absolute bottom-1.5 right-1.5 w-3 h-3 border-b border-r border-[#d3b484]/30" />
            <!-- Skor -->
            <div class="flex items-center gap-3">
                <span class="text-[#810000] text-xs">✦</span>
                <div class="flex flex-col">
                    <span class="text-[#d3b484]/40 text-[9px] tracking-[0.3em] uppercase font-snpro">Poin</span>
                    <span class="text-[#d3b484] text-lg font-display leading-tight">{{ score }}</span>
                </div>
            </div>
            <!-- Garis tengah -->
            <div class="h-8 w-px bg-[#d3b484]/15" />
            <!-- Timer -->
            <div class="flex items-center gap-3">
                <div class="flex flex-col items-end">
                    <span class="text-[#d3b484]/40 text-[9px] tracking-[0.3em] uppercase font-snpro">Waktu</span>
                    <span
                        class="text-lg font-display leading-tight transition-colors"
                        :class="timer <= 3 ? 'text-[#810000]' : 'text-[#d3b484]'"
                    >
                        {{ Math.ceil(timer) }}s
                    </span>
                </div>
                <span class="text-[9px]" :class="timer <= 3 ? 'text-[#810000] animate-pulse' : 'text-[#d3b484]/40'">⏱</span>
            </div>
        </div>
    </div>
</template>