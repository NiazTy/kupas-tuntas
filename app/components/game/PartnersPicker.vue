<script setup lang="ts">
import { Partners } from '~/data/partners';

import type { Partner } from '~/data/types/partners';

const props = defineProps({
    modelValue: Object as () => Partner | null
})

const emit = defineEmits(["update:modelValue"])

function selectPartners(partner: Partner) {
    emit("update:modelValue", partner)
}
</script>

<template>
    <div class="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <div v-for="partner in Partners" :key="partner.name" @click="selectPartners(partner)" class="cursor-pointer transition-all duration-200 group">
            <!-- Bingkai gambar -->
            <div class="relative">
                <!-- Shadow offset saat selected -->
                <div class="absolute inset-0 transition-all duration-200" :class="modelValue?.id === partner.id ? 'translate-x-1 translate-y-1 border border-[#810000]/50' : 'translate-x-0 translate-y-0 border border-transparent'" />
                <!-- Border utama -->
                <div class="relative p-2 border-2 transition-all duration-200" :class="modelValue?.id === partner.id ? 'border-[#810000] bg-[#1a0800]/40' : 'border-[#8b6914]/20 hover:border-[#8b6914]/60 bg-transparent'">
                    <!-- Ornamen sudut saat selected -->
                    <template v-if="modelValue?.id === partner.id">
                        <div class="absolute top-1 left-1 w-3 h-3 border-t border-l border-[#d3b484]/60" />
                        <div class="absolute top-1 right-1 w-3 h-3 border-t border-r border-[#d3b484]/60" />
                        <div class="absolute bottom-1 left-1 w-3 h-3 border-b border-l border-[#d3b484]/60" />
                        <div class="absolute bottom-1 right-1 w-3 h-3 border-b border-r border-[#d3b484]/60" />
                    </template>
                    <img :src="partner?.images.find(img => img.id === 'card')?.img ?? partner?.images[0]?.img" class="aspect-4/5 w-full object-contain" :class="modelValue?.id === partner.id ? 'opacity-100' : 'opacity-70 group-hover:opacity-90'" />
                    <!-- Tanda centang saat selected -->
                    <div v-if="modelValue?.id === partner.id" class="absolute top-1.5 right-1.5 w-4 h-4 bg-[#810000] flex items-center justify-center">
                        <span class="text-[#d3b484] text-[8px]">✦</span>
                    </div>
                </div>
            </div>
            <p class="text-center mt-2 text-xs font-snpro tracking-wide transition-colors" :class="modelValue?.id === partner.id ? 'text-[#3d2005] font-semibold' : 'text-[#5a3e0a]/60'">
                {{ partner.name }}
            </p>
        </div>
    </div>
</template>