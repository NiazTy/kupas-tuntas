<script setup lang="ts">
import { gameAssets } from "~/data/assets"

withDefaults(defineProps<{ show?: boolean, message?: string }>(), { message: "" })

const gameStore = useGameStore()
const emit = defineEmits(["close"])
const partner = computed(() => gameStore.partners)

const dianaThinking = gameAssets.pictures.partners.nara.find(p => p.includes("thinking")) ?? gameAssets.pictures.partners.nara[4]
</script>

<template>
  <Transition
    enter-active-class="transition-all ease-out duration-400"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-all duration-300 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div v-if="show" class="fixed inset-0 z-50 flex items-end justify-center md:items-center" @click.self="emit('close')">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-[#0d0a06]/80 backdrop-blur-sm" @click="emit('close')" />
      <!-- Panel -->
      <Transition
        enter-active-class="transition-all ease-out duration-400"
        enter-from-class="translate-y-8 opacity-0"
        enter-to-class="translate-y-0 opacity-100"
      >
        <div v-if="show" class="relative z-10 w-full max-w-sm mx-4 mb-8 md:mb-0">
          <!-- Shadow offset -->
          <div class="absolute inset-0 translate-x-2 translate-y-2 border border-[#810000]/30" />
          <!-- Box utama -->
          <div class="relative border border-[#d3b484]/30 bg-[#1a0d06]">
            <!-- Ornamen sudut -->
            <div class="absolute top-2 left-2 w-4 h-4 border-t border-l border-[#d3b484]/40" />
            <div class="absolute top-2 right-2 w-4 h-4 border-t border-r border-[#d3b484]/40" />
            <div class="absolute bottom-2 left-2 w-4 h-4 border-b border-l border-[#d3b484]/40" />
            <div class="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-[#d3b484]/40" />
            <!-- Karakter + konten -->
            <div class="flex items-end gap-0">
              <!-- Karakter -->
              <div class="w-32 pointer-events-none select-none shrink-0 md:w-36">
                <img
                  :src="partner?.images.find(img => img.id === 'netral')?.img ?? partner?.images[0]?.img ?? dianaThinking"
                  alt=""
                  class="object-contain object-bottom w-full h-full"
                />
              </div>
              <!-- Teks -->
              <div class="flex flex-col flex-1 gap-3 py-6 pl-2 pr-6">
                <!-- Label -->
                <div class="flex items-center gap-2">
                  <span class="text-[#810000] text-[10px]">✦</span>
                  <span class="text-[#d3b484]/50 text-[9px] tracking-[0.35em] uppercase font-snpro">Perhatian</span>
                </div>
                <div class="h-px w-full bg-[#d3b484]/10" />
                <!-- Pesan -->
                <p class="text-[#d3b484]/85 text-sm font-snpro leading-relaxed">
                  {{ message }}
                </p>
                <!-- Tombol tutup -->
                <button @click="emit('close')" class="hover:cursor-pointer relative self-start mt-1 px-5 py-2 text-[10px] font-snpro tracking-widest uppercase text-[#0d0a06] bg-[#d3b484] hover:bg-[#c4a070] transition-all group">
                  <span class="absolute inset-0 ring-1 ring-inset ring-[#d3b484]/30 group-hover:ring-[#d3b484]/60 transition-all" />
                  Mengerti
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>