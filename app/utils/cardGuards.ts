import type { PickAndGuessCard, ImageGuessCards } from "~/data/types/cards"

export function isPickAndGuess(card: PickAndGuessCard | ImageGuessCards | null): card is PickAndGuessCard {
    return card !== null && 'difficulty' in card
}

export function isImageGuess(card: PickAndGuessCard | ImageGuessCards | null): card is ImageGuessCards {
    return card !== null && 'images' in card
}