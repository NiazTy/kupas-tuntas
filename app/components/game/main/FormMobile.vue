<!-- components/game/FormMobile.vue -->

<script setup lang="ts">
import { gameModes } from "~/data/game/modes"
import { Lock } from "lucide-vue-next"

import type { Partner } from "~/data/types/partners"

defineProps<{
  asset: string
  name: string
  hasExistingData: boolean
}>()

const emit = defineEmits<{
  "update:name": [val: string]
  "update:partner": [val: Partner | null]
  "update:mode": [val: string]
  "start": []
  "reset": []
}>()

const partner = defineModel<Partner | null>("partner")
const mode = defineModel<string>("mode")
</script>

<template>
  <div class="relative min-h-screen bg-[#0d0a06] flex flex-col items-center justify-center overflow-hidden px-6 py-1">
    <Ornament2 />
    <div class="relative z-10 w-full max-w-xl">
      <div class="relative">
        <img :src="asset" alt="" class="absolute inset-0 object-fill w-full h-full pointer-events-none select-none" />
        <div class="relative z-10 flex flex-col px-10 py-12 gap-3">
          <!-- Header -->
          <div class="flex flex-col items-center gap-1 text-center border-b-2 border-[#8b6914]/40 pb-5">
            <p class="text-[#5a3e0a]/50 font-bold text-[9px] tracking-[0.45em] uppercase font-snpro">
              Negara Kesatuan Republik Indonesia - Kuis Resmi
            </p>
            <h1 class="text-2xl font-roboto font-semibold text-[#3d2005] leading-tight mt-1">
              Formulir Pendaftaran
            </h1>
            <p class="text-[#5a3e0a]/60 text-xs font-snpro tracking-widest mt-1">
              KUPAS TUNTAS — {{ new Date().getDate() }} - {{ new Date().getMonth() + 1 }} - {{ new Date().getFullYear() }}
            </p>
            <div class="flex gap-1 text-[#8b6914]/40 text-[10px] mt-1">
              <span>✦</span><span>✦</span><span>✦</span>
            </div>
          </div>
          <!-- Nama -->
          <div class="flex flex-col gap-1">
            <label class="text-sm font-bold tracking-[0.3em] uppercase font-snpro text-[#5a3e0a]/70">
              Nama Peserta <span class="text-[#810000]">*</span>
            </label>
            <div class="flex items-end gap-2">
              <input
                :value="name"
                :disabled="hasExistingData"
                placeholder="Tulis nama lengkapmu di sini..."
                class="flex-1 bg-transparent border-b border-[#8b6914]/50 pb-1 text-[#3d2005] text-sm font-snpro placeholder-[#8b6914]/30 focus:outline-none focus:border-[#3d2005]/70 transition-colors"
                :class="hasExistingData ? 'opacity-60 cursor-not-allowed select-none' : ''"
                @input="emit('update:name', ($event.target as HTMLInputElement).value)"
              />
              <span v-if="hasExistingData" class="text-[#8b6914]/50 mb-1">
               <lock class="w-4 h-4" />
              </span>
            </div>
            <p v-if="hasExistingData" class="text-[8px] font-snpro text-[#5a3e0a]/40 tracking-widest uppercase mt-0.5">
              Mohon untuk undur diri sebelum melakukan perubahan nama
            </p>
          </div>
          <div class="flex items-center gap-3">
            <div class="h-px flex-1 bg-[#8b6914]/25" />
            <span class="text-[#8b6914]/30 text-[10px]">✦</span>
            <div class="h-px flex-1 bg-[#8b6914]/25" />
          </div>
          <!-- Pilih Pendamping -->
          <div class="flex flex-col gap-3">
            <label class="text-[10px] tracking-[0.3em] uppercase font-snpro text-[#5a3e0a]/70">
              Pilih Partners <span class="text-[#810000]">*</span>
            </label>
            <GamePartnersPicker v-model="partner" />
          </div>
          <div class="flex items-center gap-3">
            <div class="h-px flex-1 bg-[#8b6914]/25" />
            <span class="text-[#8b6914]/30 text-[10px]">✦</span>
            <div class="h-px flex-1 bg-[#8b6914]/25" />
          </div>
          <!-- Mode -->
          <div class="flex flex-col gap-3">
            <label class="text-[10px] tracking-[0.3em] font-bold uppercase font-snpro text-[#5a3e0a]/70">
              Mode Permainan <span class="text-[#810000]">*</span>
            </label>
            <div class="flex flex-col gap-3">
              <label v-for="m in gameModes" :key="m.id" class="flex items-start gap-3 cursor-pointer group">
                <div
                  @click="emit('update:mode', m.id)"
                  class="mt-0.5 w-5 h-5 border-2 border-[#8b6914]/60 flex items-center justify-center shrink-0 transition-colors"
                  :class="mode === m.id ? 'bg-[#810000] border-[#810000]' : 'bg-transparent group-hover:border-[#8b6914]'"
                >
                  <span v-if="mode === m.id" class="text-[#d3b484] text-[10px]">✦</span>
                </div>
                <div>
                  <p class="text-sm font-snpro text-[#3d2005] font-semibold leading-tight">{{ m.title }}</p>
                  <p class="text-sm font-bold font-snpro text-[#5a3e0a]/60 leading-snug mt-0.5">{{ m.description }}</p>
                </div>
              </label>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <div class="h-px flex-1 bg-[#8b6914]/25" />
            <span class="text-[#8b6914]/30 text-[10px]">✦</span>
            <div class="h-px flex-1 bg-[#8b6914]/25" />
          </div>
          <!-- Tanda Tangan + Tombol -->
          <div class="flex flex-col gap-6">
            <div class="flex flex-col gap-1">
              <p class="text-[9px] tracking-[0.3em] uppercase font-snpro text-[#5a3e0a]/50">Tanda Tangan Peserta</p>
              <div class="w-48 border-b border-[#8b6914]/40 pb-1 mt-3" />
              <p class="text-[9px] font-bold font-snpro text-[#5a3e0a]/40 italic mt-1">{{ name || "................................." }}</p>
            </div>
            <div class="flex flex-col items-center gap-3">
              <div class="absolute bottom-48 right-5 w-20 h-20 -mb-2 -rotate-6 opacity-70">
                <div class="absolute inset-0 rounded-full border-2 border-[#810000]/60 flex items-center justify-center">
                  <div class="w-14 h-14 rounded-full border border-[#810000]/40 flex items-center justify-center">
                    <p class="text-[#810000] text-[7px] tracking-wider text-center leading-tight font-snpro uppercase font-bold">KUPAS<br/>TUNTAS<br/>2025</p>
                  </div>
                </div>
              </div>
              <div class="flex flex-col gap-2">
                <button
                  v-if="hasExistingData"
                  @click="emit('reset')"
                  class="relative px-6 py-3 text-sm font-snpro tracking-widest uppercase border border-[#8b6914]/40 text-[#5a3e0a]/60 hover:border-[#810000]/60 hover:text-[#810000]/80 transition-all group"
                >
                  <span class="absolute inset-0 ring-1 ring-inset ring-[#8b6914]/10 group-hover:ring-[#810000]/20 transition-all" />
                  Undur diri
                </button>
                <button
                  @click="emit('start')"
                  class="relative px-10 py-3 text-sm font-snpro tracking-widest uppercase bg-[#810000] text-[#d3b484] hover:bg-[#a00000] transition-all group shadow-md"
                >
                  <span class="cursor-pointer absolute inset-0 ring-1 ring-inset ring-[#d3b484]/20 group-hover:ring-[#d3b484]/50 transition-all" />
                  Daftarkan Diri
                </button>
              </div>
            </div>
          </div>
          <!-- Footer -->
          <div class="flex items-center justify-center gap-3 pt-2 border-t border-[#8b6914]/20">
            <div class="h-px w-8 bg-[#8b6914]/20" />
            <p class="text-[8px] tracking-[0.3em] text-center font-bold uppercase font-snpro text-[#5a3e0a]">Formulir ini bersifat resmi dan rahasia</p>
            <div class="h-px w-8 bg-[#8b6914]/20" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>