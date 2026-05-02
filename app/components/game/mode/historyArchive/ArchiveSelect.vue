<script setup lang="ts">
import { HistoryArchiveNotes } from "~/data/game/historyArchive"

import type { NoteAssetItem } from "~/data/types/cards"

const descriptions: Record<string, string> = {
    "Serangan Umum 1 Maret": "Serangan besar-besaran TNI ke Yogyakarta pada 1 Maret 1949 yang membuktikan eksistensi Indonesia di mata dunia.",
    "Bandung Lautan Api": "Peristiwa pembakaran Bandung Selatan oleh rakyat Indonesia pada 23 Maret 1946 agar tidak jatuh ke tangan Sekutu.",
}

const notes = HistoryArchiveNotes as NoteAssetItem[]

const emit = defineEmits<{
    select: [note: NoteAssetItem]
}>()

const hoveredId = ref<string | null>(null)
</script>

<template>
    <div class="relative min-h-screen bg-[#0d0a06] flex flex-col items-center justify-center px-6 py-16 overflow-hidden">
        <Ornament3 />
        <!-- Header -->
        <div class="relative z-10 text-center mb-12 flex flex-col items-center gap-3">
            <div class="flex items-center gap-4">
                <div class="h-px w-16 bg-[#d3b484]/20" />
                <span class="text-[#810000] text-sm">✦</span>
                <div class="h-px w-16 bg-[#d3b484]/20" />
            </div>
            <h1 class="text-[#d3b484]/90 font-display text-2xl lg:text-3xl tracking-[0.15em]">
                Pilih Arsip
            </h1>
            <p class="text-[#d3b484]/35 text-[10px] tracking-[0.4em] font-snpro uppercase">
                Hover untuk melihat deskripsi · Klik untuk mulai
            </p>
        </div>
        <!-- Grid level -->
        <div class="relative z-10 w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <button
                v-for="(note, i) in notes"
                :key="note.id"
                class="group relative text-left border transition-all duration-300 focus:outline-none"
                :class="hoveredId === note.id
                ? 'border-[#d3b484]/60 bg-[#1a1208]/90 -translate-y-1 shadow-[0_8px_32px_rgba(0,0,0,0.6)]'
                : 'border-[#d3b484]/20 bg-[#1a1208]/50 hover:border-[#d3b484]/50 hover:-translate-y-0.5'"
                @mouseenter="hoveredId = note.id"
                @mouseleave="hoveredId = null"
                @focus="hoveredId = note.id"
                @blur="hoveredId = null"
                @click="emit('select', note)"
            >
                <!-- Ornamen sudut kartu -->
                <div
                    class="absolute top-2 left-2 w-3 h-3 border-t border-l pointer-events-none transition-colors duration-300"
                    :class="hoveredId === note.id ? 'border-[#d3b484]/70' : 'border-[#d3b484]/30'"
                />
                <div
                    class="absolute top-2 right-2 w-3 h-3 border-t border-r pointer-events-none transition-colors duration-300"
                    :class="hoveredId === note.id ? 'border-[#d3b484]/70' : 'border-[#d3b484]/30'"
                />
                <div
                    class="absolute bottom-2 left-2 w-3 h-3 border-b border-l pointer-events-none transition-colors duration-300"
                    :class="hoveredId === note.id ? 'border-[#d3b484]/70' : 'border-[#d3b484]/30'"
                />
                <div
                    class="absolute bottom-2 right-2 w-3 h-3 border-b border-r pointer-events-none transition-colors duration-300"
                    :class="hoveredId === note.id ? 'border-[#d3b484]/70' : 'border-[#d3b484]/30'"
                />
                <!-- Gambar arsip -->
                <div class="relative overflow-hidden border-b border-[#d3b484]/10 aspect-4/3">
                    <img
                        :src="note.image"
                        :alt="note.category"
                        class="w-full h-full object-cover object-top transition-transform duration-500"
                        :class="hoveredId === note.id ? 'scale-105' : 'scale-100'"
                    />
                    <!-- Overlay gelap -->
                    <div
                        class="absolute inset-0 bg-linear-to-t from-[#0d0a06] via-[#0d0a06]/30 to-transparent transition-opacity duration-300"
                        :class="hoveredId === note.id ? 'opacity-80' : 'opacity-50'"
                    />
                    <!-- Nomor level -->
                    <div class="absolute top-3 left-3 flex items-center gap-1.5">
                        <span
                            class="text-[8px] tracking-[0.4em] font-snpro uppercase transition-colors duration-300"
                            :class="hoveredId === note.id ? 'text-[#d3b484]/80' : 'text-[#d3b484]/40'"
                        >
                            Arsip {{ String(i + 1).padStart(2, '0') }}
                        </span>
                    </div>
                    <!-- Glow merah saat hover -->
                    <div
                        class="absolute inset-0 bg-[#810000]/20 transition-opacity duration-300 pointer-events-none"
                        :class="hoveredId === note.id ? 'opacity-100' : 'opacity-0'"
                    />
                </div>
                <!-- Konten teks -->
                <div class="p-4 flex flex-col gap-2">
                    <!-- Nama kategori -->
                    <div class="flex items-start gap-2">
                        <span class="mt-0.5 text-[10px] transition-colors duration-300 shrink-0" :class="hoveredId === note.id ? 'text-[#810000]' : 'text-[#810000]/60'">
                            ✦
                        </span>
                        <h2 class="font-snpro text-sm leading-snug transition-colors duration-300" :class="hoveredId === note.id ? 'text-[#d3b484]/95' : 'text-[#d3b484]/60'">
                            {{ note.category }}
                        </h2>
                    </div>
                    <!-- Deskripsi singkat — muncul saat hover -->
                    <Transition
                        enter-active-class="transition-all duration-300"
                        enter-from-class="opacity-0 translate-y-1"
                        enter-to-class="opacity-100 translate-y-0"
                        leave-active-class="transition-all duration-200"
                        leave-from-class="opacity-100"
                        leave-to-class="opacity-0"
                    >
                        <p
                            v-if="hoveredId === note.id"
                            class="text-[#d3b484]/45 text-[9px] font-snpro leading-relaxed"
                        >
                            {{ descriptions[note.category] ?? 'Klik untuk mulai menyelidiki arsip ini.' }}
                        </p>
                    </Transition>

                    <!-- CTA -->
                    <div
                        class="flex items-center gap-2 mt-1 transition-all duration-300"
                        :class="hoveredId === note.id ? 'opacity-100' : 'opacity-0'"
                    >
                        <div class="h-px flex-1 bg-[#d3b484]/15" />
                        <span class="text-[#d3b484]/50 text-[8px] tracking-[0.35em] font-snpro uppercase">
                            Mulai Selidiki →
                        </span>
                    </div>
                </div>
            </button>
        </div>
        <!-- Hint keyboard / mobile -->
        <div class="relative z-10 mt-10 flex items-center gap-3">
            <div class="h-px w-8 bg-[#d3b484]/15" />
            <span class="text-[#d3b484]/20 text-[8px] tracking-[0.4em] font-snpro uppercase">
                {{ notes.length }} arsip tersedia
            </span>
            <div class="h-px w-8 bg-[#d3b484]/15" />
        </div>
    </div>
</template>