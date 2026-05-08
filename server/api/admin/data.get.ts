import { cards as pickAndGuessCards } from "~/data/cards/pickAndGuess"
import { cards as imageGuessCards } from "~/data/cards/imageGuess"
import { HistoryArchiveNotes, HistoryArchiveFacts, HistoryArchivePeoples, HistoryArchivePhotos } from "~/data/game/historyArchive"
import { Partners } from "~/data/partners"

export default defineEventHandler((event) => {
  const token = getCookie(event, "admin_token")
  if (token !== "authenticated") {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" })
  }

  return {
    pickAndGuess: pickAndGuessCards,
    imageGuess: imageGuessCards,
    historyArchive: {
      notes: HistoryArchiveNotes,
      facts: HistoryArchiveFacts,
      peoples: HistoryArchivePeoples,
      photos: HistoryArchivePhotos
    },
    partners: Partners
  }
})
