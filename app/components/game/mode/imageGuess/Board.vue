<!-- components/game/mode/imageGuess/Board.vue -->

<script setup lang="ts">
import type { ImageGuessCards } from "~/data/types/cards"

const props = defineProps<{
  cards: ImageGuessCards[]
}>()

const localCards = ref<ImageGuessCards[]>([...props.cards])
const currentCard = ref<ImageGuessCards | null>(null)
const score = ref(0)
const correct = ref(0)
const wrong = ref(0)
const isAnswering = ref(false)

// "default" saat normal, ganti sesuai kejadian, lalu kembali ke default
type Expression = "default" | "smile" | "correct" | "wrong" | "appreciated"
const partnerExpression = ref<Expression>("default")

function setExpression(expr: Expression, resetAfterMs = 3000) {
  partnerExpression.value = expr
  if (resetAfterMs > 0) {
    setTimeout(() => { partnerExpression.value = "default" }, resetAfterMs)
  }
}

const resultToast = ref({
  show: false,
  isCorrect: false,
  correctName: "",
  explanation: "",
})

function showResultToast(isCorrect: boolean, card: ImageGuessCards) {
  loop.stop()
  resultToast.value = {
    show: true, isCorrect,
    correctName: card.name,
    explanation: card.explanation,
  }
}

function hideResultToast() {
    loop.start()
    resultToast.value.show = false
}

const showIntro = ref(true)
const isSpeaking = ref(false)
const partnerSpeech = ref("")

const router = useRouter()
const loop = useGameLoop()
const events = useGameEvents()
const gameStore = useGameStore()

const partner = computed(() => gameStore.partners)
const playerName = computed(() => gameStore.playerName)

let typewriterTimer: ReturnType<typeof setTimeout> | null = null

function typewrite(text: string, onDone?: () => void) {
    if (typewriterTimer) clearTimeout(typewriterTimer)
    partnerSpeech.value = ""
    isSpeaking.value = true
    let i = 0
    function tick() {
        if (i < text.length) {
            partnerSpeech.value += text[i++]
            typewriterTimer = setTimeout(tick, 35)
        } else {
            isSpeaking.value = false
            onDone?.()
        }
    } tick()
}

function speak(text: string) { typewrite(text) }

function skipIntro() {
    if (typewriterTimer) clearTimeout(typewriterTimer)
    isSpeaking.value = false
    showIntro.value = false
    startActualGame()
}

function startActualGame() {
    drawCard()
    loop.start()
}

const POINTS = 10

const onTimeUp = () => {
    if (localCards.value.length === 0) return
    gameStore.addAnswer(currentCard.value, null, false)
    wrong.value++
    score.value = Math.max(0, score.value - 5)
    setExpression("wrong")
    speak("Sayang sekali, waktumu udah habis! Semangat untuk soal berikutnya ya!")
    if (currentCard.value) showResultToast(false, currentCard.value)
    localCards.value.shift()
    drawCard()
}

function drawCard() {
    if (localCards.value.length === 0) {
        loop.stop()
        finishGame()
        return
    }
    currentCard.value = localCards.value[0] ?? null
    loop.resetTimer()
}

function checkAnswer({ answer, isCorrect }: { answer: string; isCorrect: boolean }) {
    if (isAnswering.value) return
    isAnswering.value = true

    gameStore.addAnswer(currentCard.value, answer, isCorrect)

    if (isCorrect) {
        score.value += POINTS
        correct.value++
        setExpression("correct")
        speak(`Keren banget kamu ${playerName.value}! Jawabanmu benar. Poin kamu bertambah +${POINTS}! Yuk, lanjut ke soal berikutnya!`)
    } else {
        wrong.value++
        setExpression("wrong")
        speak(`Aduhh sayang sekali ${playerName.value}, jawabannya adalah ${currentCard.value?.name}. Semangat ya!`)
    }

    if (currentCard.value) showResultToast(isCorrect, currentCard.value)

    localCards.value.shift()
    drawCard()
    setTimeout(() => { isAnswering.value = false }, 1000)
}

function skipCard() {
    if (isAnswering.value) return
    gameStore.addAnswer(currentCard.value!, null, false)
    wrong.value++
    setExpression("wrong", 2000)
    speak(`Soal ini dilewati ya, jawabannya adalah ${currentCard.value?.name}. Semangat untuk soal berikutnya, ${playerName.value}!`)
    localCards.value.shift()
    drawCard()
}

function finishGame() {
    // Kalau skor bagus → appreciated, kalau tidak → smile
    setExpression(score.value >= correct.value * POINTS * 0.7 ? "appreciated" : "smile", 0)
    gameStore.setResult(score.value, correct.value, wrong.value)
    router.push("/game/result")
}

function endGame() {
    loop.stop()
    gameStore.setResult(score.value, correct.value, wrong.value)
    router.push("/game/result")
}

onMounted(() => {
    gameStore.resetGame()
    events.off(GAME_EVENTS.TIME_UP, onTimeUp)
    events.on(GAME_EVENTS.TIME_UP, onTimeUp)

    const name = partner.value?.name ?? "Diana"
    setExpression("smile", 0)

    typewrite(`Halo, kenalin aku ${name}! Baca deskripsinya dengan teliti, lalu pilih gambar yang tepat. Yuk, mulai ${playerName.value}!`, () => {
        setTimeout(() => {
        showIntro.value = false
        setExpression("default", 0)
        startActualGame()
        }, 1500)
    })
})

onUnmounted(() => {
    loop.stop()
    events.off(GAME_EVENTS.TIME_UP, onTimeUp)
})
</script>

<template>
    <div class="relative min-h-screen bg-[#0d0a06] flex flex-col items-center justify-center gap-10 px-6 py-16 overflow-hidden">
        <Ornament3 />
        <!-- Label pojok -->
        <div class="absolute top-8 right-16 flex items-center gap-3 z-10">
            <div class="h-px w-10 bg-[#d3b484]/30" />
            <span class="text-[#d3b484]/40 text-[10px] tracking-[0.4em] font-snpro uppercase">Image Guess</span>
        </div>
        <!-- Toast hasil jawaban -->
        <Transition
            enter-active-class="transition-all duration-300"
            enter-from-class="opacity-0 translate-y-4"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition-all duration-300"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 translate-y-4"
        >
            <div
                v-if="resultToast.show"
                class="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-4"
            >
                <div
                    class="relative border bg-[#1a1208]/95 backdrop-blur-sm px-5 py-4" :class="resultToast.isCorrect ? 'border-green-600/40' : 'border-[#810000]/40'"
                >
                    <div class="absolute top-1.5 left-1.5 w-3 h-3 border-t border-l pointer-events-none" :class="resultToast.isCorrect ? 'border-green-600/40' : 'border-[#810000]/40'" />
                    <div class="absolute top-1.5 right-1.5 w-3 h-3 border-t border-r pointer-events-none" :class="resultToast.isCorrect ? 'border-green-600/40' : 'border-[#810000]/40'" />
                    <div class="absolute bottom-1.5 left-1.5 w-3 h-3 border-b border-l pointer-events-none" :class="resultToast.isCorrect ? 'border-green-600/40' : 'border-[#810000]/40'" />
                    <div class="absolute bottom-1.5 right-1.5 w-3 h-3 border-b border-r pointer-events-none" :class="resultToast.isCorrect ? 'border-green-600/40' : 'border-[#810000]/40'" />
                    <div class="flex items-center justify-between mb-2">
                        <div class="flex items-center gap-2">
                            <span class="text-xs" :class="resultToast.isCorrect ? 'text-green-400' : 'text-[#810000]'">✦</span>
                            <span class="text-xs font-snpro tracking-wider" :class="resultToast.isCorrect ? 'text-green-400' : 'text-[#810000]/80'">
                                {{ resultToast.isCorrect ? 'Jawaban Benar!' : 'Jawaban Salah' }}
                            </span>
                        </div>
                        <button @click="hideResultToast" class="text-[#d3b484]/30 hover:cursor-pointer hover:text-[#d3b484]/60 transition-colors text-xs">✕</button>
                    </div>
                    <div class="h-px w-full bg-[#d3b484]/10 mb-3" />
                    <p class="text-[#d3b484]/40 text-[9px] tracking-[0.3em] uppercase font-snpro mb-1">Pahlawan</p>
                    <p class="text-[#d3b484] text-sm font-snpro mb-3">{{ resultToast.correctName }}</p>
                    <p class="text-[#d3b484]/40 text-[9px] tracking-[0.3em] uppercase font-snpro mb-1">Penjelasan</p>
                    <p class="text-[#d3b484]/60 text-xs font-snpro leading-relaxed">{{ resultToast.explanation }}</p>
                </div>
            </div>
        </Transition>
        <Transition
            enter-active-class="transition-all duration-400"
            enter-from-class="opacity-0"
            enter-to-class="opacity-100"
            leave-active-class="transition-all duration-400"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
        >
            <div
                v-if="showIntro"
                class="fixed inset-0 z-40 bg-[#0d0a06]/90 backdrop-blur-sm flex items-end justify-center pb-16 lg:items-center lg:pb-0"
                @click="skipIntro"
            >
                <div class="flex flex-col lg:flex-row items-center lg:items-end gap-6 lg:gap-0 max-w-2xl w-full px-6">
                    <img
                        v-if="partner?.images"
                        :src="partner?.images[1]?.img"
                        :alt="partner?.name"
                        class="object-contain object-bottom drop-shadow-2xl pointer-events-none select-none h-64 lg:h-96"
                    />
                    <div v-if="partnerSpeech" class="relative max-w-sm w-full lg:mb-20">
                        <div class="absolute inset-0 translate-x-2 translate-y-2 border border-[#d3b484]/15" />
                        <div class="relative border border-[#d3b484]/40 bg-[#1a1208]/95 px-6 py-5">
                            <div class="absolute top-2 left-2 w-4 h-4 border-t border-l border-[#d3b484]/40" />
                            <div class="absolute top-2 right-2 w-4 h-4 border-t border-r border-[#d3b484]/40" />
                            <div class="absolute bottom-2 left-2 w-4 h-4 border-b border-l border-[#d3b484]/40" />
                            <div class="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-[#d3b484]/40" />
                            <div class="flex items-center gap-2 mb-2">
                                <span class="text-[#810000] text-xs">✦</span>
                                <span class="text-[#d3b484]/60 text-[10px] tracking-[0.3em] uppercase font-snpro">{{ partner?.name }}</span>
                            </div>
                            <div class="h-px w-full bg-[#d3b484]/10 mb-3" />
                            <p class="text-[#d3b484]/90 text-sm font-snpro leading-relaxed">
                                {{ partnerSpeech }}<span v-if="isSpeaking" class="animate-pulse">▌</span>
                            </p>
                            <p class="text-[#d3b484]/30 text-[9px] font-snpro tracking-widest uppercase mt-4 text-right">
                                Ketuk untuk lewati →
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Transition>
        <Partner
            :partner="partner"
            :partner-speech="partnerSpeech"
            :is-speaking="isSpeaking"
            :expression="partnerExpression"
        />
        <div class="relative z-10 flex flex-col items-center gap-10 w-full max-w-lg">
            <GameScoreBoard :score="score" :timer="loop.timer.value" />
            <GameModeImageGuessQuestionPanel
                v-if="currentCard"
                :card="currentCard"
                :all-cards="props.cards"
                :key="currentCard.id"
                @answer="checkAnswer"
                @skip="skipCard"
            />
            <div class="flex justify-center">
                <button
                class="group relative hover:cursor-pointer flex items-center gap-2 px-5 py-2 border border-[#810000]/40 bg-[#810000]/10
                        text-[#d3b484]/50 text-[10px] tracking-[0.3em] font-snpro uppercase
                        hover:border-[#810000]/70 hover:bg-[#810000]/20 hover:text-[#d3b484]/80
                        transition-all duration-300"
                @click="endGame"
                >
                    <div class="absolute top-1 left-1 w-2 h-2 border-t border-l border-[#810000]/40 group-hover:border-[#810000]/70 transition-colors" />
                    <div class="absolute top-1 right-1 w-2 h-2 border-t border-r border-[#810000]/40 group-hover:border-[#810000]/70 transition-colors" />
                    <div class="absolute bottom-1 left-1 w-2 h-2 border-b border-l border-[#810000]/40 group-hover:border-[#810000]/70 transition-colors" />
                    <div class="absolute bottom-1 right-1 w-2 h-2 border-b border-r border-[#810000]/40 group-hover:border-[#810000]/70 transition-colors" />
                    <span class="text-[#810000]/60 group-hover:text-[#810000]/90 transition-colors">✦</span>
                    Akhiri Permainan
                </button>
            </div>
        </div>
    </div>
</template>