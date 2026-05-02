<script setup lang="ts">
interface LightboxItem {
    image: string
    label?: string
}

const props = defineProps<{
    items: LightboxItem[]
    index: number
}>()

const emit = defineEmits<{
    "update:index": [value: number]
}>()

const isOpen = computed(() => props.index >= 0 && props.items.length > 0)
const current = computed(() => (props.index >= 0 && props.index < props.items.length) ? props.items[props.index] : null)
const hasPrev = computed(() => props.index > 0)
const hasNext = computed(() => props.index < props.items.length - 1)

// Zoom dari posisi thumbnail asli
const originRect = ref<DOMRect | null>(null)
const imageEl = ref<HTMLImageElement | null>(null)
const isReady = ref(false)

// State animasi
const phase = ref<"idle" | "enter" | "open" | "exit">("idle")

function open(rect?: DOMRect) {
    originRect.value = rect ?? null
    isReady.value = false
    phase.value = "enter"
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            phase.value = "open"
            isReady.value = true
        })
    })
}

function close() {
    phase.value = "exit"
    setTimeout(() => {
        phase.value = "idle"
        emit("update:index", -1)
    }, 280)
}

function prev() {
    if (hasPrev.value) {
        isReady.value = false
        setTimeout(() => {
            emit("update:index", props.index - 1)
            isReady.value = true
        }, 120)
    }
}

function next() {
    if (hasNext.value) {
        isReady.value = false
        setTimeout(() => {
            emit("update:index", props.index + 1)
            isReady.value = true
        }, 120)
    }
}

// Watch index change untuk trigger animasi buka
watch(() => props.index, (val, old) => {
    if (val >= 0 && (old < 0 || phase.value === "idle")) {
        open()
    } else if (val < 0 && old >= 0 && phase.value === "open") {
        close()
    }
})

// Keyboard
function onKey(e: KeyboardEvent) {
    if (!isOpen.value) return
    if (e.key === "Escape") close()
    if (e.key === "ArrowLeft") prev()
    if (e.key === "ArrowRight") next()
}

onMounted(() => window.addEventListener("keydown", onKey))
onUnmounted(() => window.removeEventListener("keydown", onKey))

// Computed transform untuk zoom-from-origin
const backdropStyle = computed(() => {
    if (phase.value === "enter" || phase.value === "exit") return { opacity: "0" }
    if (phase.value === "open") return { opacity: "1" }
    return { opacity: "0" }
})

const imageContainerStyle = computed(() => {
    const base = "transition-all duration-300 cubic-bezier(0.34,1.2,0.64,1)"
    if (phase.value === "open") return { transform: "scale(1) translateY(0px)", opacity: "1" }
    return { transform: "scale(0.88) translateY(16px)", opacity: "0" }
})
</script>

<template>
    <Teleport to="body">
        <Transition name="lb-fade">
            <div
                v-if="isOpen && phase !== 'idle'"
                class="fixed inset-0 z-9999 flex items-center justify-center"
                role="dialog"
                aria-modal="true"
                @click.self="close"
            >
                <!-- Backdrop -->
                <div class="absolute inset-0 bg-[#0d0a06]/95 backdrop-blur-md transition-opacity duration-300" :style="backdropStyle" @click="close" />
                <!-- Grain overlay -->
                <div class="absolute inset-0 opacity-30 pointer-events-none" style="background-image: url('data:image/svg+xml,%3Csvg viewBox=%220 0 256 256%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22 opacity=%221%22/%3E%3C/svg%3E'); background-size: 180px 180px;" />
                <!-- Ornamen sudut layar -->
                <div class="absolute top-6 left-6 w-8 h-8 border-t border-l border-[#d3b484]/20 pointer-events-none" />
                <div class="absolute top-6 right-6 w-8 h-8 border-t border-r border-[#d3b484]/20 pointer-events-none" />
                <div class="absolute bottom-6 left-6 w-8 h-8 border-b border-l border-[#d3b484]/20 pointer-events-none" />
                <div class="absolute bottom-6 right-6 w-8 h-8 border-b border-r border-[#d3b484]/20 pointer-events-none" />
                <!-- Konter -->
                <div class="absolute top-8 left-1/2 -translate-x-1/2 flex items-center gap-3 transition-all duration-300" :style="backdropStyle">
                    <div class="h-px w-8 bg-[#d3b484]/20" />
                    <span class="text-[#d3b484]/30 text-[9px] tracking-[0.4em] font-snpro uppercase">
                        {{ index + 1 }} / {{ items.length }}
                    </span>
                    <div class="h-px w-8 bg-[#d3b484]/20" />
                </div>
                <!-- Tombol tutup -->
                <button
                    @click="close"
                    class="absolute top-7 right-8 z-10 w-8 h-8 flex items-center justify-center border border-[#d3b484]/20 text-white text-xs hover:border-[#d3b484]/50 hover:text-[#d3b484]/80 transition-all duration-200"
                    style="font-family: monospace"
                    aria-label="Tutup"
                >
                    ✕
                </button>
                <!-- Gambar utama + frame -->
                <div class="relative z-10 flex flex-col items-center gap-4 max-w-3xl w-full mx-8 transition-all duration-320" style="will-change: transform, opacity" :style="imageContainerStyle">
                    <!-- Frame arsip -->
                    <div class="relative border border-[#d3b484]/30 bg-[#1a1208]/60 shadow-2xl shadow-black/60">
                        <!-- Ornamen sudut frame -->
                        <div class="absolute top-2 left-2 w-5 h-5 border-t border-l border-[#d3b484]/40 pointer-events-none z-10" />
                        <div class="absolute top-2 right-2 w-5 h-5 border-t border-r border-[#d3b484]/40 pointer-events-none z-10" />
                        <div class="absolute bottom-2 left-2 w-5 h-5 border-b border-l border-[#d3b484]/40 pointer-events-none z-10" />
                        <div class="absolute bottom-2 right-2 w-5 h-5 border-b border-r border-[#d3b484]/40 pointer-events-none z-10" />
                        <!-- Gambar -->
                        <Transition name="img-swap" mode="out-in">
                            <img
                                :key="current?.image"
                                ref="imageEl"
                                :src="current?.image"
                                :alt="current?.label ?? ''"
                                class="block max-h-[72vh] max-w-full w-auto object-contain"
                                style="min-height: 200px; min-width: 160px;"
                                draggable="false"
                            />
                        </Transition>
                        <!-- Strip bawah: label -->
                        <div v-if="current?.label" class="border-t border-[#d3b484]/15 px-6 py-3 flex items-center gap-3">
                            <span class="text-[#810000] text-xs">✦</span>
                            <span class="text-[#d3b484]/60 text-[10px] tracking-[0.35em] uppercase font-snpro">{{ current.label }}</span>
                        </div>
                        <!-- Strip bawah: dots navigasi -->
                        <div v-if="items.length > 1" class="border-t border-[#d3b484]/10 px-6 py-3 flex items-center justify-center gap-2">
                            <button v-for="(_, i) in items" :key="i" @click="emit('update:index', i)" class="w-1.5 h-1.5 rounded-full transition-all duration-200" :class="i === index ? 'bg-[#d3b484]/70 scale-125' : 'bg-[#d3b484]/20 hover:bg-[#d3b484]/40'" :aria-label="`Gambar ${i + 1}`" />
                        </div>
                    </div>
                    <!-- Hint keyboard -->
                    <div class="flex items-center gap-4 text-white text-[9px] font-snpro tracking-widest">
                        <span v-if="hasPrev">← sebelumnya</span>
                        <span v-if="hasPrev && hasNext">·</span>
                        <span v-if="hasNext">selanjutnya →</span>
                        <span v-if="!hasPrev && !hasNext">ESC untuk tutup</span>
                        <span v-if="(hasPrev || hasNext)">· ESC tutup</span>
                    </div>
                </div>
                <!-- Tombol navigasi kiri -->
                <button v-if="hasPrev" @click.stop="prev" class="absolute left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center border border-[#d3b484]/20 bg-[#1a1208]/60 text-[#d3b484]/40 hover:border-[#d3b484]/50 hover:text-[#d3b484]/80 hover:bg-[#1a1208]/90 transition-all duration-200" aria-label="Sebelumnya">←</button>
                <!-- Tombol navigasi kanan -->
                <button v-if="hasNext" @click.stop="next" class="absolute right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center border border-[#d3b484]/20 bg-[#1a1208]/60 text-[#d3b484]/40 hover:border-[#d3b484]/50 hover:text-[#d3b484]/80 hover:bg-[#1a1208]/90 transition-all duration-200" aria-label="Selanjutnya">→</button>
            </div>
        </Transition>
    </Teleport>
</template>

<style scoped>
/* Backdrop fade */
.lb-fade-enter-active,
.lb-fade-leave-active { 
    transition: opacity 0.25s ease; 
}
.lb-fade-enter-from,
.lb-fade-leave-to { 
    opacity: 0; 
}

/* Swap gambar saat navigasi */
.img-swap-enter-active { 
    transition: all 0.18s ease; 
}
.img-swap-leave-active { 
    transition: all 0.12s ease; 
}
.img-swap-enter-from { 
    opacity: 0; 
    transform: scale(0.97) translateX(8px); 
}
.img-swap-leave-to   { 
    opacity: 0; 
    transform: scale(0.97) translateX(-8px); 
}
</style>