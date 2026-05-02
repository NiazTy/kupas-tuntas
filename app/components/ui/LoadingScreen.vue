<script setup lang="ts">
defineProps<{
  progress: number
}>()
</script>

<template>
  <div class="fixed inset-0 w-screen h-screen bg-[#0d0a06] flex flex-col justify-center items-center z-9999 transition-opacity duration-500 overflow-hidden">
    <Ornament3 />
    <!-- Konten -->
    <div class="flex flex-col items-center gap-3 z-10">
      <!-- Label atas -->
      <div class="flex items-center gap-2.5">
        <div class="w-7 h-px bg-[#d3b484]/40" />
        <span class="font-['SNPro',sans-serif] text-[10px] tracking-[0.35em] uppercase text-[#d3b484]/60">Memuat Arsip</span>
        <div class="w-7 h-px bg-[#d3b484]/40" />
      </div>
      <!-- Logo -->
      <img src="~/assets/icons/kupas-tuntas-transparent.svg" class="h-24 object-contain drop-shadow-[0_4px_12px_rgba(129,0,0,0.4)]" alt="Kupas Tuntas" />
      <!-- Tagline -->
      <p class="font-['SNPro',sans-serif] text-[11px] text-[#d3b484]/55 tracking-[0.15em] text-center">Kuis Sejarah & Pahlawan Nusantara</p>
      <!-- Ornamen bintang -->
      <div class="flex gap-1.5 text-[#d3b484]/35 text-[10px]">
        <span>✦</span><span>✦</span><span>✦</span>
      </div>
      <!-- Progress bar dengan karakter berlari -->
      <div class="flex flex-col gap-1.5 w-[320px] mt-2">
        <!-- Label progress -->
        <div class="flex justify-between items-center">
          <span class="font-['SNPro',sans-serif] text-[9px] tracking-[0.3em] uppercase text-[#d3b484]/40">Memuat...</span>
          <span class="font-['SNPro',sans-serif] text-[11px] text-[#d3b484]/70 tracking-widest">{{ progress }}%</span>
        </div>
        <!-- Track bar -->
        <div class="relative w-full h-1.5 bg-[#d3b484]/10 border border-[#d3b484]/20 overflow-visible">
          <!-- Fill -->
          <div class="h-full bg-linear-to-r from-[#810000] to-[#a03020] transition-[width] duration-300 ease-in relative" :style="{ width: progress + '%' }" />
          <!-- Karakter berlari di ujung fill -->
          <div class="absolute bottom-0 transition-[left] duration-300 ease-in pointer-events-none w-12 h-auto" :style="{ left: `calc(${progress}% - 24px)` }">
            <img src="/pictures/partners/chibi-mbak-diana-berlari.png" class="w-full h-auto block" alt="" />
          </div>
        </div>
        <!-- Garis tanah -->
        <div class="w-full h-px bg-[#d3b484]/25" />
      </div>
      <!-- Est badge -->
      <div class="border border-[#d3b484]/25 px-3.5 py-0.75 mt-1">
        <span class="font-['SNPro',sans-serif] text-[9px] tracking-[0.3em] uppercase text-[#d3b484]/35">Est. 2025</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.grain-bg {
  background-image: url('data:image/svg+xml,%3Csvg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noise"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="100%25" height="100%25" filter="url(%23noise)" opacity="1"/%3E%3C/svg%3E');
  background-size: 200px 200px;
}
</style>