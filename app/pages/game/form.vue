<script setup lang="ts">
import { gameAssets } from "~/data/assets"
import { gameModes } from "~/data/game/modes"
import type { Partner } from "~/data/types/partners"

const pageAssets = [...gameAssets.pictures.ui.root]

const { progress, loading, startLoading } = useAssetManager(pageAssets, {
  minDuration: 1500,
  continueOnError: true,
})

const formPaper = gameAssets.pictures.ui.root.find(p => p.includes("kertas-formulir-dekstop")) ?? gameAssets.pictures.ui.root[0]
const formPaperMobile = gameAssets.pictures.ui.root.find(p => p.includes("kertas-formulir-mobile")) ?? gameAssets.pictures.ui.root[0]

usePageMusic(true)

const router = useRouter()
const gameStore = useGameStore()

const name = ref("")
const partner = ref<Partner | null>(null)
const mode = ref(gameModes[0]?.id || "")

const hasExistingData = computed(() => !!gameStore.playerName)

const { toast, showToast, hideToast } = useToast()



function startGame() {
  if (!name.value) { showToast("Nama peserta belum diisi."); return }
  if (!partner.value) { showToast("Pilih partner terlebih dahulu."); return }
  gameStore.setPlayer(name.value, partner.value)
  gameStore.setMode(mode.value)
  router.push("/game/play")
}

function resetData() {
  gameStore.resetPlayer()
  name.value = ""
  partner.value = null
  mode.value = gameModes[0]?.id || ""
}

onMounted(async () => {
  if (gameStore.playerName) name.value = gameStore.playerName
  if (gameStore.partners) partner.value = gameStore.partners
  if (gameStore.mode) mode.value = gameStore.mode
  await startLoading()
})

definePageMeta({ layout: "header" })
</script>

<template>
  <Transition name="fade">
      <LoadingScreen v-if="loading" :progress="progress" />
  </Transition>
  <div v-if="!loading">
    <Toast :toast="toast" @close="hideToast" />
    <div class="hidden md:block fixed inset-0 bg-[#1a0f05] overflow-hidden">
      <GameMainFormDesktop
        :asset="formPaper"
        :name="name"
        :has-existing-data="hasExistingData"
        v-model:partner="partner"
        v-model:mode="mode"
        @update:name="name = $event"
        @start="startGame"
        @reset="resetData"
      />
    </div>
    <div class="md:hidden">
      <GameMainFormMobile
        :asset="formPaperMobile"
        :name="name"
        :has-existing-data="hasExistingData"
        v-model:partner="partner"
        v-model:mode="mode"
        @update:name="name = $event"
        @start="startGame"
        @reset="resetData"
      />
    </div>
  </div>
</template>