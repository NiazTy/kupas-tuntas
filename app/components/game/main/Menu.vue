<script setup lang="ts">
defineProps<{
  asset: string
}>()
</script>

<template>
    <!-- First Page -->
    <div id="menu" class="h-screen">
        <div id="artwork" :style="{ backgroundImage: `url('${asset}')`, backgroundSize: 'cover', backgroundPosition: 'center' }" class="relative h-full">
            <Ornament1 />
            <!-- Mobile Version (md:hidden) -->
            <div class="relative flex flex-col h-full md:hidden">
                <!-- Bagian Atas: Logo & Welcome -->
                <div class="flex flex-col items-center justify-center flex-1 gap-3 px-6 pt-16">
                    <!-- Label vintage -->
                    <div class="flex items-center gap-2">
                        <div class="h-px w-6 bg-[#d3b484]/60" />
                        <p class="text-[10px] tracking-[0.3em] uppercase text-[#d3b484]/80 font-snpro">
                            Selamat Datang di
                        </p>
                        <div class="h-px w-6 bg-[#d3b484]/60" />
                    </div>
                    <!-- Logo -->
                    <img src="~/assets/icons/kupas-tuntas-transparent.svg" class="object-contain h-36 drop-shadow-lg" />
                    <!-- Tagline -->
                    <p class="text-center text-[#d3b484]/70 text-xs font-snpro tracking-wide leading-relaxed max-w-56">
                        Kuis Sejarah & Pahlawan Indonesia
                    </p>
                    <!-- Ornamen bintang -->
                    <div class="flex gap-1 text-[#d3b484]/50 text-xs">
                        <span>✦</span><span>✦</span><span>✦</span>
                    </div>
                </div>
                <!-- Garis pemisah tengah -->
                <div class="flex items-center gap-3 px-12">
                    <div class="h-px flex-1 bg-[#d3b484]/20" />
                    <span class="text-[#d3b484]/30 text-[10px] font-snpro">✦</span>
                    <div class="h-px flex-1 bg-[#d3b484]/20" />
                </div>
                <!-- Bagian Bawah: Badge + CTA -->
                <div class="flex flex-col items-center gap-2 justify-center flex-1">
                    <div class="flex flex-col items-center justify-center flex-1 gap-2">
                        <ButtonMenu size="h-10" :button="'mulai-bermain'" @click="useRouter().push('/game/form')" />
                        <ButtonMenu size="h-10" :button="'kredit'" @click="useRouter().push('/game/credits')" />
                    </div>
                </div>
            </div>
            <!-- Desktop Version -->
            <div class="relative z-10 hidden h-full grid-cols-3 md:grid">
                <!-- Bagian 1: Left -->
                <div class="flex flex-col items-center justify-center gap-3 px-8">
                    <div class="flex items-center gap-2">
                        <div class="h-px w-8 bg-[#d3b484]/60" />
                        <p class="text-xs tracking-[0.3em] uppercase text-[#d3b484]/80 font-snpro">Selamat Datang di</p>
                        <div class="h-px w-8 bg-[#d3b484]/60" />
                    </div>
                    <img src="~/assets/icons/kupas-tuntas-transparent.svg" class="object-contain h-28 drop-shadow-lg" />
                    <p class="text-center text-[#d3b484]/70 text-xs font-snpro tracking-wide leading-relaxed max-w-45">
                        Kuis Sejarah & Pahlawan Indonesia
                    </p>
                    <ButtonMenu size="h-10" :button="'beranda'" @click="useRouter().push('/')" />
                    <ButtonMenu size="h-10" :button="'kredit'" @click="useRouter().push('/game/credits')" />
                    <div class="flex gap-1 text-[#d3b484]/50 text-xs">
                        <span>✦</span><span>✦</span><span>✦</span>
                    </div>
                </div>
                <!-- Bagian 2: Middle (Blank) -->
                <div class="grid content-center grid-rows-3 justify-items-center">
                    <div></div>
                    <div></div>
                    <div class="grid self-center">
                        <ButtonMenu :button="'mulai-bermain'" @click="useRouter().push('/game/form')" />
                    </div>
                </div>
                <!-- Bagian 3: Right -->
                <div />
            </div>
        </div>
    </div>
</template>