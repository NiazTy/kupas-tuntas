<script setup lang="ts">
import { gameModes } from "~/data/game/modes"
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
  <img :src="asset" alt="" class="absolute inset-0 w-full h-full object-fill pointer-events-none z-0" />
  <div class="absolute inset-0 z-10 flex flex-col" style="padding: 5% 6% 8% 6%">
    <!-- HEADER -->
    <div class="relative flex flex-col items-center mb-4">
      <div class="absolute right-0 top-2">
        <img src="~/assets/icons/kupas-tuntas-transparent-red.svg" class="h-16 object-contain opacity-80" alt="logo" />
      </div>
      <p class="text-[#5a3309]/50 text-[9px] tracking-[0.4em] uppercase font-snpro">
        Negara Kesatuan Republik Indonesia — Kuis Resmi
      </p>
      <h1 class="text-3xl md:text-4xl uppercase font-snpro font-bold text-[#2c1a06] leading-tight mt-1 tracking-widest">
        Formulir Pendaftaran
      </h1>
      <p class="text-[#5a3309]/45 text-[9px] font-snpro tracking-[0.3em] uppercase">
        KUPAS TUNTAS — {{ new Date().getDate() }} - {{ new Date().getMonth() + 1 }} - {{ new Date().getFullYear() }}
      </p>
    </div>
    <div class="h-px bg-[#7a4f1a]/25 w-full mb-4" />
    <!-- DUA KOLOM -->
    <div class="flex flex-1 min-h-0 gap-0">
      <!-- KOLOM KIRI -->
      <div class="flex flex-col flex-1 pr-8 border-r border-[#7a4f1a]/20 gap-8">
        <!-- Nama Peserta -->
        <div class="flex flex-col gap-1.5">
          <label class="text-xs tracking-[0.35em] uppercase font-snpro font-bold text-[#3d2005]/70">
            Nama Peserta <span class="text-[#810000]">*</span>
          </label>
          <div class="flex items-end gap-2">
            <input
              :value="name"
              :disabled="hasExistingData"
              placeholder="Tulis nama lengkapmu di sini..."
              class="flex-1 bg-transparent border-b border-[#7a4f1a]/40 pb-1 text-[#2c1a06] text-sm font-snpro placeholder-[#7a4f1a]/30 focus:outline-none focus:border-[#2c1a06]/60 transition-colors"
              :class="hasExistingData ? 'opacity-50 cursor-not-allowed' : ''"
              @input="emit('update:name', ($event.target as HTMLInputElement).value)"
            />
            <span v-if="hasExistingData" class="text-[#7a4f1a]/40 text-xs">🔒</span>
          </div>
          <p v-if="hasExistingData" class="text-[8px] font-snpro text-[#5a3309]/40 tracking-widest uppercase">
            Mohon undur diri sebelum melakukan perubahan nama
          </p>
        </div>
        <!-- Umur -->
        <div class="flex flex-col gap-1.5">
          <label class="text-xs tracking-[0.35em] uppercase font-snpro font-bold text-[#3d2005]/70">
            Umur
          </label>
          <input
            placeholder="Usia peserta..."
            class="bg-transparent border-b border-[#7a4f1a]/40 pb-1 text-[#2c1a06] text-sm font-snpro placeholder-[#7a4f1a]/30 focus:outline-none focus:border-[#2c1a06]/60 transition-colors w-32"
          />
        </div>
        <!-- Pernyataan -->
        <div class="flex flex-col gap-1.5">
          <p class="text-[12px] font-snpro text-[#5a3309] leading-relaxed">
            Dengan ini, saya menyatakan bahwa sesungguhnya semua data yang saya input serta
            lampiran-lampirannya adalah benar dan kesatuan yang tidak dapat dipisahkan. Apabila
            dikemudian hari ditemukan dan/atau dibuktikan adanya penipuan/pemalsuan/kesalahan data,
            saya tidak akan menuntut perubahan data. Kecuali saya mengajukan permohonan pengunduran diri.
          </p>
          <p class="text-[12px] font-snpro text-[#5a3309] leading-relaxed">
            Demikian surat pernyataan kebenaran dan keabsahan data ini saya buat untuk digunakan
            secara semestinya dan atas diucapkan terimakasih.
          </p>
        </div>
        <!-- Tanda Tangan -->
        <div class="flex flex-col items-end gap-0.5">
          <p class="text-[10px] tracking-[0.3em] uppercase font-snpro font-bold text-[#3d2005]/60">
            Tanda Tangan
          </p>
          <div class="w-36 border-b border-[#7a4f1a]/30 mt-5 pb-0.5" />
          <p class="text-[9px] font-snpro text-[#5a3309]/40 italic mt-0.5">
            {{ name || "................................." }}
          </p>
          <p class="text-[8px] font-snpro text-[#5a3309] tracking-widest mt-0.5 uppercase">
            {{ new Date().getDate() }} {{ new Date().toLocaleString("id-ID", { month: "long" }) }} {{ new Date().getFullYear() }}
          </p>
        </div>
      </div>
      <!-- KOLOM KANAN -->
      <div class="flex flex-col flex-1 pl-8 gap-1">
        <!-- Pilih Pendamping -->
        <div class="flex flex-col gap-2.5">
          <label class="text-xs tracking-[0.35em] uppercase font-snpro font-bold text-[#3d2005]/70">
            Pilih Pendamping <span class="text-[#810000]">*</span>
          </label>
          <GamePartnersPicker v-model="partner" />
        </div>
        <div class="h-px bg-[#7a4f1a]/20 w-full" />
        <!-- Pilih Mode -->
        <div class="flex flex-col gap-2.5">
          <label class="text-xs tracking-[0.35em] uppercase font-snpro font-bold text-[#3d2005]/70">
            Pilih Mode <span class="text-[#810000]">*</span>
          </label>
          <div class="flex flex-col gap-2.5">
            <label v-for="m in gameModes" :key="m.id" class="flex items-start gap-3 cursor-pointer group">
              <div
                @click="emit('update:mode', m.id)"
                class="mt-0.5 w-4 h-4 border-2 border-[#7a4f1a]/50 flex items-center justify-center shrink-0 transition-colors"
                :class="mode === m.id ? 'bg-[#810000] border-[#810000]' : 'group-hover:border-[#7a4f1a]'"
              >
                <span v-if="mode === m.id" class="text-[#f5e6c8] text-[8px]">✦</span>
              </div>
              <div>
                <p class="text-sm font-snpro text-[#2c1a06] font-semibold leading-tight">{{ m.title }}</p>
                <p class="text-[12px] font-snpro text-[#5a3309]/55 leading-snug mt-0.5">{{ m.description }}</p>
              </div>
            </label>
          </div>
        </div>
        <!-- Stempel + Tombol -->
        <div class="mt-auto flex items-end justify-between">
          <div class="relative w-14 h-14 -rotate-6 opacity-45">
            <div class="absolute inset-0 rounded-full border-2 border-[#810000]/50 flex items-center justify-center">
              <div class="w-10 h-10 rounded-full border border-[#810000]/30 flex items-center justify-center">
                <p class="text-[#810000] text-[6px] tracking-wider text-center leading-tight font-snpro uppercase font-bold">
                  KUPAS<br/>TUNTAS<br/>2025
                </p>
              </div>
            </div>
          </div>
          <div class="flex gap-2">
            <button
              v-if="hasExistingData"
              @click="emit('reset')"
              class="px-5 py-2 text-[10px] font-snpro hover:cursor-pointer tracking-widest uppercase border border-[#7a4f1a]/50 text-[#5a3309]/60 hover:border-[#810000]/60 hover:text-[#810000]/80 transition-all"
            >
              Undur diri
            </button>
            <button @click="emit('start')" class="px-8 py-2 text-[10px] font-snpro hover:cursor-pointer tracking-widest uppercase bg-[#810000] text-[#f5e6c8] hover:bg-[#9a0000] transition-all shadow">
              Daftarkan Diri
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>