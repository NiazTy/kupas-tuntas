export const useBackgroundMusic = (src: string) => {
    const audio = ref<HTMLAudioElement | null>(null)
    const isPlaying = ref(false)
    
    const play = () => {
        if (!audio.value) return
        audio.value.play()
        isPlaying.value = true
    }

    const pause = () => {
        audio.value?.pause()
        isPlaying.value = false
    }

    const toggle = () => {
        isPlaying.value ? pause() : play()
    }

    onMounted(() => {
        audio.value = new Audio(src)
        audio.value.loop = true
        audio.value.volume = 0.4
        
        const tryPlay = () => {
        play()
        window.removeEventListener("click", tryPlay)
        window.removeEventListener("keydown", tryPlay)
        }

        window.addEventListener("click", tryPlay)
        window.addEventListener("keydown", tryPlay)
    })

    onUnmounted(() => {
        pause()
        audio.value = null
    })

    return { isPlaying, play, pause, toggle }
}