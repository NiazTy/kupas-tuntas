<script setup lang="ts">

import type { ScatterPhoto } from "~/data/types/cards"

const props = defineProps<{
    photo: ScatterPhoto
    delay: number
    isTouchMode: boolean
    isSelected: boolean
}>()

const emit = defineEmits<{
    dragstart: [event: DragEvent]
    dragend: [event: DragEvent]
    mousedown: []
    tapSelect: [photo: ScatterPhoto]
    zoomRequest: [photo: ScatterPhoto]
}>()

let pressTimer: ReturnType<typeof setTimeout> | null = null

function onTouchStart() {
    pressTimer = setTimeout(() => {
        emit("zoomRequest", props.photo)
    }, 500)
}

function onTouchEnd(e: TouchEvent) {
    if (pressTimer) {
        clearTimeout(pressTimer)
        pressTimer = null
    }
}

function onTouchMove() {
    if (pressTimer) {
        clearTimeout(pressTimer)
        pressTimer = null
    }
}

function handleTap() {
    if (props.isTouchMode) {
        emit("tapSelect", props.photo)
    }
}
</script>

<template>
    <div
        class="scatter-item absolute select-none group"
        :style="{
            left: photo.x + 'px',
            top: photo.y + 'px',
            transform: `rotate(${photo.rot}deg)`,
            zIndex: photo.z,
            animationDelay: delay + 's',
        }"
        :draggable="!isTouchMode"
        @dragstart="!isTouchMode && $emit('dragstart', $event)"
        @dragend="!isTouchMode && $emit('dragend', $event)"
        @mousedown="!isTouchMode && $emit('mousedown')"
        @click="handleTap"
        @touchstart.passive="onTouchStart"
        @touchend.passive="onTouchEnd"
        @touchmove.passive="onTouchMove"
    >
        <!-- Polaroid frame -->
        <div
            class="relative border-2 bg-[#0d0a06] p-1 pb-6 transition-colors duration-150 shadow-[3px_4px_12px_rgba(0,0,0,0.6)]"
            :class="[ isTouchMode ? isSelected ? 'border-[#d3b484]/80 ring-2 ring-[#d3b484]/30 cursor-pointer' : 'border-[#d3b484]/25 hover:border-[#d3b484]/50 cursor-pointer' : 'border-[#d3b484]/25 hover:border-[#d3b484]/60 cursor-grab active:cursor-grabbing']"
        >
            <!-- Ornamen sudut -->
            <div class="absolute top-0.5 left-0.5 w-1.5 h-1.5 border-t border-l border-[#d3b484]/50 z-10 pointer-events-none" />
            <div class="absolute top-0.5 right-0.5 w-1.5 h-1.5 border-t border-r border-[#d3b484]/50 z-10 pointer-events-none" />
            <div class="absolute bottom-0.5 left-0.5 w-1.5 h-1.5 border-b border-l border-[#d3b484]/50 z-10 pointer-events-none" />
            <div class="absolute bottom-0.5 right-0.5 w-1.5 h-1.5 border-b border-r border-[#d3b484]/50 z-10 pointer-events-none" />
            <!-- Gambar -->
            <img
                :src="photo.image"
                :alt="photo.category"
                class="block w-16 h-20 object-cover object-top"
                draggable="false"
            />
            <!-- Kode foto -->
            <p class="absolute bottom-1 left-0 right-0 text-center text-[7px] text-[#d3b484]/35 font-snpro leading-none">
                {{ photo.code }}
            </p>
            <!-- Hover overlay — desktop: drag hint + zoom btn | touch: tap hint -->
            <div
                class="absolute inset-0 flex flex-col items-center justify-between py-1.5 transition-all duration-200 pointer-events-none group-hover:pointer-events-auto"
                :class="isTouchMode ? isSelected ? 'bg-[#d3b484]/10' : 'bg-[#0d0a06]/0' : 'bg-[#0d0a06]/0 group-hover:bg-[#0d0a06]/55'"
            >
                <!-- Zoom button — desktop hover -->
                <button
                    v-if="!isTouchMode"
                    @click.stop="$emit('zoomRequest', photo)"
                    @mousedown.stop
                    class="opacity-0 group-hover:opacity-100 w-5 h-5 flex items-center justify-center border border-[#d3b484]/40 bg-[#1a1208]/80 text-[#d3b484]/70 text-[8px] hover:border-[#d3b484]/80 hover:text-[#d3b484] transition-all duration-150 z-20"
                    title="Perbesar"
                >
                    ⤢
                </button>
                <div v-else />
                <!-- Bottom hint -->
                <span class="text-[7px] font-snpro transition-all duration-200 select-none" :class="isTouchMode ? isSelected ? 'text-[#d3b484]/80 opacity-100' : 'text-[#d3b484]/40 opacity-0 group-hover:opacity-100' : 'text-[#d3b484]/60 opacity-0 group-hover:opacity-100'">
                    {{ isTouchMode ? (isSelected ? '✦ dipilih' : 'ketuk') : 'drag' }}
                </span>
            </div>
            <!-- Badge selected di touch mode -->
            <div v-if="isTouchMode && isSelected" class="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#d3b484] flex items-center justify-center z-20">
                <span class="text-[#0d0a06] text-[8px] font-bold">✓</span>
            </div>
        </div>
    </div>
</template>
<style scoped>
@keyframes flyIn {
    from { 
        opacity: 0; 
    }
    to { 
        opacity: 1; 
    }
}

.scatter-item {
    animation: flyIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) backwards;
}
</style>