interface Card {
    name: string
    image: string
    answer: string
}

export function useGameState() {
    const cards = ref<Card[]>([])
    const currentCard = ref<Card | null>(null)
    const score = ref(0)
    const questionIndex = ref(0)
    const gameFinished = ref(false)

    return {
        cards,
        currentCard,
        score,
        questionIndex,
        gameFinished
    }
}