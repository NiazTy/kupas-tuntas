import { defineStore } from "pinia"

import type { Partner } from "~/data/types/partners"
import type { PickAndGuessCard, ImageGuessCards } from "~/data/types/cards"

interface AnswerRecord {
    card: PickAndGuessCard | ImageGuessCards | null
    playerAnswer: string | null
    isCorrect: boolean
}

export const useGameStore = defineStore("game", {
    state: () => ({
        playerName: "",
        partners: null as Partner | null,
        mode: "",
        score: 0,
        correct: 0,
        wrong: 0,
        answerHistory: [] as AnswerRecord[]
    }),
    
    actions: {
        setPlayer(name: string, partner: Partner) {
        this.playerName = name
        this.partners = partner
    },

    setMode(mode: string) {
        this.mode = mode
    },
    setResult(score: number, correct: number, wrong: number) {
        this.score = score
        this.correct = correct
        this.wrong = wrong
    },
    addAnswer(card: PickAndGuessCard | ImageGuessCards | null, playerAnswer: string | null, isCorrect: boolean) {
        this.answerHistory.push({ card, playerAnswer, isCorrect })
    },
    resetGame() {
        this.score = 0
        this.correct = 0
        this.wrong = 0
        this.answerHistory = []
    },
    resetPlayer() {
        this.playerName = ""
        this.partners = null
        this.mode = ""
        this.score = 0
        this.correct = 0
        this.wrong = 0
        this.answerHistory = []
    }
  }
})