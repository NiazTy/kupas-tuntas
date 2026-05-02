import { generateCards } from "~/data/cards/factory"

const GAME_COMPONENTS: Record<string, ReturnType<typeof defineAsyncComponent>> = {
  png: defineAsyncComponent(() => import("~/components/game/mode/pickAndGuess/Board.vue")),
  ig:  defineAsyncComponent(() => import("~/components/game/mode/imageGuess/Board.vue")),
  ha:  defineAsyncComponent(() => import("~/components/game/mode/historyArchive/Board.vue")),
//   hg:  defineAsyncComponent(() => import("~/components/Games/Hg/BoardGameBoard.vue")),
}

export function useGameEngine(mode: string) {
  const cards = shuffleArray(generateCards(mode))
  const component = GAME_COMPONENTS[mode] ?? null

  return { cards, component }
}