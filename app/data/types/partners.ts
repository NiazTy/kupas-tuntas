export type Partner = {
    id: number
    name: string
    description: string
    images: PartnerImages[]
}

export type PartnerImages = {
    id: string
    img: any
}