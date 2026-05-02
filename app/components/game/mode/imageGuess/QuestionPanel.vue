<script setup lang="ts">
import type { ImageGuessCards } from '~/data/types/cards'

const props = defineProps<{
    card: ImageGuessCards
    allCards: ImageGuessCards[]
}>()

const emit = defineEmits(["answer", "skip"])

const selectedAnswer = ref<string | null>(null)
const submitted = ref(false)
const isCorrect = ref(false)
const flipping = ref(false)

function getPhoto(card: ImageGuessCards) {
    return card.images?.find(i => i.id === 'photo')?.img ?? card.images?.[0]?.img ?? ''
}

const options = computed(() => {
    const wrong3 = props.allCards
        .filter(c => c.name !== props.card.name)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map(c => ({ card: c, isCorrect: false }))

    return [
        { card: props.card, isCorrect: true },
        ...wrong3
    ].sort(() => Math.random() - 0.5)
})

function selectAnswer(card: ImageGuessCards, correct: boolean) {
    if (submitted.value) return
    submitted.value = true
    selectedAnswer.value = card.name
    isCorrect.value = correct

    setTimeout(() => {
        flipping.value = true
        setTimeout(() => {
        emit("answer", { answer: card.name, isCorrect: correct })
        submitted.value = false
        selectedAnswer.value = null
        flipping.value = false
        }, 400)
    }, 1200)
}
</script>

<template>
    <div class="w-full max-w-lg perspective-1000" :class="{ flipping }">
        <div class="panel-inner relative w-full transform-style-3d transition-transform duration-400">
            <!-- Front -->
            <div class="panel-front relative border border-[#d3b484]/30 bg-[#1a1208]/80 p-6 backface-hidden">
                <!-- Ornamen sudut -->
                <div class="absolute top-2 left-2 w-4 h-4 border-t border-l border-[#d3b484]/30 pointer-events-none" />
                <div class="absolute top-2 right-2 w-4 h-4 border-t border-r border-[#d3b484]/30 pointer-events-none" />
                <div class="absolute bottom-2 left-2 w-4 h-4 border-b border-l border-[#d3b484]/30 pointer-events-none" />
                <div class="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-[#d3b484]/30 pointer-events-none" />
                <!-- Label soal -->
                <div class="flex items-center gap-2 mb-3">
                    <div class="h-px w-6 bg-[#810000]/60" />
                    <span class="text-[#d3b484]/50 text-[9px] tracking-[0.35em] uppercase font-snpro">Siapakah beliau?</span>
                </div>
                <!-- Deskripsi sebagai soal -->
                <p class="text-[#d3b484]/80 text-sm font-snpro leading-relaxed mb-5">
                    {{ card.description }}
                </p>
                <!-- Garis dekoratif -->
                <div class="flex items-center gap-3 mb-5">
                    <div class="h-px flex-1 bg-[#d3b484]/10" />
                    <span class="text-[#d3b484]/20 text-[10px]">✦</span>
                    <div class="h-px flex-1 bg-[#d3b484]/10" />
                </div>
                <!-- 4 Kartu foto pilihan -->
                <div class="grid grid-cols-4 gap-2">
                    <button
                        v-for="opt in options"
                        :key="opt.card.name"
                        @click="selectAnswer(opt.card, opt.isCorrect)"
                        :disabled="submitted"
                        class="relative flex flex-col items-center gap-1 group transition-all duration-200"
                        :class="submitted ? 'cursor-not-allowed' : 'cursor-pointer'"
                    >
                        <!-- Frame kartu foto -->
                        <div
                            class="relative w-full aspect-3/4 border-2 overflow-hidden transition-all duration-200"
                            :class="[
                                !submitted
                                ? 'border-[#d3b484]/25 group-hover:border-[#d3b484]/60 group-hover:-translate-y-1'
                                : selectedAnswer === opt.card.name
                                    ? opt.isCorrect
                                    ? 'border-green-600/70 ring-2 ring-green-600/40'
                                    : 'border-[#810000]/70 ring-2 ring-[#810000]/40'
                                    : opt.isCorrect
                                    ? 'border-green-600/40'
                                    : 'border-[#d3b484]/10 opacity-40'
                            ]"
                        >
                            <!-- Ornamen sudut -->
                            <div class="absolute top-1 left-1 w-2 h-2 border-t border-l border-[#d3b484]/40 z-10 pointer-events-none" />
                            <div class="absolute top-1 right-1 w-2 h-2 border-t border-r border-[#d3b484]/40 z-10 pointer-events-none" />
                            <div class="absolute bottom-1 left-1 w-2 h-2 border-b border-l border-[#d3b484]/40 z-10 pointer-events-none" />
                            <div class="absolute bottom-1 right-1 w-2 h-2 border-b border-r border-[#d3b484]/40 z-10 pointer-events-none" />
                            <img
                                :src="getPhoto(opt.card)"
                                :alt="opt.card.name"
                                class="w-full h-full object-cover object-top"
                            />
                            <!-- Overlay feedback -->
                            <Transition
                                enter-active-class="transition-all duration-200"
                                enter-from-class="opacity-0"
                                enter-to-class="opacity-100"
                            >
                                <div
                                    v-if="submitted && selectedAnswer === opt.card.name"
                                    class="absolute inset-0 flex items-center justify-center"
                                    :class="opt.isCorrect ? 'bg-green-900/50' : 'bg-[#810000]/50'"
                                >
                                    <span class="text-2xl">{{ opt.isCorrect ? '✦' : '✕' }}</span>
                                </div>
                            </Transition>
                        </div>
                        <!-- Label nama (muncul setelah submit) -->
                        <Transition
                            enter-active-class="transition-all duration-200"
                            enter-from-class="opacity-0 translate-y-1"
                            enter-to-class="opacity-100 translate-y-0"
                        >
                            <span
                                v-if="submitted && opt.isCorrect"
                                class="text-[9px] font-snpro text-center leading-tight"
                                :class="opt.isCorrect ? 'text-green-400/80' : 'text-[#d3b484]/40'"
                            >
                                {{ opt.card.name }}
                            </span>
                        </Transition>
                    </button>
                </div>
                <!-- Garis dekoratif bawah -->
                <div class="flex items-center gap-3 mt-5">
                    <div class="h-px flex-1 bg-[#d3b484]/10" />
                    <span class="text-[#d3b484]/20 text-[10px]">✦</span>
                    <div class="h-px flex-1 bg-[#d3b484]/10" />
                </div>
                <!-- Tombol lewati -->
                <div class="mt-3">
                    <button
                        @click="emit('skip')"
                        :disabled="submitted"
                        class="relative px-4 py-2.5 hover:cursor-pointer border text-xs font-snpro tracking-wider transition-all"
                        :class="!submitted
                        ? 'border-[#d3b484]/20 text-[#d3b484]/40 hover:border-[#d3b484]/50 hover:text-[#d3b484]/60'
                        : 'border-[#d3b484]/10 text-[#d3b484]/20 cursor-not-allowed'"
                    >
                        Lewati
                    </button>
                </div>
            </div>
            <!-- Back (flip) -->
            <div class="panel-back absolute inset-0 border border-[#d3b484]/20 bg-[#1a1208]/80 flex items-center justify-center backface-hidden rotate-y-180">
                <div class="flex items-center gap-2">
                    <span class="text-[#d3b484]/30 text-xs animate-pulse">✦</span>
                    <span class="text-[#d3b484]/40 text-xs font-snpro tracking-widest uppercase">Memuat soal...</span>
                    <span class="text-[#d3b484]/30 text-xs animate-pulse">✦</span>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.perspective-1000 { 
    perspective: 1000px; 
}
.transform-style-3d { 
    transform-style: preserve-3d; 
}
.backface-hidden { 
    backface-visibility: hidden; 
}
.rotate-y-180 { 
    transform: rotateY(180deg); 
}
.flipping .panel-inner { 
    transform: rotateY(180deg); 
}
.duration-400 { 
    transition-duration: 400ms; 
    }
</style>