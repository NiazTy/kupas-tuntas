<template>
    <!-- Hero Mulai Belajar -->
    <section id="hero-belajar" class="relative flex flex-col items-center justify-center w-full min-h-screen text-center overflow-hidden">
        <Ornament3/>
        <!-- Nomor halaman -->
        <div class="absolute top-8 right-16 flex items-center gap-3 z-20">
            <div class="h-px w-10 bg-[#d3b484]/30"></div>
            <span class="text-[#d3b484]/40 text-[10px] tracking-[0.4em] font-snpro uppercase">Ruang Belajar</span>
        </div>
        <div class="relative z-20 flex flex-col items-center gap-6 px-6 md:px-0">
            <!-- Label atas -->
            <div class="flex items-center gap-3">
                <div class="h-px w-8 bg-[#d3b484]/40"></div>
                <span class="text-[#d3b484]/50 text-[10px] tracking-[0.4em] uppercase font-snpro">✦ Selamat Datang ✦</span>
                <div class="h-px w-8 bg-[#d3b484]/40"></div>
            </div>
            <!-- Logo -->
            <img src="~/assets/icons/kupas-tuntas-transparent.svg" alt="KUPAS TUNTAS" class="object-contain h-40 md:h-52 pointer-events-none drop-shadow-lg" />
            <!-- Garis pemisah -->
            <div class="flex items-center gap-3">
                <div class="h-px w-16 bg-[#810000]/70"></div>
                <div class="h-1 w-1 rounded-full bg-[#d3b484]/40"></div>
                <div class="h-px w-8 bg-[#d3b484]/20"></div>
            </div>
            <!-- Deskripsi -->
            <div class="border-l-2 border-[#810000]/60 pl-5 max-w-2xl text-left">
                <p class="text-sm sm:text-base text-[#d3b484]/70 font-snpro leading-relaxed">
                    Di halaman ini, kamu bisa <span class="text-[#d3b484] font-semibold">menonton video pembelajaran</span> dan
                    menjelajahi <span class="text-[#d3b484] font-semibold">perpustakaan mini sejarah</span>.
                    Pelan-pelan pahami ceritanya, baru nanti kita kupas tuntas lewat kuis.
                </p>
            </div>
            <!-- CTA -->
            <div class="flex flex-col items-center gap-3 sm:flex-row mt-2">
                <a href="#video-belajar"
                class="relative px-7 py-2.5 text-xs sm:text-sm font-snpro tracking-widest uppercase text-[#0d0a06] bg-[#d3b484] hover:bg-[#c4a070] transition-all group">
                    <span class="absolute inset-0 ring-1 ring-inset ring-[#d3b484]/30 group-hover:ring-[#d3b484]/60 transition-all"></span>
                    Lihat Video Pembelajaran
                </a>
                <a href="#perpustakaan-mini"
                class="relative px-7 py-2.5 text-xs sm:text-sm font-snpro tracking-widest uppercase text-[#d3b484] border border-[#d3b484]/40 hover:border-[#d3b484]/80 hover:bg-[#d3b484]/10 transition-all group">
                    <span class="absolute inset-0 ring-1 ring-inset ring-[#d3b484]/10 group-hover:ring-[#d3b484]/30 transition-all"></span>
                    Jelajahi Perpustakaan Mini
                </a>
            </div>
            <!-- Ornamen bawah -->
            <div class="flex gap-1 text-[#d3b484]/30 text-xs mt-2">
                <span>✦</span><span>✦</span><span>✦</span>
            </div>
        </div>
    </section>
    <!-- Video Pembelajaran Section -->
    <section id="video-belajar" class="relative min-h-screen overflow-hidden -mt-20 md:mt-0">
        <Ornament3/>
        <div class="relative z-20 flex flex-col items-center w-full gap-10 px-6 py-24 lg:px-16">
            <!-- Heading -->
            <div class="w-full max-w-5xl flex flex-col gap-3">
                <div class="flex items-center gap-3">
                    <div class="h-px w-8 bg-[#810000]/60"></div>
                    <span class="text-[#d3b484]/50 text-[10px] tracking-[0.4em] uppercase font-snpro">✦ Ruang Tontonan</span>
                </div>
                <h2 class="text-4xl sm:text-5xl font-snpro font-bold font-display text-[#d3b484] leading-tight">
                    Video Pembelajaran <span class="text-[#810000]">Sejarah</span>
                </h2>
                <div class="flex items-center gap-3">
                    <div class="h-px w-16 bg-[#810000]/70"></div>
                    <div class="h-1 w-1 rounded-full bg-[#d3b484]/40"></div>
                    <div class="h-px w-8 bg-[#d3b484]/20"></div>
                </div>
                <div class="border-l-2 border-[#810000]/60 pl-5 mt-2">
                    <p class="text-[#d3b484]/70 text-sm sm:text-base font-snpro leading-relaxed max-w-3xl">
                        Mulai dari penjajahan, pergerakan nasional, hingga kemerdekaan Indonesia —
                        video-video ini membantu kamu memahami <span class="text-[#d3b484] font-semibold">alur cerita besar sejarah bangsa</span>
                        dengan cara yang ringan, visual, dan mudah diikuti.
                    </p>
                </div>
            </div>
            <div class="w-full max-w-5xl">
                <div class="relative">
                    <div class="absolute inset-0 translate-x-3 translate-y-3 border border-[#d3b484]/15"></div>
                    <div class="relative border border-[#d3b484]/30 p-3 bg-[#0d0a06]/60">
                        <div class="absolute top-2 left-2 w-5 h-5 border-t border-l border-[#d3b484]/40"></div>
                        <div class="absolute top-2 right-2 w-5 h-5 border-t border-r border-[#d3b484]/40"></div>
                        <div class="absolute bottom-2 left-2 w-5 h-5 border-b border-l border-[#d3b484]/40"></div>
                        <div class="absolute bottom-2 right-2 w-5 h-5 border-b border-r border-[#d3b484]/40"></div>
                        <div class="relative w-full overflow-hidden aspect-video">
                            <iframe
                                class="absolute inset-0 w-full h-full"
                                src="https://www.youtube.com/embed/f33q99zfu2I?si=VyqiWp8VJ7HavBrT"
                                loading="lazy"
                                title="Video Pembelajaran Sejarah"
                                frameborder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                referrerpolicy="strict-origin-when-cross-origin"
                                allowfullscreen>
                            </iframe>
                        </div>
                    </div>
                </div>
                <div class="flex items-center justify-center gap-3 mt-4">
                    <div class="h-px w-8 bg-[#d3b484]/20"></div>
                    <p class="text-[9px] italic text-center text-[#d3b484]/40 font-snpro tracking-wider">
                        Video diambil dari konten edukatif YouTube. Tonton dulu dengan santai.
                    </p>
                    <div class="h-px w-8 bg-[#d3b484]/20"></div>
                </div>
            </div>
            <!-- Marquee video -->
            <div class="w-full max-w-5xl mt-2">
                <div id="video-marquee-container" class="bg-[#1a0a08]/80 border border-[#d3b484]/20 py-8 overflow-hidden relative">
                    <div class="absolute top-2 left-2 w-4 h-4 border-t border-l border-[#d3b484]/30"></div>
                    <div class="absolute top-2 right-2 w-4 h-4 border-t border-r border-[#d3b484]/30"></div>
                    <div class="absolute bottom-2 left-2 w-4 h-4 border-b border-l border-[#d3b484]/30"></div>
                    <div class="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-[#d3b484]/30"></div>
                    <div class="marquee-track">
                        <a v-for="(video, index) in marqueeVideos" :key="`${video.title}-${index}`" :href="video.url" target="_blank" class="relative block w-64 shrink-0 p-5 bg-[#0d0a06] border border-[#d3b484]/25 hover:border-[#d3b484]/60 hover:-translate-y-1 transition-all duration-300 group">
                            <p class="mb-2 text-[9px] uppercase tracking-[0.3em] text-[#810000] font-snpro">
                                ✦ {{ video.tag }}
                            </p>
                            <div class="h-px w-full bg-[#d3b484]/10 mb-2"></div>
                            <h3 class="mb-2 text-sm font-display text-[#d3b484]">
                                {{ video.title }}
                            </h3>
                            <p class="mb-3 text-[11px] text-[#d3b484]/55 font-snpro">
                                {{ video.desc }}
                            </p>
                            <span class="text-[10px] uppercase text-[#d3b484]/50">
                                Tonton sekarang ↗
                            </span>
                        </a>
                    </div>
                </div>
                <p class="mt-3 text-[10px] text-center font-snpro text-[#d3b484]/40 tracking-wider">
                    Sentuh kartu untuk berhenti · Ketuk untuk membuka di YouTube
                </p>
            </div>
            <div class="flex flex-col items-center gap-3 text-center max-w-3xl">
                <div class="flex items-center gap-3">
                    <div class="h-px w-8 bg-[#d3b484]/20"></div>
                    <span class="text-[#d3b484]/30 text-xs font-snpro">✦</span>
                    <div class="h-px w-8 bg-[#d3b484]/20"></div>
                </div>
                <p class="text-[#d3b484]/60 text-sm sm:text-base font-snpro leading-relaxed">
                    Setelah nonton beberapa video, lanjut ke <span class="text-[#d3b484]">perpustakaan mini</span>
                    untuk membaca ringkasan dan kisah singkat pahlawan dan peristiwa penting.
                </p>
            </div>
        </div>
    </section>
    <!-- Perpustakaan Mini Section -->
    <section id="perpustakaan-mini" class="relative min-h-screen overflow-hidden bg-[#0d0a06]">
        <Ornament4/>
        <div class="relative z-20 flex flex-col items-center w-full gap-10 px-6 py-24 lg:px-16">
            <!-- Heading -->
            <div class="w-full max-w-5xl flex flex-col gap-3">
                <div class="flex items-center gap-3">
                    <div class="h-px w-8 bg-[#810000]/60"></div>
                    <span class="text-[#d3b484]/50 text-[10px] tracking-[0.4em] uppercase font-snpro">✦ Arsip Pengetahuan</span>
                </div>
                <h2 class="text-4xl sm:text-5xl font-snpro font-bold font-display text-[#d3b484] leading-tight">
                    Perpustakaan Mini <span class="text-[#810000]">Sejarah</span>
                </h2>
                <div class="flex items-center gap-3">
                    <div class="h-px w-16 bg-[#810000]/70"></div>
                    <div class="h-1 w-1 rounded-full bg-[#d3b484]/40"></div>
                    <div class="h-px w-8 bg-[#d3b484]/20"></div>
                </div>
                <div class="border-l-2 border-[#810000]/60 pl-5 mt-2">
                    <p class="text-[#d3b484]/70 text-sm sm:text-base font-snpro leading-relaxed max-w-3xl">
                        Di perpustakaan mini ini, kamu bisa membaca <span class="text-[#d3b484] font-semibold">ringkasan singkat</span>
                        tentang tokoh, peristiwa, dan konsep penting dalam sejarah Indonesia.
                        Anggap saja ini "catatan kecil" sebelum kamu diuji di permainan Kupas Tuntas.
                    </p>
                </div>
            </div>
            <!-- Grid Kartu -->
            <div class="grid w-full max-w-5xl gap-6 md:grid-cols-3">
                <article v-for="card in cards" :key="card.id" class="relative flex flex-col h-full p-6 bg-[#1a1208]/60 border border-[#d3b484]/20 shadow-lg group hover:border-[#d3b484]/50 transition-all duration-300">
                    <div class="absolute top-2 left-2 w-4 h-4 border-t border-l border-[#d3b484]/30 group-hover:border-[#d3b484]/60"></div>
                    <div class="absolute top-2 right-2 w-4 h-4 border-t border-r border-[#d3b484]/30 group-hover:border-[#d3b484]/60"></div>
                    <div class="absolute bottom-2 left-2 w-4 h-4 border-b border-l border-[#d3b484]/30 group-hover:border-[#d3b484]/60"></div>
                    <div class="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-[#d3b484]/30 group-hover:border-[#d3b484]/60"></div>
                    <div class="flex items-center gap-2 mb-3">
                        <span class="text-[#810000] text-xs">✦</span>
                        <h3 class="text-base font-display text-[#d3b484]">
                            {{ card.title }}
                        </h3>
                    </div>
                    <div class="h-px w-full bg-[#d3b484]/15 mb-3"></div>
                    <p class="flex-1 mb-4 text-xs text-[#d3b484]/60 font-snpro leading-relaxed">
                        {{ card.desc }}
                    </p>
                    <button class="relative hover:cursor-pointer self-start px-5 py-2 text-[10px] font-snpro tracking-widest uppercase text-[#0d0a06] bg-[#d3b484] hover:bg-[#c4a070]" @click="openRingkasan(card.id)">
                        Baca Ringkasan
                    </button>
                </article>
            </div>
            <!-- Ajakan ke Tebak -->
            <div class="flex flex-col items-center gap-5 mt-4 text-center">
                <div class="flex items-center gap-3">
                    <div class="h-px w-12 bg-[#d3b484]/20"></div>
                    <span class="text-[#d3b484]/30 text-xs font-snpro">✦</span>
                    <div class="h-px w-12 bg-[#d3b484]/20"></div>
                </div>
                <p class="max-w-2xl text-sm sm:text-base text-[#d3b484]/70 font-snpro leading-relaxed">
                    Sudah merasa lebih paham jalan cerita sejarah Indonesia?
                    Saatnya uji pemahamanmu di kuis <span class="text-[#d3b484] font-semibold">Kupas Tuntas</span>!
                </p>
                <div class="flex flex-col gap-3 sm:flex-row">
                    <a href="/" class="relative px-7 py-2.5 text-xs sm:text-sm font-snpro tracking-widest uppercase text-[#0d0a06] bg-[#d3b484] hover:bg-[#c4a070] transition-all group">
                        <span class="absolute inset-0 ring-1 ring-inset ring-[#d3b484]/30 group-hover:ring-[#d3b484]/60 transition-all"></span>
                        Mulai Tebak Sekarang
                    </a>
                    <a href="#video-belajar" class="relative px-7 py-2.5 text-xs sm:text-sm font-snpro tracking-widest uppercase text-[#d3b484] border border-[#d3b484]/40 hover:border-[#d3b484]/80 hover:bg-[#d3b484]/10 transition-all group">
                        <span class="absolute inset-0 ring-1 ring-inset ring-[#d3b484]/10 group-hover:ring-[#d3b484]/30 transition-all"></span>
                        Kembali Nonton Video
                    </a>
                </div>
            </div>
        </div>
    </section>
    <!-- Modal Ringkasan -->
    <div v-if="modalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-[#0d0a06]/80 backdrop-blur-sm" @click.self="closeRingkasan">
        <div class="relative w-full max-w-lg mx-4">
            <!-- Shadow offset -->
            <div class="absolute inset-0 translate-x-2 translate-y-2 border border-[#d3b484]/15"></div>
            <!-- Modal box -->
            <div class="relative border border-[#d3b484]/30 bg-[#1a1208] p-8">
                <!-- Ornamen sudut -->
                <div class="absolute top-3 left-3 w-5 h-5 border-t border-l border-[#d3b484]/40"></div>
                <div class="absolute top-3 right-3 w-5 h-5 border-t border-r border-[#d3b484]/40"></div>
                <div class="absolute bottom-3 left-3 w-5 h-5 border-b border-l border-[#d3b484]/40"></div>
                <div class="absolute bottom-3 right-3 w-5 h-5 border-b border-r border-[#d3b484]/40"></div>
                <!-- Tombol close -->
                <button @click="closeRingkasan" class="absolute hover:cursor-pointer top-4 right-4 text-[#d3b484]/40 hover:text-[#d3b484] transition-colors text-sm font-snpro">✕</button>
                <div class="space-y-4">
                    <!-- Label -->
                    <div class="flex items-center gap-2">
                        <span class="text-[#810000] text-xs">✦</span>
                        <span class="text-[#d3b484]/50 text-[10px] tracking-[0.3em] uppercase font-snpro">Ringkasan Arsip</span>
                    </div>
                    <div class="h-px w-full bg-[#d3b484]/15"></div>
                    <h3 class="text-xl font-display text-[#d3b484]">
                        {{ modalTitle }}
                    </h3>
                    <div class="border-l-2 border-[#810000]/60 pl-4">
                        <p class="text-xs text-[#d3b484]/65 font-snpro leading-relaxed whitespace-pre-line">
                            {{ modalBody }}
                        </p>
                    </div>
                    <div class="flex justify-end mt-4">
                        <button @click="closeRingkasan" class="hover:cursor-pointer relative px-6 py-2 text-[10px] font-snpro tracking-widest uppercase text-[#0d0a06] bg-[#d3b484] hover:bg-[#c4a070] transition-all">
                            Mengerti
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { historyArticleCards, historyArticle } from "~/data/cards/article"
import { historyVideoCards } from "~/data/cards/video"

import type { RingkasanContent } from "~/data/types/article"
import type { VideoItem } from "~/data/types/video"

usePageMusic(false)

const videoData: VideoItem[] = historyVideoCards

const cards = historyArticleCards
const ringkasanData: Record<string, RingkasanContent> = historyArticle

const marqueeVideos = computed(() => [...videoData, ...videoData, ...videoData, ...videoData])

const modalOpen = ref(false)
const modalTitle = ref("")
const modalBody = ref("")

const openRingkasan = (id: string) => {
    const data = ringkasanData[id]
    if (!data) return

    modalTitle.value = data.title
    modalBody.value = data.body
    modalOpen.value = true
}

const closeRingkasan = () => {
    modalOpen.value = false
}

</script>

<style scoped>
.marquee-track {
    display: inline-flex;
    gap: 1rem;
    animation: scroll-marquee 30s linear infinite;
    will-change: transform;
}

.marquee-track:hover {
    animation-play-state: paused;
}

@keyframes scroll-marquee {
    0% {
        transform: translateX(0);
    }
    100% {
        transform: translateX(-50%);
    }
}

@media (max-width: 768px) {
    #video-marquee-container {
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
    }
    .marquee-track {
        animation: none;
    }
}
</style>