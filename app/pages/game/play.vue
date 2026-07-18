<script setup>
import { gameAssets } from "~/data/assets"

const { toast, hideToast } = useToast()
const pageAssets = [
  ...gameAssets.pictures.partners.aran,
  ...gameAssets.pictures.partners.nara,
  ...gameAssets.pictures.archiveFiles.fact,
  ...gameAssets.pictures.archiveFiles.noted,
  ...gameAssets.pictures.archiveFiles.photo,
  ...gameAssets.pictures.archiveFiles.people,
  ...gameAssets.pictures.ui.root
]
const { progress, loading, startLoading } = useAssetManager(pageAssets, {
    continueOnError: true,
})

const gameState = useGameStateMachine()
const gameStore = useGameStore()

onMounted(async () => {
    await startLoading()
    gameState.startGame()
})

const { cards, component: boardComponent } = useGameEngine(gameStore.mode)

definePageMeta({
  layout: "header"
})
</script>

<template>
    <Transition name="fade">
      <LoadingScreen v-if="loading" :progress="progress" />
    </Transition>
    <ErrorOverlay
        :show="toast.show"
        :message="toast.message ?? ''"
        @close="hideToast"
    />
    <div v-if="!gameState.isReadyToStart()">
        <ErrorUserFault/>
    </div>
    <div v-else>
        <div v-if="gameState.state.value === GAME_STATES.PLAYING">
            <component
                :is="boardComponent"
                v-if="boardComponent"
                :cards="cards"
            />
            <ErrorUserFault v-else />
        </div>
        <div v-if="gameState.state.value === GAME_STATES.PAUSED">
            <h2>Game Paused</h2>
        </div>
        <div v-if="gameState.state.value === GAME_STATES.GAME_OVER">
            <h2>Game Over</h2>
        </div>
    </div>
</template>