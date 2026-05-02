import { gameAssets } from "./assets"

import type { Partner } from "./types/partners"

export const Partners: Partner[] = [
    {
        id: 0,
        name: "Diana",
        description: "Gadis yang ceria dan penuh semangat dengan kecerdikannya Diana siap membantumu.",
        images: [
            {
                id: "card",
                img: gameAssets.pictures.partners.diana?.[5]
            },
            {
                id: "diana-thinking",
                img: gameAssets.pictures.partners.diana?.[4]
            },
            {
                id: "diana-smile",
                img: gameAssets.pictures.partners.diana?.[3]
            },
            {
                id: "diana-disappointed",
                img: gameAssets.pictures.partners.diana?.[1]
            },
            {
                id: "diana-appreciated",
                img: gameAssets.pictures.partners.diana?.[0]
            },
            {
                id: "diana-impresseed",
                img: gameAssets.pictures.partners.diana?.[2]
            }
        ] 
    }, 
    {
        id: 1,
        name: "Viska",
        description: "Gadis yang ceria dan penuh semangat dengan kecerdikannya Viska siap membantumu.",
        images: [
            {
                id: "card",
                img: gameAssets.pictures.partners.viska?.[4]
            },
            {
                id: "viska-thinking",
                img: gameAssets.pictures.partners.viska?.[3]
            },
            {
                id: "viska-smile",
                img: gameAssets.pictures.partners.viska?.[2]
            },
            {
                id: "viska-disappointed",
                img: gameAssets.pictures.partners.viska?.[1]
            },
            {
                id: "viska-appreciated",
                img: gameAssets.pictures.partners.viska?.[0]
            }
        ]
    },
    {
        id: 2,
        name: "Fairel",
        description: "Lelaki yang cerdas dan penuh semangat dengan kecerdikannya Fairel siap membantumu.",
        images: [
            {
                id: "card",
                img: gameAssets.pictures.partners.fairel?.[1]
            },
            {
                id: "fairel-cool",
                img: gameAssets.pictures.partners.fairel?.[0]
            }
        ]
    }
]