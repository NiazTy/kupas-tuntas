<script setup lang="ts">
interface Box {
    id: "fakta" | "tokoh" | "foto"
    label: string
}

defineProps<{
    box: Box
    isActive: boolean
    isEmpty: boolean
    revealedCount: number
    total: number
}>()

const emit = defineEmits<{
    open: [box: Box]
}>()
</script>

<template>
    <div class="flex flex-col items-center gap-3">
        <!-- Kardus wrapper -->
        <div class="relative border transition-all duration-200" :class="isEmpty ? 'border-[#d3b484]/10 bg-[#1a1208]/30 cursor-not-allowed opacity-60' : isActive ? 'border-[#d3b484]/60 bg-[#1a1208]/80 -translate-y-1 cursor-pointer' : 'border-[#d3b484]/20 bg-[#1a1208]/50 hover:border-[#d3b484]/40 hover:-translate-y-1 cursor-pointer group'" @click="!isEmpty && emit('open', box)" >
            <!-- Ornamen sudut -->
            <div class="absolute top-1 left-1   w-2 h-2 border-t border-l pointer-events-none transition-colors" :class="isEmpty ? 'border-[#d3b484]/15' : isActive ? 'border-[#d3b484]/70' : 'border-[#d3b484]/40 group-hover:border-[#d3b484]/60'" />
            <div class="absolute top-1 right-1  w-2 h-2 border-t border-r pointer-events-none transition-colors" :class="isEmpty ? 'border-[#d3b484]/15' : isActive ? 'border-[#d3b484]/70' : 'border-[#d3b484]/40 group-hover:border-[#d3b484]/60'" />
            <div class="absolute bottom-1 left-1  w-2 h-2 border-b border-l pointer-events-none transition-colors" :class="isEmpty ? 'border-[#d3b484]/15' : isActive ? 'border-[#d3b484]/70' : 'border-[#d3b484]/40 group-hover:border-[#d3b484]/60'" />
            <div class="absolute bottom-1 right-1 w-2 h-2 border-b border-r pointer-events-none transition-colors" :class="isEmpty ? 'border-[#d3b484]/15' : isActive ? 'border-[#d3b484]/70' : 'border-[#d3b484]/40 group-hover:border-[#d3b484]/60'" />
            <!-- Kardus SVG -->
            <div class="p-3">
                <svg viewBox="0 0 220 160" class="w-48 h-auto" xmlns="http://www.w3.org/2000/svg">
                    <!-- Body — lebih gelap saat habis -->
                    <rect x="10" y="60" width="200" height="90" rx="3" :fill="isEmpty ? '#6b4a22' : '#c8843a'"/>
                    <rect x="10" y="60" width="70"  height="90" :fill="isEmpty ? '#5a3c1a' : '#b5722e'" opacity="0.6"/>
                    <rect x="90" y="60" width="70"  height="90" :fill="isEmpty ? '#7a5828' : '#d49040'" opacity="0.5"/>
                    <rect x="10" y="100" width="200" height="50" fill="#a06020" opacity="0.3"/>
                    <!-- Flaps -->
                    <path d="M10,60 L10,30 L75,20 L75,60 Z"    :fill="isEmpty ? '#5a3c1a' : '#b87030'"/>
                    <path d="M210,60 L210,30 L145,20 L145,60 Z" :fill="isEmpty ? '#5a3c1a' : '#b87030'"/>
                    <path d="M75,60 L75,15 L110,10 L110,60 Z"   :fill="isEmpty ? '#6b4a22' : '#c88035'" :stroke="isEmpty ? '#4a3010' : '#a06828'" stroke-width="0.5"/>
                    <path d="M145,60 L145,15 L110,10 L110,60 Z"  :fill="isEmpty ? '#7a5428' : '#d09040'" :stroke="isEmpty ? '#4a3010' : '#a06828'" stroke-width="0.5"/>
                    <!-- Label sticker -->
                    <rect x="168" y="113" width="30" height="22" rx="2" :fill="isEmpty ? '#9a9080' : '#d4c8a0'" :stroke="isEmpty ? '#7a7060' : '#b0a070'" stroke-width="0.5"/>
                    <line x1="172" y1="120" x2="194" y2="120" :stroke="isEmpty ? '#666' : '#888'" stroke-width="0.8"/>
                    <line x1="172" y1="125" x2="194" y2="125" :stroke="isEmpty ? '#666' : '#888'" stroke-width="0.8"/>
                    <line x1="172" y1="130" x2="188" y2="130" :stroke="isEmpty ? '#666' : '#888'" stroke-width="0.8"/>
                    <!-- Tape -->
                    <rect x="90" y="55" width="40" height="12" rx="1" fill="rgba(255,255,200,0.4)" stroke="rgba(200,180,0,0.25)" stroke-width="0.5"/>
                    <!-- Active ring -->
                    <rect v-if="isActive && !isEmpty" x="10" y="60" width="200" height="90" rx="3" fill="none" stroke="#d3b484" stroke-width="1.5" opacity="0.4"/>
                    <!-- Tanda silang saat habis -->
                    <g v-if="isEmpty" opacity="0.4">
                        <line x1="85" y1="75" x2="135" y2="140" stroke="#d3b484" stroke-width="1.5"/>
                        <line x1="135" y1="75" x2="85" y2="140" stroke="#d3b484" stroke-width="1.5"/>
                    </g>
                </svg>
            </div>
        </div>
        <!-- Label + counter -->
        <div class="flex flex-col items-center gap-1">
            <div class="flex items-center gap-2">
                <span :class="isEmpty ? 'text-[#810000]/40' : 'text-[#810000]'" class="text-[10px]">✦</span>
                <span class="text-[10px] tracking-[0.35em] uppercase font-snpro transition-colors duration-200" :class="isEmpty ? 'text-[#d3b484]/25' : isActive ? 'text-[#d3b484]/80' : 'text-[#d3b484]/50'">
                    {{ box.label }}
                </span>
            </div>
            <!-- Counter terungkap / total -->
            <span class="text-[8px] font-snpro tracking-wider" :class="isEmpty ? 'text-[#d3b484]/20' : 'text-[#d3b484]/30'">
                {{ revealedCount }}/{{ total }} terungkap
            </span>
            <!-- Pesan habis -->
            <Transition
                enter-active-class="transition-all duration-300"
                enter-from-class="opacity-0 translate-y-1"
                enter-to-class="opacity-100 translate-y-0"
            >
                <span v-if="isEmpty" class="text-[8px] font-snpro tracking-wider text-[#810000]/60 italic">
                    Semua arsip sudah dikeluarkan
                </span>
            </Transition>
        </div>
    </div>
</template>