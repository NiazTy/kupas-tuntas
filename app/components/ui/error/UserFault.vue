<script setup lang="ts">
const handleError = () => {
    clearError({ redirect: "/game" })
}
</script>

<template>
    <div class="relative min-h-screen bg-[#0d0a06] flex items-center justify-center px-6 overflow-hidden">
        <ornament2 />
        <!-- Label pojok -->
        <div class="absolute flex items-center gap-3 top-8 right-16">
            <div class="h-px w-10 bg-[#d3b484]/30" />
            <span class="text-[#d3b484]/40 text-[10px] tracking-[0.4em] font-snpro uppercase">Arsip Hilang</span>
        </div>
        <!-- Konten -->
        <div class="relative z-10 flex flex-col items-center max-w-2xl gap-6 text-center">
            <!-- Label atas -->
            <div class="flex items-center gap-3">
                <div class="h-px w-8 bg-[#d3b484]/40" />
                <span class="text-[#d3b484]/50 text-[10px] tracking-[0.4em] uppercase font-snpro">✦ Kesalahan Pemain ✦</span>
                <div class="h-px w-8 bg-[#d3b484]/40" />
            </div>
            <!-- Kode error besar -->
            <h1 class="error-code font-display text-[#810000] leading-none select-none" style="font-size: clamp(100px, 20vw, 180px); opacity: 0;">
                {???}
            </h1>
            <!-- Garis pemisah -->
            <div class="flex items-center w-full gap-3">
                <div class="h-px flex-1 bg-[#810000]/50" />
                <div class="h-1 w-1 rounded-full bg-[#d3b484]/40" />
                <div class="h-px flex-1 bg-[#d3b484]/20" />
            </div>
            <!-- Judul -->
            <h2 class="text-2xl md:text-3xl font-display text-[#d3b484]">
                Halaman Ini Sepertinya <span class="text-[#810000]">Rusak???</span>
            </h2>
            <!-- Deskripsi dengan border kiri -->
            <div class="border-l-2 border-[#810000]/60 pl-5 text-left max-w-md">
                <p class="text-[#d3b484]/60 text-sm font-snpro leading-relaxed">
                    Sepertinya kamu sengaja masuk ke halaman ini, atau mungkin ada sesuatu yang salah dengan permainan. Tenang saja, tidak ada yang rusak kok! Coba kembali ke beranda dan mulai petualanganmu lagi, ya!
                </p>
            </div>
            <!-- Ornamen bintang -->
            <div class="flex gap-1 text-[#d3b484]/25 text-xs">
                <span>✦</span><span>✦</span><span>✦</span>
            </div>
            <!-- Tombol -->
            <div class="flex flex-wrap justify-center gap-4 mt-2">
                <button
                    @click="handleError"
                    class="relative hover:cursor-pointer px-8 py-3 text-xs font-snpro tracking-widest uppercase text-[#0d0a06] bg-[#d3b484] hover:bg-[#c4a070] transition-all group"
                >
                    <span class="absolute inset-0 ring-1 ring-inset ring-[#d3b484]/30 group-hover:ring-[#d3b484]/60 transition-all" />
                    Kembali ke Beranda
                </button>
                <NuxtLink
                    to="/game"
                    class="relative px-8 py-3 text-xs font-snpro tracking-widest uppercase text-[#d3b484] border border-[#d3b484]/40 hover:border-[#d3b484]/80 hover:bg-[#d3b484]/10 transition-all group"
                >
                    <span class="absolute inset-0 ring-1 ring-inset ring-[#d3b484]/10 group-hover:ring-[#d3b484]/30 transition-all" />
                    Mulai Bermain Lagi
                </NuxtLink>
            </div>
            <!-- Footer kecil -->
            <div class="flex items-center gap-3 mt-4">
                <div class="h-px w-12 bg-[#d3b484]/20" />
                <span class="text-[#d3b484]/25 text-[9px] tracking-widest font-snpro uppercase">Kupas Tuntas · 2025</span>
                <div class="h-px w-12 bg-[#d3b484]/20" />
            </div>
        </div>
    </div>
</template>

<style scoped>
.error-code {
    animation: fadeUp 1s ease forwards;
}

@keyframes fadeUp {
    from {
        opacity: 0;
        transform: translateY(40px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>