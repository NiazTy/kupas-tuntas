import { defineStore } from "pinia"

export const useMusicStore = defineStore("music", () => {
    const audio = ref<HTMLAudioElement | null>(null)
    const isPlaying = ref(false)
    const isMuted = ref(false)
    const isInitialized = ref(false)

    const init = (src: string) => {
        if (isInitialized.value) return
        
        audio.value = new Audio(src)
        audio.value.loop = true
        audio.value.volume = 0.4
        isInitialized.value = true
    }

    const play = async () => {
        if (!audio.value) return
        await audio.value.play()
        isPlaying.value = true
    }

    const playSFX = (src: string, volume = 0.4) => {
        const sfx = new Audio(src)
        sfx.volume = volume
        sfx.playbackRate = 0.95 + Math.random() * 0.1
        sfx.play()
    }

    const pause = () => {
        audio.value?.pause()
        isPlaying.value = false
    }

    const toggle = () => {
        isPlaying.value ? pause() : play()
    }

    const toggleMute = () => {
        if (!audio.value) return
        isMuted.value = !isMuted.value
        audio.value.muted = isMuted.value
    }

    return { isPlaying, isMuted, isInitialized, init, play, pause, toggle, toggleMute, playSFX }
})