import { writeFileSync } from "fs"
import { resolve } from "path"

export default defineEventHandler(async (event) => {
  const token = getCookie(event, "admin_token")
  if (token !== "authenticated") {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" })
  }

  const body = await readBody(event)
  const { type, data } = body

  try {
    if (type === "pickAndGuess") {
      const filePath = resolve(process.cwd(), "app/data/cards/pickAndGuess.ts")
      const content = `import type { PickAndGuessCard } from "../types/cards"\n\nexport const cards: PickAndGuessCard[] = ${JSON.stringify(data, null, 4)}`
      writeFileSync(filePath, content, "utf-8")
    } else if (type === "imageGuess") {
      const filePath = resolve(process.cwd(), "app/data/cards/imageGuess.ts")
      const content = `import type { ImageGuessCards } from "../types/cards"\n\nexport const cards: ImageGuessCards[] = ${JSON.stringify(data, null, 4)}`
      writeFileSync(filePath, content, "utf-8")
    } else if (type === "partners") {
      const filePath = resolve(process.cwd(), "app/data/partners.ts")
      const content = `import type { Partner } from "./types/partners"\n\nexport const Partners: Partner[] = ${JSON.stringify(data, null, 4)}`
      writeFileSync(filePath, content, "utf-8")
    } else if (type === "historyArchive") {
      const filePath = resolve(process.cwd(), "app/data/game/historyArchive.ts")
      const content = `
        export const HistoryArchiveNotes = ${JSON.stringify(data.notes, null, 4)};
        export const HistoryArchiveFacts = ${JSON.stringify(data.facts, null, 4)};
        export const HistoryArchivePeoples = ${JSON.stringify(data.peoples, null, 4)};
        export const HistoryArchivePhotos = ${JSON.stringify(data.photos, null, 4)};
      `
      writeFileSync(filePath, content.trim() + "\n", "utf-8")
    } else {
      throw new Error("Tipe data tidak didukung")
    }

    return { success: true, message: "Data saved successfully" }
  } catch (err: any) {
    throw createError({ statusCode: 500, statusMessage: err.message })
  }
})
