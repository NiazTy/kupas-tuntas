const TIMER_DURATION = 10

export function useGameLoop() {
    const running = ref(false)
    const timer = ref(TIMER_DURATION)

    const events = useGameEvents()

    let frameId: number | null = null
    let lastTime = 0

    function loop(time: number) {
        if (!running.value) return
        
        const delta = time - lastTime
        lastTime = time
        update(delta)
        frameId = requestAnimationFrame(loop)
    }

    function update(delta: number) {
        if (timer.value <= 0) return
        
        timer.value -= delta / 1000

        if (timer.value <= 0) {
            timer.value = 0
            events.emit(GAME_EVENTS.TIME_UP)
        }
    }

    function resetTimer() {
        timer.value = TIMER_DURATION
    }

    function start() {
        if (running.value) return

        running.value = true
        frameId = requestAnimationFrame((time) => {
            lastTime = time
            loop(time)
        })
    }

    function stop() {
        running.value = false
        
        if (frameId) cancelAnimationFrame(frameId)
    }

    return { start, stop, resetTimer, timer }
}