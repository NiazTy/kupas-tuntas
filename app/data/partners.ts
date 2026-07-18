import { gameAssets } from "./assets"
import type { Partner } from "./types/partners"

const partner = gameAssets.pictures.partners

export const Partners: Partner[] = [
    {
        "id": 0,
        "name": "Nara",
        "description": "Gadis ramah, ceria, dan sopan dengan sedikit sisi pemalu yang manis.",
        "images": [
            { "id": "card", "img": partner.nara[0] },
            { "id": "dissapointed", "img": partner.nara[1] },
            { "id": "exicited", "img": partner.nara[2] },
            { "id": "happy", "img": partner.nara[3] },
            { "id": "love", "img": partner.nara[4] },
            { "id": "netral", "img": partner.nara[5] },
            { "id": "sad", "img": partner.nara[6] },
            { "id": "suprised", "img": partner.nara[7] },
            { "id": "thinking1", "img": partner.nara[8] },
            { "id": "thinking2", "img": partner.nara[9] },
        ]
    },
    {
        "id": 1,
        "name": "Aran",
        "description": "Seorang yang dapat diandalkan dan menjadi analisis yang selalu kritis.",
        "images": [
            { "id": "card", "img": partner.aran[0] },
            { "id": "love", "img": partner.aran[1] },
            { "id": "netral", "img": partner.aran[2] },
            { "id": "sad", "img": partner.aran[3] },
            { "id": "shocked", "img": partner.aran[4] },
            { "id": "smile", "img": partner.aran[5] },
            { "id": "smug", "img": partner.aran[6] },
            { "id": "suprised", "img": partner.aran[7] },
            { "id": "thinking1", "img": partner.aran[8] },
            { "id": "thinking2", "img": partner.aran[9] },
        ]
    }
]