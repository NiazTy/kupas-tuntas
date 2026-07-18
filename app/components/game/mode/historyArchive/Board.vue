<script setup lang="ts">
import { HistoryArchiveNotes, HistoryArchiveFacts, HistoryArchivePeoples, HistoryArchivePhotos } from "~/data/game/historyArchive"

import type { PickAndGuessCard } from "~/data/types/cards"
import type { ImageGuessCards } from "~/data/types/cards"
import type { ArchiveAssetItem, NoteAssetItem, ScatterPhoto, DroppedPhoto } from "~/data/types/cards"
import type { Expression } from "~/data/types/partners"

defineProps<{
  cards: PickAndGuessCard[] | ImageGuessCards[]
}>()

const router = useRouter()
const gameStore = useGameStore()
const partner = computed(() => gameStore.partners)

const novelDone = ref(false)
// isTouchMode = true saat pointer utama adalah touch (hp/tablet)
const isTouchMode = ref(false)

onMounted(() => {
    isTouchMode.value = window.matchMedia("(pointer: coarse)").matches
    window.matchMedia("(pointer: coarse)").addEventListener("change", e => {
        isTouchMode.value = e.matches
    })
})

const shuffledFacts = ref([...HistoryArchiveFacts].sort(() => Math.random() - 0.5))
const shuffledPhotos = ref([...HistoryArchivePhotos].sort(() => Math.random() - 0.5))
const shuffledPeoples = ref([...HistoryArchivePeoples].sort(() => Math.random() - 0.5))

const revealedCountFoto = ref(0)
const revealedCountFakta = ref(0)
const revealedCountTokoh = ref(0)

const noteIndex = ref(0)
const notes = ref<NoteAssetItem[]>([...HistoryArchiveNotes].sort(() => Math.random() - 0.5))
const activeNote = computed<NoteAssetItem | null>(() => notes.value[noteIndex.value] ?? null)

const autoNoteText = computed(() => {
    if (!activeNote.value) return ""
    const all: ArchiveAssetItem[] = [
        ...HistoryArchiveFacts,
        ...HistoryArchivePeoples,
        ...HistoryArchivePhotos,
    ]
    return all.find(i => i.category === activeNote.value!.category)?.notes ?? ""
})

const boxes = [
    { id: "fakta" as const, label: "Fakta" },
    { id: "tokoh" as const, label: "Tokoh" },
    { id: "foto"  as const, label: "Foto"  },
]

function getPoolData(boxId: "fakta" | "tokoh" | "foto") {
    if (boxId === "fakta") return {
        pool: shuffledFacts.value as ArchiveAssetItem[],
        count: revealedCountFakta,
        total: shuffledFacts.value.length
    }
    if (boxId === "tokoh") return {
        pool: shuffledPeoples.value as ArchiveAssetItem[],
        count: revealedCountTokoh,
        total: shuffledPeoples.value.length }
    return {
        pool: shuffledPhotos.value  as ArchiveAssetItem[],
        count: revealedCountFoto,
        total: shuffledPhotos.value.length
    }
}

function isBoxEmpty(boxId: "fakta" | "tokoh" | "foto") {
    const { count, total } = getPoolData(boxId)
    return count.value >= total
}

// State game
const score = ref(0)
const wrong = ref(0)
const correct = ref(0)
const isDragOver = ref(false)
const scatterPhotos = ref<ScatterPhoto[]>([])
const droppedPhotos = ref<DroppedPhoto[]>([])
const draggedItem = ref<ScatterPhoto | null>(null)
const activeBox = ref<typeof boxes[number] | null>(null)

// Touch mode: foto yang sedang "dipilih" sebelum dikirim ke drop zone
const selectedPhoto = ref<ScatterPhoto | null>(null)

// koran
const noteLightboxOpen = ref(false)
const noteLightboxItems = computed(() => activeNote.value ? [{ image: activeNote.value.image }] : [])

// Foto
const scatterLightboxIndex = ref(-1)
const scatterLightboxItems = computed(() => scatterPhotos.value.map(p => ({ image: p.image, label: p.code })))

function openScatterZoom(photo: ScatterPhoto) {
    const idx = scatterPhotos.value.findIndex(p => p.id === photo.id)
    if (idx !== -1) scatterLightboxIndex.value = idx
}

const resultToast = ref({ show: false, message: "", isCorrect: false })

// Partner speech
const partnerSpeech = ref("")
const isSpeaking = ref(false)

let typeTimer: ReturnType<typeof setTimeout> | null = null
let photoCounter = 0

const { partnerExpression, setExpression, getExpressionForEvent } = usePartnerExpression(partner)

// ── Tambah state ini ──
const levelSelected = ref(false)

function onLevelSelect(note: NoteAssetItem) {
  const idx = notes.value.findIndex(n => n.id === note.id)
  if (idx !== -1) {
    const picked = notes.value.splice(idx, 1)[0]
    notes.value.unshift(picked || note)
    noteIndex.value = 0
  }

  levelSelected.value = true

  setExpression("smile", 4000)
  typewrite(`Oke! Kita mulai dengan arsip "${note.category}". Buka kardus dan cocokkan item yang relevan!`)
}


function typewrite(text: string) {
    if (typeTimer) clearTimeout(typeTimer)
    partnerSpeech.value = ""
    isSpeaking.value = true
    let i = 0

    const tick = () => {
        if (i < text.length) {
            partnerSpeech.value += text[i++]
            typeTimer = setTimeout(tick, 35)
        } else {
            isSpeaking.value = false
        }
    } 
    
    tick()
}

// Kardus dibuka
function openBox(box: typeof boxes[number]) {
    if (isBoxEmpty(box.id)) return

    const { pool, count } = getPoolData(box.id)
    const item = pool[count.value]
    if (!item) return
    count.value++

    photoCounter++
    const newPhoto: ScatterPhoto = {
        id: "p" + photoCounter,
        category: item.category,
        image: item.image,
        notes: item.notes,
        code: `${box.id.substring(0, 2).toUpperCase()}-${String(photoCounter).padStart(3, "0")}`,
        x: 40  + Math.floor(photoCounter % 4) * 210 + (Math.random() * 50 - 25),
        y: 24  + Math.floor(photoCounter / 4) * 60  + (Math.random() * 24 - 12),
        rot: Math.random() * 18 - 9,
        z: scatterPhotos.value.length + 1,
        boxId: box.id,
    }

    scatterPhotos.value = [...scatterPhotos.value, newPhoto]
    activeBox.value = box

    setExpression("smile", 2000)

    const { total } = getPoolData(box.id)
    const remaining = total - count.value
    typewrite(remaining === 0
        ? `Semua arsip di kardus ${box.label} sudah dikeluarkan!`
        : `Item dari kardus ${box.label} ditemukan! (${count.value}/${total})`
    )
}

function bringToFront(photo: ScatterPhoto) {
    const maxZ = Math.max(0, ...scatterPhotos.value.map(p => p.z))
    photo.z = maxZ + 1
}

function onDragStart(event: DragEvent, photo: ScatterPhoto) {
    if (!event.dataTransfer) return
    event.dataTransfer.setData("application/json", JSON.stringify(photo))
    event.dataTransfer.effectAllowed = "move"
    draggedItem.value = photo
    setTimeout(() => { (event.target as HTMLElement | null)?.style.setProperty("opacity", "0.35") }, 0)
}

function onDragEnd(event: DragEvent) {
    ;(event.target as HTMLElement | null)?.style.setProperty("opacity", "1")
    draggedItem.value = null
}

function onDropZoneDragOver(event: DragEvent) {
    event.preventDefault()
    if (event.dataTransfer) event.dataTransfer.dropEffect = "move"
    isDragOver.value = true
}

function onDropZoneDragLeave() { isDragOver.value = false }

function onDrop(event: DragEvent) {
    event.preventDefault()
    isDragOver.value = false

    let photo = draggedItem.value
    if (!photo && event.dataTransfer) {
        try { photo = JSON.parse(event.dataTransfer.getData("application/json")) } catch {}
    }
    if (!photo) return
    draggedItem.value = null
    commitPhoto(photo)
}

function onTapSelect(photo: ScatterPhoto) {
    if (selectedPhoto.value?.id === photo.id) {
        selectedPhoto.value = null
    } else {
        selectedPhoto.value = photo
        bringToFront(photo)
        typewrite("Foto dipilih. Ketuk 'Kirim ke Arsip' untuk mencocokkan.")
    }
}

function commitTouchSelection() {
    if (!selectedPhoto.value) return
    commitPhoto(selectedPhoto.value)
    selectedPhoto.value = null
}

function commitPhoto(photo: ScatterPhoto) {
    if (droppedPhotos.value.find(p => p.id === photo.id)) return

    const isCorrect = activeNote.value ? photo.category === activeNote.value.category : false

    droppedPhotos.value.push({ ...photo, dropRot: Math.random() * 10 - 5 })
    scatterPhotos.value = scatterPhotos.value.filter(p => p.id !== photo.id)

    if (isCorrect) {
        score.value += 10
        correct.value++
        setExpression("correct", 3000)
        resultToast.value = { show: true, message: "Cocok! +10 poin", isCorrect: true }
        typewrite("Betul! Item ini sesuai dengan arsip yang sedang kamu kerjakan! +10 poin")
    } else {
        score.value = Math.max(0, score.value - 5)
        wrong.value++
        setExpression("wrong", 3000)
        resultToast.value = { show: true, message: "Tidak cocok. -5 poin", isCorrect: false }
        typewrite("Hmm, sepertinya item itu tidak berhubungan dengan arsip ini...")
    }
    setTimeout(() => { resultToast.value.show = false }, 2000)
}


function removeDropped(photo: DroppedPhoto) {
    droppedPhotos.value = droppedPhotos.value.filter(p => p.id !== photo.id)
    scatterPhotos.value.push({
        ...photo,
        x: 40 + Math.random() * 400,
        y: 24 + Math.random() * 80,
        z: scatterPhotos.value.length + 1,
    })
    typewrite("Foto dikembalikan ke area scatter.")
}

function nextNote() {
    if (noteIndex.value < notes.value.length - 1) {
        noteIndex.value++
        droppedPhotos.value = []
        selectedPhoto.value = null
        setExpression("smile", 2000)
        typewrite("Baik, mari kita lihat arsip berikutnya!")
    } else {
        endGame()
    }
}

function endGame() {
    setExpression(score.value >= correct.value * 10 * 0.7 ? "appreciated" : "smile", 0)
    gameStore.setResult(score.value, correct.value, wrong.value)
    router.push("/game/result")
}

onMounted(() => {
    gameStore.resetGame()
    setExpression("smile", 4000)
    typewrite(`Halo! Aku akan membantumu menyelidiki arsip sejarah. Buka kardus dan cocokkan item dengan arsip yang tepat!`)
})
</script>

<template>
    <Partner
        :partner="partner"
        :partner-speech="partnerSpeech"
        :is-speaking="isSpeaking"
        :expression="partnerExpression"
    />
    <!-- Level Select -->
    
    <div class="relative min-h-screen bg-[#0d0a06] overflow-hidden">
        <GameModeHistoryArchiveStory v-if="!novelDone" @done="novelDone = true" />
        <GameModeHistoryArchiveSelect v-if="!levelSelected" @select="onLevelSelect" />
        <div v-else class="relative min-h-screen flex flex-col px-4 lg:px-6 py-12 gap-8">
            <Ornament2 />
            <!-- Label mode -->
            <div class="absolute top-8 right-16 flex items-center gap-3 z-10">
                <div class="h-px w-10 bg-[#d3b484]/30" />
                <span class="text-[#d3b484]/40 text-[10px] tracking-[0.4em] font-snpro uppercase">
                    History Detective
                </span>
            </div>
            <!-- Toast -->
            <Transition
                enter-active-class="transition-all duration-300"
                enter-from-class="opacity-0 -translate-y-2"
                enter-to-class="opacity-100 translate-y-0"
                leave-active-class="transition-all duration-200"
                leave-from-class="opacity-100"
                leave-to-class="opacity-0"
            >
                <div
                    v-if="resultToast.show"
                    class="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 border backdrop-blur-sm font-snpro text-xs tracking-wider"
                    :class="resultToast.isCorrect ? 'border-green-600/50 bg-green-900/30 text-green-400' : 'border-[#810000]/50 bg-[#810000]/20 text-[#d3b484]/70'"
                >
                    {{ resultToast.message }}
                </div>
            </Transition>
            <!-- ── Header ── -->
            <div class="relative z-10 flex items-center justify-between w-full max-w-7xl mx-auto">
                <div class="flex items-center gap-3">
                    <!-- Skor -->
                    <div class="relative border border-[#d3b484]/25 bg-[#1a1208]/70 px-4 py-2">
                        <div class="absolute top-1 left-1   w-2 h-2 border-t border-l border-[#d3b484]/30" />
                        <div class="absolute top-1 right-1  w-2 h-2 border-t border-r border-[#d3b484]/30" />
                        <div class="absolute bottom-1 left-1  w-2 h-2 border-b border-l border-[#d3b484]/30" />
                        <div class="absolute bottom-1 right-1 w-2 h-2 border-b border-r border-[#d3b484]/30" />
                        <p class="text-[#d3b484]/40 text-[9px] tracking-[0.3em] uppercase font-snpro">
                            Poin
                        </p>
                        <p class="text-[#d3b484] text-xl font-display leading-tight">
                            {{ score }}
                        </p>
                    </div>
                    <!-- Indikator touch mode -->
                    <div
                        v-if="isTouchMode"
                        class="flex items-center gap-2 border border-[#d3b484]/15 bg-[#1a1208]/50 px-3 py-1.5"
                    >
                        <span class="text-[#d3b484]/40 text-[8px]">
                            👆
                        </span>
                        <span class="text-[#d3b484]/30 text-[8px] tracking-widest font-snpro uppercase">
                            Ketuk & Kirim
                        </span>
                    </div>
                    <!-- Tombol Akhiri -->
                    <button @click="endGame" class="group hover:cursor-pointer relative flex items-center gap-2 px-4 py-2 border border-[#810000]/40 bg-[#810000]/10 text-[#d3b484]/50 text-[10px] tracking-[0.3em] font-snpro uppercase  hover:border-[#810000]/70 hover:bg-[#810000]/20 hover:text-[#d3b484]/80 transition-all">
                        <div class="absolute top-1 left-1   w-2 h-2 border-t border-l border-[#810000]/40 group-hover:border-[#810000]/70 transition-colors" />
                        <div class="absolute top-1 right-1  w-2 h-2 border-t border-r border-[#810000]/40 group-hover:border-[#810000]/70 transition-colors" />
                        <div class="absolute bottom-1 left-1  w-2 h-2 border-b border-l border-[#810000]/40 group-hover:border-[#810000]/70 transition-colors" />
                        <div class="absolute bottom-1 right-1 w-2 h-2 border-b border-r border-[#810000]/40 group-hover:border-[#810000]/70 transition-colors" />
                        <span class="text-[#810000]/60 group-hover:text-[#810000]/90 transition-colors">✦</span>
                        Akhiri
                    </button>
                </div>
            </div>
            <!-- ── Top row: Catatan Arsip + 3 Kardus ── -->
            <!-- Desktop: grid 4 kolom | Mobile: stack vertikal -->
            <div class="relative z-10 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6 items-end">
                <!-- Catatan Arsip -->
                <Transition name="card-swap" mode="out-in">
                    <div :key="activeNote?.id" class="relative border border-[#d3b484]/30 bg-[#1a1208]/80">
                        <div class="absolute top-2 left-2   w-4 h-4 border-t border-l border-[#d3b484]/30 pointer-events-none" />
                        <div class="absolute top-2 right-2  w-4 h-4 border-t border-r border-[#d3b484]/30 pointer-events-none" />
                        <div class="absolute bottom-2 left-2  w-4 h-4 border-b border-l border-[#d3b484]/30 pointer-events-none" />
                        <div class="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-[#d3b484]/30 pointer-events-none" />
                        <div class="p-4 flex flex-col gap-3">
                        <div class="flex items-center gap-2">
                            <span class="text-[#810000] text-xs">✦</span>
                            <span class="text-[#d3b484]/50 text-[9px] tracking-[0.3em] uppercase font-snpro">Catatan Arsip</span>
                            <div class="h-px flex-1 bg-[#d3b484]/10" />
                            <span class="text-[#d3b484]/25 text-[9px] font-snpro">{{ noteIndex + 1 }}/{{ notes.length }}</span>
                        </div>
                        <!-- Mobile: gambar lebih kecil, row layout -->
                        <div class="relative border border-[#d3b484]/20 overflow-hidden group cursor-zoom-in" :class="isTouchMode ? 'aspect-2/1' : 'aspect-3/4'" @click="noteLightboxOpen = true">
                            <img
                                v-if="activeNote?.image"
                                :src="activeNote.image"
                                :alt="activeNote.category"
                                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div class="absolute inset-0 bg-[#0d0a06]/0 group-hover:bg-[#0d0a06]/40 flex items-center justify-center transition-all duration-300">
                                <span class="opacity-0 group-hover:opacity-100 text-[#d3b484]/80 text-2xl transition-all duration-300 scale-75 group-hover:scale-100">⤢</span>
                            </div>
                            <div class="absolute bottom-0 inset-x-0 bg-linear-to-t from-[#0d0a06]/80 to-transparent px-3 py-2">
                                <p class="text-[#d3b484]/70 text-[10px] font-snpro tracking-wider">
                                    {{ activeNote?.category }}
                                </p>
                            </div>
                        </div>
                        <button
                            @click="nextNote"
                            class="relative w-full py-2 border border-[#d3b484]/25 text-[#d3b484]/50 text-[10px] tracking-[0.3em] font-snpro uppercase hover:border-[#d3b484]/50 hover:text-[#d3b484]/80 transition-all"
                        >
                            {{ noteIndex < notes.length - 1 ? 'Arsip Berikutnya →' : 'Selesai ✦' }}
                        </button>
                        </div>
                    </div>
                </Transition>
                <!-- 3 Kardus — mobile: row horizontal scroll -->
                <div class="lg:contents flex gap-4 overflow-x-auto pb-2 lg:pb-0 lg:overflow-visible">
                    <GameModeHistoryArchiveBox v-for="box in boxes" :key="box.id" :box="box" :is-active="activeBox?.id === box.id" :is-empty="isBoxEmpty(box.id)" :revealed-count="getPoolData(box.id).count.value" :total="getPoolData(box.id).total" class="shrink-0" @open="openBox" />
                </div>
            </div>
            <!-- ── Scatter area ── -->
            <div class="relative z-10 w-full max-w-7xl mx-auto border border-[#d3b484]/20 bg-[#1a1208]/50" @dragover.prevent>
                <div class="absolute top-2 left-2   w-3 h-3 border-t border-l border-[#d3b484]/30 pointer-events-none" />
                <div class="absolute top-2 right-2  w-3 h-3 border-t border-r border-[#d3b484]/30 pointer-events-none" />
                <div class="absolute bottom-2 left-2  w-3 h-3 border-b border-l border-[#d3b484]/30 pointer-events-none" />
                <div class="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-[#d3b484]/30 pointer-events-none" />
                <div class="flex items-center gap-3 px-5 py-3 border-b border-[#d3b484]/10">
                    <span class="text-[#810000] text-xs">✦</span>
                    <span class="text-[#d3b484]/50 text-[10px] tracking-[0.35em] uppercase font-snpro">
                        {{ scatterPhotos.length > 0 ? `Isi Kardus ${activeBox?.label}` : 'Klik kardus untuk membuka' }}
                    </span>
                    <div class="h-px flex-1 bg-[#d3b484]/10" />
                    <span v-if="scatterPhotos.length > 0" class="text-[#d3b484]/25 text-[9px] font-snpro">
                        {{ scatterPhotos.length }} item
                    </span>
                </div>
                <!-- Area foto bertebaran — touch: scroll horizontal jika banyak -->
                <div class="relative p-4 min-h-44" :class="isTouchMode ? 'overflow-x-auto' : ''">
                    <GameModeHistoryArchivePhotoCard
                        v-for="(photo, i) in scatterPhotos"
                        :key="photo.id"
                        :photo="photo"
                        :delay="i * 0.06"
                        :is-touch-mode="isTouchMode"
                        :is-selected="selectedPhoto?.id === photo.id"
                        @dragstart="onDragStart($event, photo)"
                        @dragend="onDragEnd"
                        @mousedown="!isTouchMode && bringToFront(photo)"
                        @tap-select="onTapSelect"
                        @zoom-request="openScatterZoom"
                    />
                    <div v-if="scatterPhotos.length === 0" class="flex items-center justify-center py-12">
                        <span class="text-[#d3b484]/15 text-xs font-snpro italic tracking-widest">Belum ada item</span>
                    </div>
                </div>
                <!-- Touch mode: tombol kirim foto yang dipilih -->
                <Transition
                    enter-active-class="transition-all duration-200"
                    enter-from-class="opacity-0 translate-y-2"
                    enter-to-class="opacity-100 translate-y-0"
                    leave-active-class="transition-all duration-150"
                    leave-from-class="opacity-100"
                    leave-to-class="opacity-0"
                >
                    <div v-if="isTouchMode && selectedPhoto" class="border-t border-[#d3b484]/10 px-4 py-3 flex items-center gap-3">
                        <!-- Preview foto dipilih -->
                        <div class="relative border border-[#d3b484]/30 bg-[#0d0a06] p-0.5">
                            <img :src="selectedPhoto.image" class="w-10 h-12 object-cover object-top block" />
                        </div>
                        <div class="flex-1 min-w-0">
                            <p class="text-[#d3b484]/50 text-[9px] font-snpro tracking-widest uppercase">Dipilih</p>
                            <p class="text-[#d3b484]/70 text-[10px] font-snpro truncate">{{ selectedPhoto.code }}</p>
                        </div>
                        <!-- Tombol kirim -->
                        <button @click="commitTouchSelection" class="relative flex items-center gap-2 px-4 py-2 border border-[#d3b484]/40 bg-[#d3b484]/10 text-[#d3b484]/70 text-[10px] tracking-[0.25em] font-snpro uppercase hover:border-[#d3b484]/70 hover:bg-[#d3b484]/20 hover:text-[#d3b484] transition-all">
                            <span class="text-[#d3b484]/50">✦</span>
                            Kirim ke Arsip
                        </button>
                        <!-- Tombol batal -->
                        <button @click="selectedPhoto = null" class="w-8 h-8 flex items-center justify-center border border-[#d3b484]/15 text-[#d3b484]/30 text-[10px] hover:border-[#d3b484]/40 hover:text-[#d3b484]/60 transition-all">
                            ✕
                        </button>
                    </div>
                </Transition>
            </div>
            <!-- ── Bottom: Catatan otomatis + Drop zone ── -->
            <div class="relative z-10 w-full max-w-7xl mx-auto flex flex-col gap-4">
                <!-- Catatan otomatis -->
                <div class="relative border border-[#d3b484]/20 bg-[#1a1208]/50">
                    <div class="absolute top-2 left-2   w-3 h-3 border-t border-l border-[#d3b484]/30 pointer-events-none" />
                    <div class="absolute top-2 right-2  w-3 h-3 border-t border-r border-[#d3b484]/30 pointer-events-none" />
                    <div class="absolute bottom-2 left-2  w-3 h-3 border-b border-l border-[#d3b484]/30 pointer-events-none" />
                    <div class="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-[#d3b484]/30 pointer-events-none" />
                    <div class="flex items-center gap-3 px-5 py-3 border-b border-[#d3b484]/10">
                        <span class="text-[#810000] text-xs">✦</span>
                        <span class="text-[#d3b484]/50 text-[10px] tracking-[0.35em] uppercase font-snpro">Catatan Redaktur</span>
                        <div class="h-px flex-1 bg-[#d3b484]/10" />
                    </div>
                    <div class="px-5 py-4">
                        <p class="font-snpro text-sm text-[#d3b484]/70 leading-relaxed">{{ autoNoteText || '—' }}</p>
                    </div>
                </div>
                <!-- Drop zone — desktop: drag target | touch: tampilkan yang sudah dikirim -->
                <div class="relative border-2 border-dashed transition-all duration-200 min-h-36" :class="isDragOver ? 'border-[#d3b484]/60 bg-[#d3b484]/5 scale-[1.01]' : 'border-[#d3b484]/20 bg-[#1a1208]/30'" @dragover="onDropZoneDragOver" @dragleave="onDropZoneDragLeave" @drop="onDrop">
                    <div class="absolute top-2 left-2   w-3 h-3 border-t border-l pointer-events-none transition-colors duration-200" :class="isDragOver ? 'border-[#d3b484]/60' : 'border-[#d3b484]/25'" />
                    <div class="absolute top-2 right-2  w-3 h-3 border-t border-r pointer-events-none transition-colors duration-200" :class="isDragOver ? 'border-[#d3b484]/60' : 'border-[#d3b484]/25'" />
                    <div class="absolute bottom-2 left-2  w-3 h-3 border-b border-l pointer-events-none transition-colors duration-200" :class="isDragOver ? 'border-[#d3b484]/60' : 'border-[#d3b484]/25'" />
                    <div class="absolute bottom-2 right-2 w-3 h-3 border-b border-r pointer-events-none transition-colors duration-200" :class="isDragOver ? 'border-[#d3b484]/60' : 'border-[#d3b484]/25'" />
                    <div class="flex items-center gap-2 px-4 pt-3 pb-2 border-b" :class="isDragOver ? 'border-[#d3b484]/20' : 'border-[#d3b484]/10'">
                        <span class="text-[#d3b484]/30 text-[10px] tracking-[0.35em] uppercase font-snpro">
                            {{ isTouchMode ? 'Arsip yang Dicocokkan' : 'Cocokkan di sini' }}
                        </span>
                        <div class="h-px flex-1 bg-[#d3b484]/10" />
                        <span v-if="!isTouchMode" class="text-[#d3b484]/20 text-[8px] font-snpro italic">drag &amp; drop</span>
                        <span v-if="droppedPhotos.length" class="text-[#d3b484]/30 text-[9px] font-snpro">
                            {{ droppedPhotos.length }} item
                        </span>
                    </div>
                    <div class="p-4 flex flex-wrap gap-4 min-h-20">
                        <Transition
                            enter-active-class="transition-all duration-200"
                            enter-from-class="opacity-0"
                            enter-to-class="opacity-100"
                            leave-active-class="transition-all duration-150"
                            leave-from-class="opacity-100"
                            leave-to-class="opacity-0"
                        >
                            <div v-if="droppedPhotos.length === 0" class="flex-1 flex flex-col items-center justify-center py-4 gap-1">
                                <span class="text-2xl select-none transition-colors duration-200" :class="isDragOver ? 'text-[#d3b484]/50' : 'text-[#d3b484]/15'">
                                    ⬡
                                </span>
                                <span class="text-[9px] font-snpro transition-colors duration-200" :class="isDragOver ? 'text-[#d3b484]/50' : 'text-[#d3b484]/20'">
                                    {{ isTouchMode ? 'Pilih foto lalu ketuk "Kirim ke Arsip"' : isDragOver ? 'Lepaskan item di sini' : 'Seret item dari area scatter' }}
                                </span>
                            </div>
                        </Transition>
                        <!-- Item yang sudah di-drop / dikirim -->
                        <div v-for="photo in droppedPhotos" :key="'dropped-' + photo.id" class="relative group" :style="{ transform: `rotate(${photo.dropRot}deg)` }">
                            <div class="relative border-2 bg-[#0d0a06] p-1 pb-6 shadow-lg" :class="photo.category === activeNote?.category ? 'border-green-600/50 ring-1 ring-green-600/30' : 'border-[#810000]/50 ring-1 ring-[#810000]/20'">
                                <div class="absolute top-0.5 left-0.5   w-1.5 h-1.5 border-t border-l border-[#d3b484]/40 z-10 pointer-events-none" />
                                <div class="absolute top-0.5 right-0.5  w-1.5 h-1.5 border-t border-r border-[#d3b484]/40 z-10 pointer-events-none" />
                                <div class="absolute bottom-0.5 left-0.5  w-1.5 h-1.5 border-b border-l border-[#d3b484]/40 z-10 pointer-events-none" />
                                <div class="absolute bottom-0.5 right-0.5 w-1.5 h-1.5 border-b border-r border-[#d3b484]/40 z-10 pointer-events-none" />
                                <img
                                    :src="photo.image"
                                    :alt="photo.category"
                                    class="w-16 h-20 object-cover object-top select-none block"
                                    draggable="false"
                                />
                                <div class="absolute top-0.5 right-0.5 w-4 h-4 flex items-center justify-center text-[8px] z-20" :class="photo.category === activeNote?.category ? 'bg-green-900/80 text-green-400' : 'bg-[#810000]/80 text-[#d3b484]/70'">
                                    {{ photo.category === activeNote?.category ? '✓' : '✗' }}
                                </div>
                                <p class="absolute bottom-1 left-0 right-0 text-center text-[7px] text-[#d3b484]/35 font-snpro leading-none">
                                    {{ photo.code }}
                                </p>
                            </div>
                            <button @click="removeDropped(photo)" class="absolute -top-2 -right-2 w-5 h-5 border border-[#810000]/60 bg-[#810000]/40 text-[#d3b484]/70 text-[9px] hidden group-hover:flex items-center justify-center hover:bg-[#810000]/70 transition-all z-20">
                                ✕
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- Lightbox: catatan arsip -->
    <LightBox :items="noteLightboxItems" :index="noteLightboxOpen ? 0 : -1" @update:index="val => { if (val < 0) noteLightboxOpen = false }" />
    <!-- Lightbox: foto scatter (zoom gambar di box) -->
    <LightBox :items="scatterLightboxItems" v-model:index="scatterLightboxIndex"/>
</template>

<style scoped>
.card-swap-enter-active { 
    animation: newCard 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); 
}

.card-swap-leave-active { 
    animation: leaveCard 0.3s ease forwards; 
}

@keyframes newCard { 
    from { 
        transform: translateY(10px); 
        opacity: 0; 
    } 
    to { 
        transform: translateY(0); 
        opacity: 1; 
    } 
}

@keyframes leaveCard { 
    from { 
        opacity: 1; 
    } 
    to { 
        opacity: 0; 
    } 
}
</style>