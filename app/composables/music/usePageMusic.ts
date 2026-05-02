import { useMusicStore } from "~/stores/music"

export const usePageMusic = (shouldPlay: boolean) => {
    const music = useMusicStore()

    onMounted(() => {
        if (shouldPlay) {
        const startMusic = () => {
            music.play()
            window.removeEventListener("click", startMusic)
            window.removeEventListener("touchstart", startMusic)
        }
        window.addEventListener("click", startMusic)
        window.addEventListener("touchstart", startMusic)
        } else {
        music.pause()
        }
    })
}