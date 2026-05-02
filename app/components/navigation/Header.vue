<template>
    <div class="fixed top-24 left-0 z-50">
        <button @click="toggleMenu" class="group hover:cursor-pointer hover:translate-x-1 relative flex items-center justify-center w-12 h-32 bg-[#0d0a06]/90 border border-l-0 border-[#d3b484]/30 backdrop-blur-md shadow-xl transition-all duration-300 hover:w-14">
            <div class="absolute top-2 bottom-2 left-0 w-px bg-[#810000]/50"></div>
            <div class="flex flex-col items-center gap-1.5">
                <span class="block w-5 h-px bg-[#d3b484]/70 transition-all duration-300"
                    :class="open ? 'rotate-45 translate-y-1.5' : ''" />
                <span class="block w-5 h-px bg-[#d3b484]/70 transition-all duration-300"
                    :class="open ? 'opacity-0' : ''" />
                <span class="block w-5 h-px bg-[#d3b484]/70 transition-all duration-300"
                    :class="open ? '-rotate-45 -translate-y-1.5' : ''" />
            </div>
            <div class="absolute -right-2.5 top-1/2 -translate-y-1/2 w-3 h-6 bg-[#0d0a06]/90 clip-side-bookmark"></div>
            <span class="absolute -right-10 rotate-90 text-[8px] tracking-[0.3em] text-[#d3b484]/40 font-snpro">
                MENU
            </span>
            <div v-if="open" class="absolute top-2 right-2 w-1.5 h-1.5 bg-[#810000] rounded-full animate-pulse"></div>
        </button>
    </div>
    <transition name="arsip">
        <aside v-if="open" class="arsip-panel">
            <!-- layer belakang (kertas kedua) -->
            <div class="arsip-layer"></div>
            <!-- MAIN CONTENT -->
            <div class="arsip-content">
                <div class="p-6 border-b border-[#d3b484]/10">
                    <img src="~/assets/icons/kupas-tuntas-transparent.svg" class="h-12 w-auto" />
                </div>
                <ul class="flex flex-col py-4">
                    <li v-for="(menu, index) in menus" :key="menu.name" class="transition-all duration-300" :style="{
                            transitionDelay: `${index * 80}ms`,
                            opacity: open ? 1 : 0,
                            transform: open ? 'translateX(0)' : 'translateX(-20px)',
                        }"k
                    >
                        <NuxtLink :to="menu.to" class="flex items-center gap-3 px-6 py-3 hover:bg-[#d3b484]/5 transition">
                            <component :is="menu.Icon" class="w-4 h-4 text-[#d3b484]/60" />
                            <span class="text-[11px] tracking-[0.2em] uppercase text-[#d3b484]/70">
                                {{ menu.name }}
                            </span>
                        </NuxtLink>
                    </li>
                    <li class="px-6 py-3">
                        <div class="h-px bg-[#d3b484]/10" />
                    </li>
                    <li class="px-6">
                        <NuxtLink to="/game" class="flex items-center justify-center gap-2 py-3 text-[11px] uppercase bg-[#d3b484] text-[#0d0a06] hover:bg-[#c4a070] transition">
                            <GamepadDirectional class="w-4 h-4" /> Mulai Bermain
                        </NuxtLink>
                    </li>
                    <li class="px-6 mt-2 transition-all duration-300" :style="{
                            transitionDelay: `${(menus.length + 1) * 80}ms`,
                            opacity: open ? 1 : 0,
                            transform: open ? 'translateX(0)' : 'translateX(-20px)',
                        }"
                    >
                        <button @click="music.toggleMute" class="w-full hover:cursor-pointer flex items-center justify-between px-4 py-3 border border-[#d3b484]/20 bg-[#1a0e05]/40 hover:bg-[#d3b484]/10 transition group">
                            <div class="flex items-center gap-3">
                                <component :is="music.isMuted ? VolumeX : Music4" class="w-4 h-4 text-[#d3b484]/70 transition-all duration-300" :class="music.isMuted ? '' : 'scale-110 rotate-12'"/>
                                <span class="text-[11px] tracking-[0.2em] uppercase text-[#d3b484]/70">
                                    Musik
                                </span>
                            </div>
                            <span class="text-[9px] tracking-widest uppercase" :class="music.isMuted ? 'text-[#810000]' : 'text-[#d3b484]'">
                                {{ music.isMuted ? 'OFF' : 'ON' }}
                            </span>
                        </button>
                    </li>
                </ul>
            </div>
        </aside>
    </transition>
    <div v-if="open" @click="toggleMenu" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />
</template>

<script setup lang="ts">
import { Home, WholeWord, BookOpenText, GamepadDirectional, Music4, VolumeX } from 'lucide-vue-next';
import { gameAssets } from "~/data/assets"

const open = ref(false);

const menus = [
    { name: "Beranda", to: "/", Icon: Home },
    { name: "Tentang", to: "/#about", Icon: WholeWord },
    { name: "Belajar Sejarah Seru", to: "/mulai-belajar", Icon: BookOpenText },
];

const music = useMusicStore()

const paperSlide = gameAssets.sFX.find(p => p.includes("paper-slide")) ?? gameAssets.sFX[0]
const paperSlode = gameAssets.sFX.find(p => p.includes("paper-slode")) ?? gameAssets.sFX[0]

const toggleMenu = () => {
    const wasOpen = open.value
    open.value = !open.value
    if (wasOpen) {
        setTimeout(() => {
            music.playSFX(paperSlode, 0.35)
        }, 50)
    } else {
        music.playSFX(paperSlide, 0.35)
    }
}

</script>

<style scoped>
.clip-side-bookmark {
    clip-path: polygon(0 0, 100% 50%, 0 100%);
}

/* PANEL UTAMA */
.arsip-panel {
    position: fixed;
    top: 0;
    right: 0;
    width: 320px;
    height: 100%;
    background: #1a1208;
    border-right: 1px solid rgba(211,180,132,0.2);
    z-index: 50;
    overflow: hidden;
}

/* layer belakang (depth kertas) */
.arsip-layer {
    position: absolute;
    inset: 0;
    transform: translateX(6px) translateY(6px);
    border: 1px solid rgba(211,180,132,0.1);
}

/* isi */
.arsip-content {
    position: relative;
}

/* ANIMASI TARIK KERTAS */
.arsip-enter-active {
    transition: all 0.45s cubic-bezier(0.7, 0, 0.2, 1);
}

.arsip-leave-active {
    transition: all 0.25s ease;
}

.arsip-enter-from {
    transform: translateX(110%) rotate(2deg);
    opacity: 0;
}

.arsip-enter-to {
    transform: translateX(0) rotate(0);
    opacity: 1;
}

.arsip-leave-to {
    transform: translateX(110%) rotate(1deg);
    opacity: 0;
}
</style>