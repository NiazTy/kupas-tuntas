<!-- GamesPngQuestionPanel -->
<script setup lang="ts">
interface Card {
    clue: string
    answer: string
    difficulty?: 'easy' | 'medium' | 'hard'
}

const props = defineProps<{
    card: Card
    score: number
}>()

// Poin & penalti dinamis berdasarkan difficulty
const cardPoints = computed(() => {
    if (props.card.difficulty === 'hard') return 20
    if (props.card.difficulty === 'medium') return 10
    return 5
})

const emit = defineEmits(["answer", "use-clue", "skip"])

const input = ref("")
const submitted = ref(false)
const isCorrect = ref(false)
const flipping = ref(false)
const clueRevealed = ref(false)

const clueCost = computed<number>(() => props.card.difficulty === 'hard' ? 15 : 5)

const canUseClue = computed(() => props.score >= clueCost.value && !clueRevealed.value)

function useClue() {
    if (!canUseClue.value) return
    clueRevealed.value = true
    emit("use-clue")
}

function normalize(str: string) {
    return str.trim().toLowerCase()
}

function submit() {
    if (submitted.value || !input.value.trim()) return
    submitted.value = true
    isCorrect.value = normalize(input.value) === normalize(props.card.answer)

    setTimeout(() => {
        flipping.value = true
        setTimeout(() => {
            emit("answer", input.value.trim())
            input.value = ""
            submitted.value = false
            flipping.value = false
            clueRevealed.value = false
        }, 400)
    }, 600)
}

function onKeydown(e: KeyboardEvent) {
    if (e.key === "Enter") submit()
}
</script>

<template>
    <div class="w-full max-w-lg perspective-1000" :class="{ 'flipping': flipping }">
        <div class="panel-inner relative w-full transform-style-3d transition-transform duration-400">
            <!-- Front -->
            <div class="panel-front relative border border-[#d3b484]/30 bg-[#1a1208]/80 p-6 backface-hidden">
                <!-- Ornamen sudut -->
                <div class="absolute top-2 left-2 w-4 h-4 border-t border-l border-[#d3b484]/30 pointer-events-none" />
                <div class="absolute top-2 right-2 w-4 h-4 border-t border-r border-[#d3b484]/30 pointer-events-none" />
                <div class="absolute bottom-2 left-2 w-4 h-4 border-b border-l border-[#d3b484]/30 pointer-events-none" />
                <div class="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-[#d3b484]/30 pointer-events-none" />
                <!-- Clue box -->
                <Transition
                    enter-active-class="transition-all duration-300 ease-out"
                    enter-from-class="opacity-0 -translate-y-2"
                    enter-to-class="opacity-100 translate-y-0"
                >
                    <div v-if="clueRevealed" class="flex items-start gap-3 border border-[#d3b484]/25 bg-[#2a1a08]/60 p-3 mb-4">
                        <div class="absolute top-1.5 left-1.5 w-3 h-3 border-t border-l border-[#d3b484]/30" />
                        <span class="text-[#d3b484]/60 text-xs mt-0.5">✦</span>
                        <p class="text-xs text-[#d3b484]/75 font-snpro leading-relaxed">{{ card.clue }}</p>
                    </div>
                </Transition>
                <!-- Input area -->
                <div class="flex flex-col gap-3">
                    <!-- Label -->
                    <div class="flex items-center gap-2">
                        <div class="h-px w-6 bg-[#810000]/60" />
                        <span class="text-[#d3b484]/50 text-[9px] tracking-[0.35em] uppercase font-snpro">Jawaban Kamu</span>
                    </div>
                    <!-- Input -->
                    <input
                        v-model="input" :disabled="submitted"
                        type="text"
                        placeholder="Tulis jawabanmu di sini..."
                        @keydown="onKeydown"
                        class="w-full bg-transparent border-b-2 pb-2 text-sm font-snpro placeholder-[#d3b484]/25 focus:outline-none transition-colors"
                        :class="[ submitted && isCorrect  ? 'border-green-600/70 text-green-400' : submitted && !isCorrect ? 'border-[#810000] text-[#d3b484]/60' : 'border-[#d3b484]/30 text-[#d3b484] focus:border-[#d3b484]/70' ]"
                    />
                    <!-- Feedback -->
                    <Transition
                        enter-active-class="transition-all duration-200"
                        enter-from-class="opacity-0 translate-y-1"
                        enter-to-class="opacity-100 translate-y-0"
                    >
                        <div v-if="submitted">
                            <div v-if="isCorrect" class="flex items-center gap-2">
                                <span class="text-green-400 text-xs">✦</span>
                                <p class="text-green-400 text-xs font-snpro tracking-wider">Jawaban benar!</p>
                            </div>
                            <div v-else class="flex items-center gap-2">
                                <span class="text-[#810000] text-xs">✦</span>
                                <p class="text-[#d3b484]/60 text-xs font-snpro">
                                    Jawaban: <span class="text-[#d3b484]">{{ card.answer }}</span>
                                </p>
                            </div>
                        </div>
                    </Transition>
                    <!-- Garis dekoratif -->
                    <div class="flex items-center gap-3">
                        <div class="h-px flex-1 bg-[#d3b484]/10" />
                        <span class="text-[#d3b484]/20 text-[10px]">✦</span>
                        <div class="h-px flex-1 bg-[#d3b484]/10" />
                    </div>
                    <!-- Tombol baris -->
                    <div class="flex gap-2">
                        <!-- Clue -->
                        <button
                            @click="useClue"
                            :disabled="!canUseClue || submitted"
                            :title="clueRevealed ? 'Clue sudah dipakai' : score < clueCost ? 'Poin tidak cukup' : `Gunakan clue (-${clueCost} poin)`"
                            class="relative flex items-center gap-2 px-4 py-2.5 border text-xs font-snpro tracking-wider transition-all"
                            :class="canUseClue && !submitted ? 'border-[#d3b484]/40 hover:cursor-pointer text-[#d3b484]/70 hover:border-[#d3b484]/70 hover:bg-[#d3b484]/5' : 'border-[#d3b484]/15 text-[#d3b484]/25 cursor-not-allowed'"
                        >
                            <span class="text-[10px]">💡</span>
                            Clue
                            <span class="text-[9px] px-1.5 py-0.5 border":class="canUseClue && !submitted ? 'border-[#d3b484]/30 text-[#d3b484]/50' : 'border-[#d3b484]/10 text-[#d3b484]/20'">
                                -{{ clueCost }}
                            </span>
                        </button>
                        <!-- Lewati -->
                        <button
                            @click="emit('skip')"
                            :disabled="submitted"
                            class="relative px-4 py-2.5 border text-xs font-snpro tracking-wider transition-all"
                            :class="!submitted ? 'border-[#d3b484]/20 text-[#d3b484]/40 hover:cursor-pointer hover:border-[#d3b484]/50 hover:text-[#d3b484]/60' : 'border-[#d3b484]/10 text-[#d3b484]/20 cursor-not-allowed'"
                        >
                            Lewati
                        </button>
                        <!-- Jawab -->
                        <button
                            @click="submit"
                            :disabled="submitted || !input.trim()"
                            class="relative flex-1 py-2.5 text-xs font-snpro tracking-widest uppercase transition-all group"
                            :class="!submitted && input.trim() ? 'bg-[#d3b484] text-[#0d0a06] hover:cursor-pointer hover:bg-[#c4a070]' : 'bg-[#d3b484]/20 text-[#d3b484]/30 cursor-not-allowed'"
                        >
                            <span class="absolute inset-0 ring-1 ring-inset ring-[#d3b484]/20 group-hover:ring-[#d3b484]/50 transition-all" />
                            Jawab
                        </button>
                    </div>
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