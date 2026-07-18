<!-- components/game/Result.vue -->

<script setup lang="ts">
import { gameAssets } from "~/data/assets"
import { isPickAndGuess, isImageGuess } from "~/utils/cardGuards"

const store = useGameStore()
const router = useRouter()

const kartuHasil = gameAssets.pictures.ui.root.find(p =>
  p.includes("kartu-hasil")
) ?? gameAssets.pictures.ui.root[0]

const papanReviu = gameAssets.pictures.ui.root.find(p =>
  p.includes("papan-reviu")
) ?? gameAssets.pictures.ui.root[0]

const partner = computed(() => gameStore.partners)
const gameStore = useGameStore()
if (!store.playerName) {
    router.replace("/")
}

const total = computed(() => store.correct + store.wrong)
const accuracy = computed(() =>
    total.value > 0 ? Math.round((store.correct / total.value) * 100) : 0
)

// PR
const grade = computed(() => {
    if (accuracy.value >= 90) return { label: "Luar Biasa!", symbol: "🏆" }
    if (accuracy.value >= 70) return { label: "Bagus!", symbol: "⭐" }
    if (accuracy.value >= 50) return { label: "Lumayan", symbol: "👍" }
    return { label: "Ayo Coba Lagi!", symbol: "💪" }
})

// Partner speech saat result
const partnerSpeech = ref("")
const isSpeaking = ref(false)
let typewriterTimer: ReturnType<typeof setTimeout> | null = null

function typewrite(text: string) {
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
        }
    } tick()
}

// PR
onMounted(() => {
    if (accuracy.value >= 90) typewrite(`Wah luar biasa, ${store.playerName}! Kamu benar-benar menguasai sejarah bangsa! 🏆`)
    else if (accuracy.value >= 70) typewrite(`Bagus sekali, ${store.playerName}! Sedikit lagi kamu bisa sempurna!`)
    else if (accuracy.value >= 50) typewrite(`Lumayan, ${store.playerName}! Terus belajar ya, aku yakin kamu bisa lebih baik!`)
    else typewrite(`Jangan menyerah, ${store.playerName}! Coba lagi dan aku akan terus membantumu! 💪`)
})

const { getExpressionForEvent } = usePartnerExpression(partner)

const partnerExpression = computed(() => {
    if (accuracy.value >= 90) return getExpressionForEvent("appreciated")
    if (accuracy.value >= 70) return getExpressionForEvent("correct")
    if (accuracy.value >= 50) return getExpressionForEvent("smile")
    return getExpressionForEvent("wrong")
})

function playAgain() {
    router.push("/game/play")
}

function toMenu() {
    router.push("/game")
}

function toLeaderboard() {
    router.push("/leaderboard")
}
</script>

<template>
    <div class="relative z-10 w-full max-w-5xl flex flex-col gap-12">
        <Partner
            :partner="partner"
            :partner-speech="partnerSpeech"
            :is-speaking="isSpeaking"
            :expression="partnerExpression"
        />
        <div class="relative flex flex-col lg:flex-row items-center justify-center gap-6">>
            <div class="relative w-full max-w-lg aspect-video overflow-hidden" :style="{ backgroundImage: `url(${kartuHasil})`, backgroundSize: '100% 100%' }">
                <div class="absolute inset-0 flex flex-col justify-center px-9 py-9">
                    <!-- Header -->
                    <div class="flex flex-col items-center gap-0.5 border-b border-[#f5dfc5]/30 pb-2">
                        <p class="text-[#f5dfc5]/60 text-[9px] tracking-[0.3em] uppercase font-snpro">Laporan Resmi</p>
                        <h2 class="text-sm font-display text-[#fdf0e0] leading-tight text-center">Hasil Permainan</h2>
                        <div class="flex gap-1 text-[#f5dfc5]/40 text-[9px]">
                            <span>✦</span><span>✦</span><span>✦</span>
                        </div>
                    </div>
                    <!-- Data pemain -->
                    <div class="flex flex-col gap-2">
                        <div class="flex flex-col gap-0.5">
                            <label class="text-[8px] tracking-[0.25em] uppercase font-snpro text-[#f5dfc5]/50">Nama Peserta</label>
                            <div class="border-b border-[#f5dfc5]/30 pb-0.5">
                                <p class="text-[#fdf0e0] text-sm font-snpro font-semibold truncate">{{ store.playerName }}</p>
                            </div>
                        </div>
                        <div class="flex flex-col gap-0.5">
                            <label class="text-[8px] tracking-[0.25em] uppercase font-snpro text-[#f5dfc5]/50">Pendamping</label>
                            <div class="border-b border-[#f5dfc5]/30 pb-0.5">
                                <p class="text-[#fdf0e0] text-sm font-snpro truncate">{{ store.partners?.name ?? "—" }}</p>
                            </div>
                        </div>
                        <div class="flex flex-col gap-0.5">
                            <label class="text-[8px] tracking-[0.25em] uppercase font-snpro text-[#f5dfc5]/50">Predikat</label>
                            <div class="border-b border-[#f5dfc5]/30 pb-0.5 flex items-center gap-1.5">
                                <span class="text-sm">{{ grade.symbol }}</span>
                                <p class="text-[#fdf0e0] text-sm font-snpro font-semibold">{{ grade.label }}</p>
                            </div>
                        </div>
                    </div>
                    <!-- Stempel -->
                    <div class="flex justify-end mt-auto">
                        <div class="relative w-12 h-12 -rotate-6 opacity-70">
                            <div class="absolute inset-0 rounded-full border-2 border-[#fdf0e0]/50 flex items-center justify-center">
                                <div class="w-8 h-8 rounded-full border border-[#fdf0e0]/30 flex items-center justify-center">
                                    <p class="text-[#fdf0e0] text-[6px] tracking-wider text-center leading-tight font-snpro uppercase font-bold">KUPAS<br/>TUNTAS</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Kartu Kanan: Statistik -->
            <div class="relative w-full max-w-lg aspect-video overflow-hidden" :style="{ backgroundImage: `url(${kartuHasil})`, backgroundSize: '100% 100%' }">
                <div class="absolute inset-0 flex flex-col justify-center px-9 py-6 gap-1">
                    <!-- Header -->
                    <div class="flex flex-col items-center gap-0.5 border-b border-[#f5dfc5]/30 pb-2">
                        <p class="text-[#f5dfc5]/60 text-[9px] tracking-[0.3em] uppercase font-snpro">Statistik</p>
                        <h2 class="text-sm font-display text-[#fdf0e0] leading-tight text-center">Rincian Nilai</h2>
                        <div class="flex gap-1 text-[#f5dfc5]/40 text-[9px]">
                            <span>✦</span><span>✦</span><span>✦</span>
                        </div>
                    </div>
                    <!-- Poin -->
                    <div class="flex flex-col items-center gap-0.5">
                        <span class="text-4xl font-display text-[#fdf0e0] leading-none">{{ store.score }}</span>
                        <span class="text-[#f5dfc5]/60 text-[9px] tracking-[0.3em] uppercase font-snpro">Total Poin</span>
                    </div>
                    <div class="h-px w-full bg-[#f5dfc5]/20" />
                    <!-- Stats -->
                    <div class="flex flex-col gap-1.5">
                        <div class="flex justify-between items-center">
                            <label class="text-[8px] tracking-[0.25em] uppercase font-snpro text-[#f5dfc5]/50">Jawaban Benar</label>
                            <div class="border-b border-[#f5dfc5]/25 flex-1 mx-2" />
                            <span class="text-sm font-display text-[#a8f0b8]">{{ store.correct }}</span>
                        </div>
                        <div class="flex justify-between items-center">
                            <label class="text-[8px] tracking-[0.25em] uppercase font-snpro text-[#f5dfc5]/50">Jawaban Salah</label>
                            <div class="border-b border-[#f5dfc5]/25 flex-1 mx-2" />
                            <span class="text-sm font-display text-[#ffb3b3]">{{ store.wrong }}</span>
                        </div>
                        <div class="flex justify-between items-center">
                            <label class="text-[8px] tracking-[0.25em] uppercase font-snpro text-[#f5dfc5]/50">Total Soal</label>
                            <div class="border-b border-[#f5dfc5]/25 flex-1 mx-2" />
                            <span class="text-sm font-display text-[#fdf0e0]">{{ total }}</span>
                        </div>
                        <div class="flex justify-between items-center">
                            <label class="text-[8px] tracking-[0.25em] uppercase font-snpro text-[#f5dfc5]/50">Akurasi</label>
                            <div class="border-b border-[#f5dfc5]/25 flex-1 mx-2" />
                            <span class="text-sm font-display text-[#fdf0e0]">{{ accuracy }}%</span>
                        </div>
                    </div>
                    <!-- Tanda tangan -->
                    <div class="flex flex-col gap-0.5 mt-auto">
                        <div class="w-24 border-b border-[#f5dfc5]/30" />
                        <p class="text-[8px] font-snpro text-[#f5dfc5]/40 italic">{{ store.playerName }}</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="relative flex flex-col items-center">
            <div class="relative w-full max-w-2xl">
                <img
                    :src="papanReviu"
                    alt=""
                    class="w-full select-none pointer-events-none"
                />
                <div class="absolute inset-13 flex flex-col translate-y-14 px-6 pt-8 pb-5 gap-2">
                    <div class="flex items-center justify-center gap-2 mb-1 shrink-0">
                        <div class="h-px w-4 bg-[#8b6914]/40" />
                        <p class="text-2xl font-bold tracking-[0.3em] uppercase font-snpro text-[#5a3e0a]/60">
                            Review Jawaban
                        </p>
                        <div class="h-px w-4 bg-[#8b6914]/40" />
                    </div>
                    <div class="flex-1 flex flex-col gap-1.5 overflow-y-auto custom-scrollbar" style="scrollbar-width: none;">
                        <div v-for="(record, i) in store.answerHistory" :key="i" class="flex items-center gap-2 p-1.5 border" :class="record.isCorrect ? 'border-green-700/30 bg-green-950/10' : 'border-[#810000]/25 bg-[#3d0a00]/10'">
                            <span class="text-[#5a3e0a]/40 text-lg font-snpro shrink-0 w-4">{{ i + 1 }}.</span>
                            <!-- Ganti bagian img di review jawaban: -->
                            <div class="shrink-0 h-32 w-18 border border-[#8b6914]/30 overflow-hidden">
                                <img :src="isPickAndGuess(record.card) ? record.card.image : isImageGuess(record.card) ? record.card.images.find(i => i.id === 'photo')?.img ?? record.card.images[0]?.img ?? '' : ''" class="w-full h-full object-cover object-top" />
                            </div>
                            <div class="flex-1 min-w-0">
                                <p class="text-[#3d2005] font-lg font-snpro font-semibold truncate">{{ record.card?.name }}</p>
                                <div class="flex gap-2 mt-0.5 flex-wrap">
                                    <span class="text-md font-snpro text-green-700">
                                        ✓ {{ isPickAndGuess(record.card) ? record.card.answer : record.card?.name }}
                                    </span>
                                    <span v-if="record.playerAnswer && !record.isCorrect" class="text-md font-snpro text-[#810000]">
                                        ✗ {{ record.playerAnswer }}
                                    </span>
                                    <span v-if="!record.playerAnswer" class="text-md font-snpro text-[#5a3e0a]/40 italic">
                                        — tidak dijawab
                                    </span>
                                </div>
                            </div>
                            <span class="shrink-0 text-md font-display" :class="record.isCorrect ? 'text-green-700' : 'text-[#5a3e0a]/30'">
                                {{ record.isCorrect ? isPickAndGuess(record.card) ? record.card.difficulty === "hard" ? "+20" : record.card.difficulty === "medium" ? "+10" : "+5" : "+10" : "0" }}
                            </span>
                        </div>
                    </div>
                    <div class="shrink-0">-</div>
                </div>
            </div>
        </div>
        <div class="flex flex-col md:flex-row gap-3 justify-center">
            <button
                @click="playAgain"
                class="relative px-10 hover:cursor-pointer py-3 text-xs font-snpro tracking-widest uppercase text-[#0d0a06] bg-[#d3b484] hover:bg-[#c4a070] transition-all group"
            >
                <span class="absolute inset-0 ring-1 ring-inset ring-[#d3b484]/30 group-hover:ring-[#d3b484]/60 transition-all" />
                Main Lagi
            </button>
            <button @click="toLeaderboard" class="relative hover:cursor-not-allowed px-10 py-3 text-xs font-snpro tracking-widest uppercase text-[#d3b484] border border-[#d3b484]/40 hover:border-[#d3b484]/80 hover:bg-[#d3b484]/10 transition-all group" disabled>
                <span class="absolute inset-0 ring-1 ring-inset ring-[#d3b484]/10 group-hover:ring-[#d3b484]/30 transition-all" />
                Leaderboard
            </button>
            <button @click="toMenu" class="relative px-10 hover:cursor-pointer py-3 text-xs font-snpro tracking-widest uppercase text-[#0d0a06] bg-[#d3b484] hover:bg-[#c4a070] transition-all group">
                <span class="absolute inset-0 ring-1 ring-inset ring-[#d3b484]/30 group-hover:ring-[#d3b484]/60 transition-all" />
                Menu
            </button>
        </div>
        <!-- Footer -->
        <div class="flex items-center justify-center gap-3">
            <div class="h-px w-12 bg-[#d3b484]/20" />
            <span class="text-[#d3b484]/25 text-[9px] tracking-widest font-snpro uppercase">Kupas Tuntas · 2025</span>
            <div class="h-px w-12 bg-[#d3b484]/20" />
        </div>
    </div>
</template>