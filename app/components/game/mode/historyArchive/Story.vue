<script setup lang="ts">
const emit = defineEmits(['done'])

const gameStore = useGameStore()
const partner = computed(() => gameStore.partners)

const SCRIPT = [
    {
        phase: 'orientasi',
        speaker: 'pak-budi',
        lines: [
            'Halo... senang akhirnya kamu datang. Selamat datang di ruang arsip pribadiku.',
            'Mungkin bagi orang lain, ruangan ini hanya berisi tumpukan kertas tua dan foto kusam. Tapi bagiku, ini adalah mesin waktu.',
            'Aku menghabiskan seluruh hidupku mengumpulkan potongan sejarah agar mereka tidak terlupakan oleh zaman.',
        ],
    },
    {
        phase: 'konflik',
        speaker: 'pak-budi',
        lines: [
            'Tapi, lihatlah kekacauan ini... [Hela napas panjang]',
            'Beberapa malam lalu, rumahku didatangi pencuri. Mereka mengacak-acak laci dan mencampuradukkan koleksi berhargaku.',
            'Foto, dokumen, dan catatan peristiwa semuanya tercampur di tiga kardus itu.',
        ],
    },
    {
        phase: 'masuk',
        speaker: 'pak-budi',
        lines: [
            'Aku butuh bantuanmu untuk menyortir ulang arsip ini.',
            'Klik kardus untuk membuka isinya, lalu seret foto-foto itu ke tempat yang sudah kusiapkan.',
        ],
    },
    {
        phase: 'masuk',
        speaker: 'partner',
        lines: [
            'Oke, saatnya kita bekerja!',
        ],
    },
]

interface Segment { 
    phase: string,
    speaker: string,
    line: string 
}

const segments: Segment[] = SCRIPT.flatMap(s => s.lines.map(line => ({ phase: s.phase, speaker: s.speaker, line })))

const currentIndex = ref(0)
const current = computed(() => segments[currentIndex.value])
const displayText = ref('')
const isTyping = ref(false)
const isDone = ref(false)
const partnerSpeech = ref('')
const isSpeaking = ref(false)

let typeTimer: ReturnType<typeof setTimeout> | null = null

function typewrite(text: string, onDone?: () => void) {
    if (typeTimer) clearTimeout(typeTimer)
    displayText.value = ''
    isTyping.value = true
    if (current.value?.speaker === 'partner') {
        partnerSpeech.value = ''
        isSpeaking.value = true
    }
    let i = 0
    const tick = () => {
        if (i < text.length) {
            displayText.value += text[i]
            if (current.value?.speaker === 'partner') partnerSpeech.value += text[i]
            i++
            typeTimer = setTimeout(tick, 28)
        } else {
            isTyping.value = false
            isSpeaking.value = false
            onDone?.()
        }
    }
    tick()
}

function skipTyping() {
    if (isTyping.value) {
        if (typeTimer) clearTimeout(typeTimer)
        if (current.value) {
            displayText.value = current.value.line
            if (current.value.speaker === 'partner') partnerSpeech.value = current.value.line
        }
        isTyping.value = false
        isSpeaking.value = false
        return
    }
    nextLine()
}

function nextLine() {
    if (currentIndex.value < segments.length - 1) {
        currentIndex.value++
        if (current.value) {
            typewrite(current.value.line, () => {
                if (currentIndex.value === segments.length - 1) {
                setTimeout(() => { isDone.value = true; setTimeout(() => emit('done'), 500) }, 1000)
                }
            })
        }
    } else {
        isDone.value = true
        setTimeout(() => emit('done'), 500)
    }
}

function skipAll() {
    if (typeTimer) clearTimeout(typeTimer)
    isDone.value = true
    emit('done')
}

const lineProgress = computed(() => `${currentIndex.value + 1} / ${segments.length}`)

onMounted(() => {
    if (current.value) typewrite(current.value.line)
})
</script>

<template>
    <Transition
        enter-active-class="transition-all duration-500"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-all duration-500"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
    >
        <div
            v-if="!isDone"
            class="fixed inset-0 z-50 bg-[#0d0a06] flex flex-col items-end justify-end"
            @click="skipTyping"
        >
            <!-- Grain -->
            <div
                class="absolute inset-0 opacity-20 pointer-events-none"
                style="background-image:url('data:image/svg+xml,%3Csvg viewBox=%220 0 256 256%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22 opacity=%221%22/%3E%3C/svg%3E');background-size:200px 200px;"
            />
            <!-- Ambient glow -->
            <div
                class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 rounded-full blur-[150px] pointer-events-none transition-all duration-1000"
                :class="{
                'bg-[#d3b484]/5':  current?.phase === 'orientasi',
                'bg-[#810000]/10': current?.phase === 'konflik',
                'bg-[#2d5a2d]/15': current?.phase === 'masuk',
                }"
            />
            <!-- Ornamen sudut -->
            <div class="absolute top-5 left-5   w-12 h-12 border-t border-l border-[#d3b484]/20 pointer-events-none" />
            <div class="absolute top-5 right-5  w-12 h-12 border-t border-r border-[#d3b484]/20 pointer-events-none" />
            <div class="absolute bottom-5 left-5  w-12 h-12 border-b border-l border-[#d3b484]/20 pointer-events-none" />
            <div class="absolute bottom-5 right-5 w-12 h-12 border-b border-r border-[#d3b484]/20 pointer-events-none" />
            <!-- Tombol Lewati -->
            <button
                @click.stop="skipAll"
                class="absolute top-8 right-16 z-20 flex items-center gap-2 px-4 py-2 border border-[#d3b484]/20 text-[#d3b484]/30 text-[9px] tracking-[0.3em] font-snpro uppercase hover:border-[#d3b484]/50 hover:text-[#d3b484]/60 transition-all"
            >
                Lewati Cerita →
            </button>
            <!-- Phase label -->
            <div class="absolute top-8 left-1/2 -translate-x-1/2 flex items-center gap-3">
                <div class="h-px w-8 bg-[#d3b484]/20" />
                <span class="text-[#d3b484]/30 text-[9px] tracking-[0.4em] uppercase font-snpro">
                    {{ current?.phase === 'orientasi' ? 'Prolog' : current?.phase === 'konflik' ? 'Konflik' : 'Misi' }}
                </span>
                <div class="h-px w-8 bg-[#d3b484]/20" />
            </div>
            <!-- Partner muncul di phase masuk -->
            <Transition
                enter-active-class="transition-all duration-500"
                enter-from-class="opacity-0 translate-x-8"
                enter-to-class="opacity-100 translate-x-0"
            >
                <Partner
                    v-if="current?.phase === 'masuk'"
                    :partner="partner"
                    :partner-speech="partnerSpeech"
                    :is-speaking="isSpeaking"
                />
            </Transition>
            <!-- Dialog box -->
            <div class="relative w-full z-10 p-6 lg:p-10">
                <div class="relative max-w-3xl mx-auto">
                    <div class="absolute inset-0 translate-x-2 translate-y-2 border border-[#d3b484]/10" />
                    <div class="relative border border-[#d3b484]/35 bg-[#0d0a06]/95 backdrop-blur-sm px-7 py-6">
                        <div class="absolute top-2 left-2   w-4 h-4 border-t border-l border-[#d3b484]/35" />
                        <div class="absolute top-2 right-2  w-4 h-4 border-t border-r border-[#d3b484]/35" />
                        <div class="absolute bottom-2 left-2  w-4 h-4 border-b border-l border-[#d3b484]/35" />
                        <div class="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-[#d3b484]/35" />
                        <!-- Speaker -->
                        <div class="flex items-center gap-2 mb-2">
                            <span class="text-[#810000] text-xs">✦</span>
                            <span class="text-[#d3b484]/60 text-[10px] tracking-[0.3em] uppercase font-snpro">
                                {{ current?.speaker === 'partner' ? (partner?.name ?? 'Partner') : 'Pak Budi' }}
                            </span>
                            <div class="h-px flex-1 bg-[#d3b484]/10" />
                            <span class="text-[#d3b484]/20 text-[9px] font-snpro">
                                {{ lineProgress }}
                            </span>
                        </div>
                        <div class="h-px w-full bg-[#d3b484]/10 mb-4" />
                        <p class="text-[#d3b484]/90 text-sm lg:text-base font-snpro leading-relaxed min-h-16">
                            {{ displayText }}<span v-if="isTyping" class="animate-pulse">▌</span>
                        </p>
                        <div class="flex justify-end mt-4">
                            <span class="text-[#d3b484]/25 text-[9px] font-snpro tracking-widest uppercase animate-pulse">
                                {{ isTyping ? 'Klik untuk skip...' : currentIndex === segments.length - 1 ? '' : 'Klik untuk lanjut →' }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Transition>
</template>