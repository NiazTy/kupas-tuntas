<!-- GamesPngDeckCardDeck -->
<script setup lang="ts">
const props = defineProps<{
    cards: { image: string }[]
    locked: boolean
}>()

const emit = defineEmits(["skip"])
const drawing = ref(false)

function drawCard() {
    if (drawing.value || props.cards.length === 0 || props.locked) return
    drawing.value = true
    setTimeout(() => {
        drawing.value = false
        emit("skip")
    }, 500)
}
</script>

<template>
    <div class="flex flex-col items-center gap-6">
        <div
            class="deck relative cursor-pointer select-none"
            :class="{ drawing, 'opacity-60 cursor-not-allowed': locked }"
            @click="drawCard"
        >
            <!-- Shadow offset bingkai -->
            <div class="absolute inset-0 translate-x-2 translate-y-2 border border-[#d3b484]/10 pointer-events-none" />
            <!-- Kartu belakang 2 -->
            <div class="deck-card deck-back-2 border border-[#d3b484]/20 bg-[#1a1208]">
                <img v-if="cards[2]" :src="cards[2].image" class="card-img opacity-50" />
            </div>
            <!-- Kartu belakang 1 -->
            <div class="deck-card deck-back-1 border border-[#d3b484]/25 bg-[#1a1208]">
                <img v-if="cards[1]" :src="cards[1].image" class="card-img opacity-70" />
            </div>
            <!-- Kartu atas -->
            <Transition name="card-swap">
                <div
                    class="deck-card deck-top border-2 border-[#d3b484]/40 bg-[#1a1208] group"
                    :key="cards[0]?.image"
                >
                    <!-- Ornamen sudut kartu atas -->
                    <div class="absolute top-2 left-2 w-3 h-3 border-t border-l border-[#d3b484]/40 pointer-events-none z-10" />
                    <div class="absolute top-2 right-2 w-3 h-3 border-t border-r border-[#d3b484]/40 pointer-events-none z-10" />
                    <div class="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-[#d3b484]/40 pointer-events-none z-10" />
                    <div class="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-[#d3b484]/40 pointer-events-none z-10" />
                    <img v-if="cards[0]" :src="cards[0].image" class="card-img" />
                </div>
            </Transition>
            <!-- Jumlah kartu -->
            <div class="absolute -bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 whitespace-nowrap">
                <div class="h-px w-4 bg-[#d3b484]/25" />
                <span class="text-[#d3b484]/40 text-[10px] font-snpro tracking-widest uppercase">{{ cards.length }} kartu</span>
                <div class="h-px w-4 bg-[#d3b484]/25" />
            </div>
        </div>
    </div>
</template>

<style scoped>
.deck {
    width: 120px;
    height: 170px;
}
.deck-card {
    position: absolute;
    width: 100%;
    height: 100%;
    overflow: hidden;
    transition: transform 0.15s ease;
}
.card-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}
.deck-back-2 { 
    transform: translateY(8px) rotate(-1.5deg); 
}
.deck-back-1 { 
    transform: translateY(4px) rotate(0.5deg); 
}
.deck-top { 
    z-index: 3; 
}

.deck:hover:not(.drawing) .deck-top {
  transform: translateY(-5px);
}

.card-swap-enter-active { 
    animation: newCard 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); 
}
.card-swap-leave-active { 
    animation: drawCard 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards; 
}

@keyframes drawCard {
  0%   { transform: translateY(0) rotate(0deg) scale(1); opacity: 1; }
  40%  { transform: translateY(-60px) rotate(-8deg) scale(1.08); opacity: 1; }
  100% { transform: translateY(-140px) translateX(80px) rotate(-15deg) scale(0.9); opacity: 0; }
}
@keyframes newCard {
  0%   { transform: translateY(30px) scale(0.85); opacity: 0; }
  100% { transform: translateY(0) scale(1); opacity: 1; }
}
</style>