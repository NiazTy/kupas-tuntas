<script setup lang="ts">
import { ref, computed, watch, nextTick } from "vue"
import { ArrowLeft, Search, ExternalLink, ChevronLeft, ChevronRight, X, ImageOff } from "lucide-vue-next"
import { cards } from "~/data/cards/imageGuess"

// Aktifkan musik latar
usePageMusic(true)

// Metadata halaman
useHead({
  title: "Kredit Aset & Tim Pengembang - Kupas Tuntas",
  meta: [
    {
      name: "description",
      content: "Halaman Apresiasi dan Kredit untuk para pengembang serta sumber gambar pahlawan nasional Indonesia yang digunakan dalam permainan Kupas Tuntas."
    }
  ]
})

// State untuk input pencarian
const searchQuery = ref("")
const searchInputRef = ref<HTMLInputElement | null>(null)

// State untuk paginasi
const currentPage = ref(1)
const itemsPerPage = 12

// State untuk gambar yang gagal dimuat (fallback)
const brokenImages = ref<Set<string>>(new Set())
const markImageBroken = (id: string | number) => {
  brokenImages.value.add(String(id))
}

// Filter kartu berdasarkan pencarian
const filteredCards = computed(() => {
  if (!searchQuery.value.trim()) return cards
  const query = searchQuery.value.toLowerCase().trim()
  return cards.filter(card => card.name.toLowerCase().includes(query))
})

// Reset ke halaman 1 ketika pencarian berubah
watch(searchQuery, () => {
  currentPage.value = 1
})

// Total Halaman
const totalPages = computed(() => {
  return Math.max(1, Math.ceil(filteredCards.value.length / itemsPerPage))
})

// Kartu yang ditampilkan per halaman
const paginatedCards = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredCards.value.slice(start, end)
})

// Nomor-nomor halaman yang ditampilkan pada paginator (maks 5 tombol, dengan ellipsis)
const pageNumbers = computed(() => {
  const total = totalPages.value
  const current = currentPage.value
  const delta = 1
  const range: (number | "...")[] = []

  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || (i >= current - delta && i <= current + delta)) {
      range.push(i)
    } else if (range[range.length - 1] !== "...") {
      range.push("...")
    }
  }
  return range
})

// Navigasi halaman
const goToPage = (page: number) => {
  if (page < 1 || page > totalPages.value || page === currentPage.value) return
  currentPage.value = page
  scrollToCredits()
}

const nextPage = () => goToPage(currentPage.value + 1)
const prevPage = () => goToPage(currentPage.value - 1)

const scrollToCredits = () => {
  const el = document.getElementById("kredit-gambar")
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" })
  }
}

const clearSearch = () => {
  searchQuery.value = ""
  nextTick(() => searchInputRef.value?.focus())
}

// Helper untuk mengambil domain dari URL gambar
const getDomain = (url: string) => {
  try {
    const domain = new URL(url).hostname
    return domain.replace("www.", "")
  } catch (e) {
    return "Sumber Gambar"
  }
}
</script>

<template>
  <div class="relative min-h-screen bg-[#0d0a06] text-[#d3b484] overflow-hidden font-snpro">
    <Ornament4 />

    <!-- Header Bar: back button + page label dalam satu baris agar tidak tumpang tindih di mobile -->
    <div class="sticky top-0 z-20 flex items-center justify-between px-4 sm:px-8 py-4 sm:py-6 bg-gradient-to-b from-[#0d0a06] via-[#0d0a06]/90 to-transparent backdrop-blur-sm">
      <NuxtLink
        to="/"
        class="flex items-center gap-2 text-[#d3b484]/60 hover:text-[#d3b484] focus-visible:text-[#d3b484] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#d3b484]/50 rounded-sm px-1 -mx-1 text-[11px] sm:text-xs font-semibold tracking-wider transition group"
      >
        <ArrowLeft class="w-4 h-4 group-hover:-translate-x-1 transition-transform shrink-0" />
        <span class="hidden xs:inline">KEMBALI KE BERANDA</span>
        <span class="xs:hidden">KEMBALI</span>
      </NuxtLink>

      <div class="flex items-center gap-2 sm:gap-3 shrink-0">
        <div class="h-px w-6 sm:w-10 bg-[#d3b484]/30"></div>
        <span class="text-[#d3b484]/40 text-[9px] sm:text-[10px] tracking-[0.3em] sm:tracking-[0.4em] font-snpro uppercase whitespace-nowrap">Hal. 04</span>
      </div>
    </div>

    <div class="relative z-10 w-full max-w-5xl px-6 py-12 sm:py-16 mx-auto flex flex-col gap-16">

      <!-- HEADER HALAMAN -->
      <div class="flex flex-col items-center text-center gap-4 mt-4">
        <div class="flex items-center gap-3">
          <div class="h-px w-8 bg-[#d3b484]/40"></div>
          <span class="text-[#d3b484]/50 text-[10px] tracking-[0.4em] uppercase font-snpro">✦ Apresiasi & Dedikasi ✦</span>
          <div class="h-px w-8 bg-[#d3b484]/40"></div>
        </div>
        <h1 class="text-3xl sm:text-5xl font-bold font-display text-[#d3b484] leading-tight">
          Orang di Balik Layar & <span class="text-[#810000]">Kredit</span>
        </h1>
        <div class="flex items-center gap-3">
          <div class="h-px w-16 bg-[#810000]/70"></div>
          <div class="h-1 w-1 rounded-full bg-[#d3b484]/40"></div>
          <div class="h-px w-8 bg-[#d3b484]/20"></div>
        </div>
      </div>

      <!-- TIM PENGEMBANG -->
      <section id="tim-pengembang" class="relative">
        <div class="absolute inset-0 translate-x-3 translate-y-3 border border-[#d3b484]/15"></div>
        <div class="relative border border-[#d3b484]/30 p-6 sm:p-8 bg-[#1a1208]/60 backdrop-blur-sm">
          <!-- Ornamen sudut bingkai -->
          <div class="absolute top-2 left-2 w-5 h-5 border-t border-l border-[#d3b484]/40"></div>
          <div class="absolute top-2 right-2 w-5 h-5 border-t border-r border-[#d3b484]/40"></div>
          <div class="absolute bottom-2 left-2 w-5 h-5 border-b border-l border-[#d3b484]/40"></div>
          <div class="absolute bottom-2 right-2 w-5 h-5 border-b border-r border-[#d3b484]/40"></div>

          <h2 class="text-xl font-bold font-display tracking-widest text-[#d3b484] text-center mb-8 uppercase">
            ✦ Tim Pengembang ✦
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
            <!-- Developer -->
            <div class="flex flex-col sm:flex-row items-center sm:items-start gap-6 group">
              <div class="relative w-36 h-36 shrink-0 border border-[#d3b484]/30 bg-[#0d0a06] p-1.5 shadow-md">
                <div class="absolute inset-0 translate-x-1.5 translate-y-1.5 border border-[#d3b484]/10"></div>
                <div class="w-full h-full rounded-full overflow-hidden border border-[#d3b484]/10 bg-[#0d0a06]">
                  <img
                    src="/pictures/miscellaneous/john-doe-1.png"
                    alt="Foto John Doe, Developer Utama"
                    class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-105"
                    loading="lazy"
                  />
                </div>
              </div>
              <div class="flex flex-col gap-2 text-center sm:text-left">
                <span class="text-[9px] uppercase tracking-[0.35em] text-[#810000] font-bold">Developer Utama</span>
                <h3 class="text-lg font-bold font-display text-[#d3b484]">John Doe</h3>
                <div class="h-px w-12 bg-[#810000]/60 mx-auto sm:mx-0"></div>
                <p class="text-xs text-[#d3b484]/70 leading-relaxed font-snpro mt-2">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
              </div>
            </div>

            <!-- Designer -->
            <div class="flex flex-col sm:flex-row items-center sm:items-start gap-6 group">
              <div class="relative w-36 h-36 shrink-0 border border-[#d3b484]/30 bg-[#0d0a06] p-1.5 shadow-md">
                <div class="absolute inset-0 translate-x-1.5 translate-y-1.5 border border-[#d3b484]/10"></div>
                <div class="w-full h-full rounded-full overflow-hidden border border-[#d3b484]/10 bg-[#0d0a06]">
                  <img
                    src="/pictures/miscellaneous/john-doe-2.png"
                    alt="Foto John Doe, Desainer UI/UX & Konten"
                    class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-105"
                    loading="lazy"
                  />
                </div>
              </div>
              <div class="flex flex-col gap-2 text-center sm:text-left">
                <span class="text-[9px] uppercase tracking-[0.35em] text-[#810000] font-bold">Desainer UI/UX & Konten</span>
                <h3 class="text-lg font-bold font-display text-[#d3b484]">John Doe</h3>
                <div class="h-px w-12 bg-[#810000]/60 mx-auto sm:mx-0"></div>
                <p class="text-xs text-[#d3b484]/70 leading-relaxed font-snpro mt-2">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- KREDIT GAMBAR -->
      <section id="kredit-gambar" class="flex flex-col gap-8 scroll-mt-24">
        <!-- Sub-Header & Search -->
        <div class="flex flex-col gap-5 border-b border-[#d3b484]/10 pb-6">
          <div class="flex flex-col gap-2">
            <div class="flex items-center gap-2">
              <span class="text-[#810000] text-xs">✦</span>
              <h2 class="text-xl font-bold font-display tracking-widest text-[#d3b484] uppercase">Kredit Aset Gambar</h2>
            </div>
            <p class="text-xs text-[#d3b484]/60 font-snpro leading-relaxed max-w-2xl">
              Kami sangat mengapresiasi dan menghormati hak cipta pembuat gambar. Berikut adalah daftar sumber gambar pahlawan yang digunakan dalam kuis tebak gambar.
            </p>
          </div>
          <!-- Input Search: full width, di bawah teks -->
          <div class="flex flex-col gap-1.5 w-full">
            <div class="relative flex items-center">
              <div class="absolute left-0 w-10 h-full flex items-center justify-center pointer-events-none text-[#d3b484]/40">
                <Search class="w-4 h-4" />
              </div>
              <input
                ref="searchInputRef"
                v-model="searchQuery"
                type="text"
                placeholder="Cari nama pahlawan..."
                aria-label="Cari nama pahlawan"
                class="w-full bg-[#1a1208]/80 text-[#d3b484] border border-[#d3b484]/30 px-10 py-2.5 text-xs font-snpro placeholder-[#d3b484]/30 focus:outline-none focus:border-[#d3b484]/70 focus:ring-1 focus:ring-[#d3b484]/30 transition-all"
              />
              <button
                v-if="searchQuery"
                @click="clearSearch"
                aria-label="Hapus pencarian"
                class="absolute right-0 w-10 h-full flex items-center justify-center text-[#d3b484]/40 hover:text-[#d3b484] transition"
              >
                <X class="w-4 h-4" />
              </button>
            </div>
            <span class="text-[10px] text-[#d3b484]/40 font-snpro pl-1">
              {{ filteredCards.length }} dari {{ cards.length }} pahlawan
            </span>
          </div>
        </div>

        <!-- Grid Gambar: Transition out-in per halaman agar tidak ada lompatan layout -->
        <Transition name="page-fade" mode="out-in">
          <div
            v-if="paginatedCards.length > 0"
            :key="`page-${currentPage}-${searchQuery}`"
            class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
          >
            <div
              v-for="card in paginatedCards"
              :key="card.id"
              class="relative flex flex-col group border border-[#d3b484]/20 bg-[#1a1208]/60 p-3 sm:p-4 transition-colors duration-300 hover:border-[#d3b484]/50 shadow-md"
            >
              <!-- Border corners -->
              <div class="absolute top-1 left-1 w-3 h-3 border-t border-l border-[#d3b484]/20 group-hover:border-[#d3b484]/40"></div>
              <div class="absolute top-1 right-1 w-3 h-3 border-t border-r border-[#d3b484]/20 group-hover:border-[#d3b484]/40"></div>
              <div class="absolute bottom-1 left-1 w-3 h-3 border-b border-l border-[#d3b484]/20 group-hover:border-[#d3b484]/40"></div>
              <div class="absolute bottom-1 right-1 w-3 h-3 border-b border-r border-[#d3b484]/20 group-hover:border-[#d3b484]/40"></div>

              <!-- Polaroid Photo Area: rasio 3:4 seragam untuk semua kartu -->
              <div class="border aspect-[3/4]  border-[#d3b484]/20 bg-[#0d0a06] overflow-hidden flex items-center justify-center relative mb-4">
                <img
                  v-if="card.images && card.images[0]?.img && !brokenImages.has(String(card.id))"
                  :src="card.images[0].img"
                  :alt="`Foto ${card.name}`"
                  class="object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                  loading="lazy"
                  @error="markImageBroken(card.id)"
                />
                <div v-else class="w-full h-full flex flex-col items-center justify-center gap-2 bg-[#1a1208] text-[9px] text-[#d3b484]/30 font-snpro px-2 text-center">
                  <ImageOff class="w-5 h-5 text-[#d3b484]/20" />
                  Gambar tidak tersedia
                </div>
              </div>

              <!-- Hero Details -->
              <div class="flex flex-col items-center text-center mt-auto">
                <h3 class="text-xs font-bold tracking-wider text-[#d3b484] uppercase font-snpro mb-2 line-clamp-1 w-full" :title="card.name">
                  {{ card.name }}
                </h3>
                <a
                  v-if="card.images && card.images[0]?.img && !brokenImages.has(String(card.id))"
                  :href="card.images[0].img"
                  target="_blank"
                  rel="noopener noreferrer"
                  :title="`Buka sumber gambar ${card.name} di tab baru`"
                  class="flex items-center gap-1.5 text-[10px] tracking-widest text-[#d3b484]/50 hover:text-[#d3b484] focus-visible:text-[#d3b484] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#d3b484]/50 rounded-sm px-1 transition group"
                >
                  {{ getDomain(card.images[0].img) }}
                  <ExternalLink class="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
                <span v-else class="text-[10px] tracking-widest text-[#d3b484]/25">Sumber tidak tersedia</span>
              </div>
            </div>
          </div>

          <!-- State Empty Search -->
          <div v-else key="empty-state" class="flex flex-col items-center justify-center py-20 text-center border border-dashed border-[#d3b484]/20 bg-[#1a1208]/20">
            <Search class="w-8 h-8 text-[#d3b484]/20 mb-3" />
            <p class="text-sm text-[#d3b484]/40 font-snpro italic mb-2">
              Pahlawan dengan kata kunci "{{ searchQuery }}" tidak ditemukan.
            </p>
            <button @click="clearSearch" class="text-xs text-[#d3b484] underline hover:text-[#810000] transition">
              Hapus Pencarian
            </button>
          </div>
        </Transition>

        <!-- Paginator -->
        <div v-if="totalPages > 1" class="flex flex-wrap items-center justify-center sm:justify-between gap-4 border-t border-[#d3b484]/10 pt-6 mt-4">
          <button
            @click="prevPage"
            :disabled="currentPage === 1"
            aria-label="Halaman sebelumnya"
            class="flex items-center gap-2 px-4 py-2 border border-[#d3b484]/20 text-xs tracking-widest uppercase hover:bg-[#d3b484]/15 hover:text-[#d3b484] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#d3b484]/50 disabled:opacity-30 disabled:hover:bg-transparent disabled:text-[#d3b484]/30 disabled:cursor-not-allowed transition group cursor-pointer"
          >
            <ChevronLeft class="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span class="hidden sm:inline">Sebelumnya</span>
          </button>

          <!-- Nomor halaman (desktop) -->
          <div class="hidden sm:flex items-center gap-1.5">
            <template v-for="(page, idx) in pageNumbers" :key="idx">
              <span v-if="page === '...'" class="text-[#d3b484]/30 text-xs px-1">…</span>
              <button
                v-else
                @click="goToPage(page as number)"
                :aria-current="page === currentPage ? 'page' : undefined"
                class="min-w-[2rem] h-8 px-2 text-xs font-snpro tracking-wide border transition focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#d3b484]/50"
                :class="page === currentPage
                  ? 'border-[#810000] bg-[#810000]/20 text-[#d3b484] font-bold'
                  : 'border-[#d3b484]/20 text-[#d3b484]/50 hover:border-[#d3b484]/50 hover:text-[#d3b484]'"
              >
                {{ page }}
              </button>
            </template>
          </div>

          <!-- Label halaman (mobile) -->
          <span class="sm:hidden text-xs tracking-widest text-[#d3b484]/50 font-snpro uppercase">
            <span class="text-[#d3b484] font-bold">{{ currentPage }}</span> / <span class="text-[#d3b484] font-bold">{{ totalPages }}</span>
          </span>

          <button
            @click="nextPage"
            :disabled="currentPage === totalPages"
            aria-label="Halaman berikutnya"
            class="flex items-center gap-2 px-4 py-2 border border-[#d3b484]/20 text-xs tracking-widest uppercase hover:bg-[#d3b484]/15 hover:text-[#d3b484] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#d3b484]/50 disabled:opacity-30 disabled:hover:bg-transparent disabled:text-[#d3b484]/30 disabled:cursor-not-allowed transition group cursor-pointer"
          >
            <span class="hidden sm:inline">Berikutnya</span>
            <ChevronRight class="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </section>

      <!-- FOOTER NOTE -->
      <div class="flex items-center justify-center gap-3 mt-4">
        <div class="h-px w-12 bg-[#d3b484]/20"></div>
        <p class="text-[9px] text-center text-[#d3b484]/40 font-snpro tracking-widest uppercase">
          Kupas Tuntas · Dikembangkan dengan Penuh Apresiasi untuk Pahlawan Bangsa
        </p>
        <div class="h-px w-12 bg-[#d3b484]/20"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-clamp: 1;
}

/* Transisi halus saat berpindah halaman/pencarian: fade out dulu, baru fade in (mode out-in) */
.page-fade-enter-active,
.page-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.page-fade-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.page-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>