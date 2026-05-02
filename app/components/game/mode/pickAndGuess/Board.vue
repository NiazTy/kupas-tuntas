<!-- GamesPngBoardGameBoard.vue -->
<script setup lang="ts">
const props = defineProps({ cards: Array as PropType<{ image: string }[]> })

const localCards = ref<{ image: string }[]>([...(props.cards ?? [])])
const currentCard = ref<any>(null)
const score = ref(0)
const correct = ref(0)
const wrong = ref(0)
const isAnswering = ref(false)

// Dialog partner
const showIntro = ref(true)
const introSkipped = ref(false)
const partnerSpeech = ref("")
const isSpeaking = ref(false)
const speechQueue = ref<string[]>([])

const loop = useGameLoop()
const events = useGameEvents()
const gameStore = useGameStore()
const router = useRouter()

const partner = computed(() => gameStore.partners)

// "default" saat normal, ganti sesuai kejadian, lalu kembali ke default
type Expression = "default" | "smile" | "correct" | "wrong" | "appreciated"
const partnerExpression = ref<Expression>("default")

function setExpression(expr: Expression, resetAfterMs = 3000) {
  partnerExpression.value = expr
  if (resetAfterMs > 0) {
    setTimeout(() => { partnerExpression.value = "default" }, resetAfterMs)
  }
}

// Typewriter effect
let typewriterTimer: ReturnType<typeof setTimeout> | null = null
function typewrite(text: string, onDone?: () => void) {
    if (typewriterTimer) clearTimeout(typewriterTimer)
    partnerSpeech.value = ""
    isSpeaking.value = true
    let i = 0
    function tick() {
        if (i < text.length) {
            partnerSpeech.value += text[i]
            i++
            typewriterTimer = setTimeout(tick, 35)
        } else {
            isSpeaking.value = false
            onDone?.()
        }
    } tick()
}

const onTimeUp = () => {
    if (localCards.value.length === 0) return
    gameStore.addAnswer(currentCard.value, null, false)
    wrong.value++
    score.value = Math.max(0, score.value - 5)
    setExpression("wrong")
    speak("Waktu habis! -5 poin. Lanjut soal berikutnya.")
    localCards.value.shift()
    drawCard()
}

function speak(text: string) {
    typewrite(text)
}

function skipIntro() {
    if (typewriterTimer) clearTimeout(typewriterTimer)
    isSpeaking.value = false
    showIntro.value = false
    introSkipped.value = true
    startActualGame()
}

function startActualGame() {
    drawCard()
    loop.start()
}

function drawCard() {
    if (localCards.value.length === 0) {
        loop.stop()
        finishGame()
        return
    }
    currentCard.value = localCards.value[0]
    loop.resetTimer()
}

function getPoints(card: any) {
    if (card?.difficulty === 'hard') return 20
    if (card?.difficulty === 'medium') return 10
    return 5 // easy
}

function getCluePenalty(card: any) {
    return card?.difficulty === 'hard' ? 15 : 5
}

function checkAnswer(answer: string) {
    if (isAnswering.value) return
    isAnswering.value = true
    const normalize = (s: string) => s.trim().toLowerCase()
    const isCorrect = normalize(answer) === normalize(currentCard.value?.answer ?? "")
    gameStore.addAnswer(currentCard.value, answer, isCorrect)
    if (isCorrect) {
        const pts = getPoints(currentCard.value)
        score.value += pts
        correct.value++
        setExpression("correct")
        speak(`Betul! +${pts} poin! 🎉`)
    } else {
        wrong.value++
        setExpression("wrong")
        speak(`Jawabannya adalah ${currentCard.value?.answer}. Semangat ya!`)
    }
    localCards.value.shift()
    drawCard()
    setTimeout(() => { isAnswering.value = false }, 1000)
}

function skipCard() {
    if (isAnswering.value) return
    gameStore.addAnswer(currentCard.value!, null, false)
    wrong.value++
    setExpression("wrong")
    speak("Tidak apa-apa, lanjut soal berikutnya!")
    localCards.value.shift()
    drawCard()
}

function finishGame() {
    gameStore.setResult(score.value, correct.value, wrong.value)
    setExpression(score.value >= correct.value * getPoints(currentCard.value) * 0.7 ? "appreciated" : "smile", 0)
    router.push("/game/result")
}

function endGame() {
    loop.stop()
    gameStore.setResult(score.value, correct.value, wrong.value)
    router.push("/game/result")
}

function onUseClue() {
    const penalty = getCluePenalty(currentCard.value)
    score.value = Math.max(0, score.value - penalty)
    speak(`Ini petunjuknya: "${currentCard.value?.clue}" — semoga membantu! (-${penalty} poin)`)
}

onMounted(() => {
    gameStore.resetGame()

    events.off(GAME_EVENTS.TIME_UP, onTimeUp)
    events.on(GAME_EVENTS.TIME_UP, onTimeUp)

    const name = partner.value?.name ?? "Diana"
    setExpression("smile", 0)
    typewrite(`Halo, aku ${name}! Siap membantumu dalam kuis ini. Yuk, kita mulai! ✨`, () => {
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
            <span class="text-[#d3b484]/40 text-[10px] tracking-[0.4em] font-snpro uppercase">Kupas Tuntas</span>
        </div>
        <Partner
            :partner="partner"
            :partner-speech="partnerSpeech"
            :is-speaking="isSpeaking"
            :expression="partnerExpression"
        />
        <Transition
            enter-active-class="transition-all duration-400"
            enter-from-class="opacity-0"
            enter-to-class="opacity-100"
            leave-active-class="transition-all duration-400"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
        >
            <div v-if="showIntro"
                class="fixed inset-0 z-40 bg-[#0d0a06]/90 backdrop-blur-sm flex items-end justify-center pb-16 lg:items-center lg:pb-0"
                @click="skipIntro"
            >
                <div class="flex flex-col lg:flex-row items-center lg:items-end gap-6 lg:gap-0 max-w-2xl w-full px-6">
                <!-- Partner besar di intro -->
                <img
                    v-if="partner?.images"
                    :src="partner?.images[1]?.img"
                    :alt="partner?.name"
                    class="object-contain object-bottom drop-shadow-2xl pointer-events-none select-none h-64 lg:h-96"
                />
                    <!-- Dialog intro -->
                    <div v-if="partnerSpeech" class="relative max-w-sm w-full lg:mb-20">
                        <div class="absolute inset-0 translate-x-2 translate-y-2 border border-[#d3b484]/15" />
                        <div class="relative border border-[#d3b484]/40 bg-[#1a1208]/95 px-6 py-5">
                            <div class="absolute top-2 left-2 w-4 h-4 border-t border-l border-[#d3b484]/40" />
                            <div class="absolute top-2 right-2 w-4 h-4 border-t border-r border-[#d3b484]/40" />
                            <div class="absolute bottom-2 left-2 w-4 h-4 border-b border-l border-[#d3b484]/40" />
                            <div class="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-[#d3b484]/40" />
                            <!-- Nama partner -->
                            <div class="flex items-center gap-2 mb-2">
                                <span class="text-[#810000] text-xs">✦</span>
                                <span class="text-[#d3b484]/60 text-[10px] tracking-[0.3em] uppercase font-snpro">{{ partner?.name }}</span>
                            </div>
                            <div class="h-px w-full bg-[#d3b484]/10 mb-3" />
                            <p class="text-[#d3b484]/90 text-sm font-snpro leading-relaxed">
                                {{ partnerSpeech }}<span v-if="isSpeaking" class="animate-pulse">▌</span>
                            </p>
                            <!-- Skip hint -->
                            <p class="text-[#d3b484]/30 text-[9px] font-snpro tracking-widest uppercase mt-4 text-right">
                                Ketuk untuk lewati →
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Transition>
        <div class="relative z-10 flex flex-col items-center gap-10 w-full max-w-lg">
        <GameScoreBoard :score="score" :timer="loop.timer.value" />
        <GameModePickAndGuessCardDeck :cards="localCards" :locked="isAnswering" @skip="skipCard" />
        <GameModePickAndGuessQuestionPanel
            v-if="currentCard"
            :card="currentCard"
            :score="score"
            :key="currentCard.id ?? currentCard.answer"
            @answer="checkAnswer"
            @use-clue="onUseClue"
            @skip="skipCard"
        />
            <div class="flex justify-center mt-2">
                <button class="group relative flex hover:cursor-pointer items-center gap-2 px-5 py-2 border border-[#810000]/40 bg-[#810000]/10 text-[#d3b484]/50 text-[10px] tracking-[0.3em] font-snpro uppercase hover:border-[#810000]/70 hover:bg-[#810000]/20 hover:text-[#d3b484]/80 transition-all duration-300" @click="endGame">
                    <!-- Ornamen sudut -->
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