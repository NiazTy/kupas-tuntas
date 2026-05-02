// Card types for Pick and Guess mode
export interface PickAndGuessCard {
    id: number
    name: string
    image: string
    clue: string
    answer: string
    category: string
    difficulty: "easy" | "medium" | "hard"
}

// Card types for Image Guess mode
export type ImageGuessCards = {
    id: number
    name: string
    description: string
    images: ImageGuessImages[]
    explanation: string
}

export type ImageGuessImages = {
    id: string
    img: string
}

// Card types for History Archive mode
export interface ArchiveAssetItem {
  id: string
  category: string
  image: string
  notes: string | "Ini adalah arsip tanpa catatan"
}

export interface NoteAssetItem {
  id: string
  category: string
  type: string
  image: string
  description?: string
}

export type BoxId = "fakta" | "tokoh" | "foto"

export interface ScatterPhoto {
  id: string
  category: string
  image: string
  notes: string | "Ini adalah arsip tanpa catatan"
  code: string
  x: number
  y: number
  rot: number
  z: number
  boxId: BoxId
}

export interface DroppedPhoto extends ScatterPhoto {
  dropRot: number
}