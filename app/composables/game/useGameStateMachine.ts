import { GAME_STATES } from "./state/gameStates"

export function useGameStateMachine() {
    const gameStore = useGameStore()
    const { showToast } = useToast()
    const state = ref(GAME_STATES.MENU)

    const isReadyToStart = () => {
        return !!(gameStore.playerName && gameStore.mode && gameStore.partners)
    }

    function startGame() {
        if (!isReadyToStart()) {
            showToast("Pemain yang terhormat, pastikan kamu sudah mengisi nama, memilih mode, dan memilih partner sebelum memulai permainan!")
            return
        }
        state.value = GAME_STATES.PLAYING
    }

    function pauseGame(){
        state.value = GAME_STATES.PAUSED
    }

    function gameOver(){
        state.value = GAME_STATES.GAME_OVER
    }

    function showResult(){
        state.value = GAME_STATES.RESULT
    }

    return {
        state,
        startGame,
        pauseGame,
        gameOver,
        showResult,
        isReadyToStart
    }
}