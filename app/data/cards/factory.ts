import { cards } from "./pickAndGuess"
import { cards as ImageGuessData } from "./imageGuess"

import type { ImageGuessCards } from "../types/cards"

export function generateCards(mode: string): ImageGuessCards[] | typeof cards {
    if (mode === "ig") return ImageGuessData
    return cards
}