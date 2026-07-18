export type Partner = {
    id: number
    name: string
    description: string
    images: PartnerImages[]
}

export type PartnerImages = {
    id: Expression
    img: any
}

export type Expression =
  | "card"
  | "love"
  | "netral"
  | "sad"
  | "suprised"
  | "thinking1"
  | "thinking2"
  | "shocked"
  | "smile"
  | "smug"
  | "dissapointed"
  | "exicited"
  | "happy"