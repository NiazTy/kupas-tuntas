<!-- components/ui/Partner.vue -->

<script setup lang="ts">
type Expression = "default" | "smile" | "correct" | "wrong" | "appreciated"

const props = defineProps<{
    partner: any
    partnerSpeech: string
    isSpeaking: boolean
    expression?: Expression
}>()

// Map expression → image index per jumlah gambar yang dimiliki partner
function getImageByExpression(images: any[], expression: Expression): string {
    // Struktur index images berdasarkan data Partners:
    // Diana (6 imgs): 0=card, 1=thinking(default), 2=smile, 3=disappointed, 4=appreciated, 5=impressed
    // Viska (5 imgs): 0=card, 1=thinking(default), 2=smile, 3=disappointed, 4=appreciated
    // Fairel (2 imgs): 0=card, 1=cool(default)

    const count = images.length

    if (count >= 6) {
        // Diana
        const map: Record<Expression, number> = {
        default: 1,
        smile: 2,
        correct: 5,
        wrong: 3,
        appreciated: 4,
        }
        return images[map[expression]]?.img ?? images[1]?.img
    }

    if (count >= 5) {
        // Viska
        const map: Record<Expression, number> = {
        default: 1,
        smile: 2,
        correct: 2,
        wrong: 3,
        appreciated: 4,
        }
        return images[map[expression]]?.img ?? images[1]?.img
    }

    return images[1]?.img ?? images[0]?.img
}

const currentImg = computed(() =>
    props.partner?.images ? getImageByExpression(props.partner.images, props.expression ?? "default") : null
)
</script>

<template>
    <!-- Desktop -->
    <div
        v-if="partner?.images?.[1]?.img"
        class="hidden lg:flex fixed right-0 bottom-0 flex-col items-end z-20 pointer-events-none select-none"
        style="width: 320px;"
    >
        <Transition
            enter-active-class="transition-all duration-300 ease-out"
            enter-from-class="opacity-0 translate-y-2 scale-95"
            enter-to-class="opacity-100 translate-y-0 scale-100"
            leave-active-class="transition-all duration-200"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
        >
            <div v-if="partnerSpeech" class="relative mr-8 mb-3 max-w-55">
                <div class="absolute inset-0 translate-x-1 translate-y-1 border border-[#d3b484]/15" />
                <div class="relative border border-[#d3b484]/40 bg-[#1a1208]/95 px-4 py-3">
                    <div class="absolute top-1.5 left-1.5 w-3 h-3 border-t border-l border-[#d3b484]/30" />
                    <div class="absolute top-1.5 right-1.5 w-3 h-3 border-t border-r border-[#d3b484]/30" />
                    <div class="absolute bottom-1.5 left-1.5 w-3 h-3 border-b border-l border-[#d3b484]/30" />
                    <div class="absolute bottom-1.5 right-1.5 w-3 h-3 border-b border-r border-[#d3b484]/30" />
                    <p class="text-[#d3b484]/90 text-xs font-snpro leading-relaxed">
                        {{ partnerSpeech }}<span v-if="isSpeaking" class="animate-pulse">▌</span>
                    </p>
                    <div class="absolute -bottom-2 right-6 w-3 h-3 bg-[#1a1208] border-r border-b border-[#d3b484]/40 rotate-45" />
                </div>
            </div>
        </Transition>
        <Transition
            mode="out-in"
        >
            <img
                :key="currentImg ?? undefined"
                :src="currentImg!"
                :alt="partner.name"
                class="w-full object-contain object-bottom drop-shadow-2xl"
                style="height: 420px;"
            />
        </Transition>
    </div>
    <!-- Mobile -->
    <div
        v-if="partner?.images"
        class="lg:hidden fixed bottom-0 right-0 z-30 flex flex-col items-end pointer-events-none select-none"
        style="width: 90px;"
    >
        <Transition
            enter-active-class="transition-all duration-300 ease-out"
            enter-from-class="opacity-0 translate-y-1 scale-95"
            enter-to-class="opacity-100 translate-y-0 scale-100"
            leave-active-class="transition-all duration-200"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
        >
            <div v-if="partnerSpeech" class="absolute bottom-full right-0 mb-1 w-48 pointer-events-none">
                <div class="relative border border-[#d3b484]/40 bg-[#1a1208]/95 px-3 py-2">
                    <div class="absolute top-1 left-1 w-2 h-2 border-t border-l border-[#d3b484]/30" />
                    <div class="absolute top-1 right-1 w-2 h-2 border-t border-r border-[#d3b484]/30" />
                    <div class="absolute bottom-1 left-1 w-2 h-2 border-b border-l border-[#d3b484]/30" />
                    <div class="absolute bottom-1 right-1 w-2 h-2 border-b border-r border-[#d3b484]/30" />
                    <p class="text-[#d3b484]/90 text-[10px] font-snpro leading-relaxed">
                        {{ partnerSpeech }}<span v-if="isSpeaking" class="animate-pulse">▌</span>
                    </p>
                    <div class="absolute -bottom-2 right-4 w-2.5 h-2.5 bg-[#1a1208] border-r border-b border-[#d3b484]/40 rotate-45" />
                </div>
            </div>
        </Transition>
        <Transition
            mode="out-in"
        >
            <img
                :key="currentImg ?? undefined"
                :src="currentImg!"
                :alt="partner.name"
                class="w-full object-contain object-bottom"
                style="height: 90px;"
            />
        </Transition>
    </div>
</template>