<template>
    <section id="about" class="relative min-h-screen bg-[#0d0a06] overflow-hidden flex items-center">
        <Ornament4 />
        <!-- Nomor halaman lawas -->
        <div class="absolute flex items-center gap-3 top-8 right-16">
            <div class="h-px w-10 bg-[#d3b484]/30" />
            <span class="text-[#d3b484]/40 text-[10px] tracking-[0.4em] font-snpro uppercase">Hal. 02</span>
        </div>
        <!-- Main content -->
        <div class="relative z-10 grid items-center w-full max-w-6xl grid-cols-1 gap-16 px-12 py-20 mx-auto md:grid-cols-2">
            <!-- Kolom Kiri: Visual / Ornamen -->
            <div class="flex flex-col items-center justify-center gap-6">
                <!-- Bingkai foto lawas -->
                <div class="relative w-64 h-80 md:w-72 md:h-96">
                    <!-- Shadow bingkai -->
                    <div class="absolute inset-0 translate-x-3 translate-y-3 border border-[#d3b484]/20" />
                    <!-- Bingkai utama -->
                    <div class="absolute inset-0 border-2 border-[#d3b484]/50 bg-[#1a1208]/80 flex flex-col items-center justify-center gap-4 p-6">
                        <!-- Ornamen dalam bingkai -->
                        <div class="absolute top-3 left-3 w-5 h-5 border-t border-l border-[#d3b484]/40" />
                        <div class="absolute top-3 right-3 w-5 h-5 border-t border-r border-[#d3b484]/40" />
                        <div class="absolute bottom-3 left-3 w-5 h-5 border-b border-l border-[#d3b484]/40" />
                        <div class="absolute bottom-3 right-3 w-5 h-5 border-b border-r border-[#d3b484]/40" />
                        <img src="~/assets/icons/kupas-tuntas-transparent.svg" class="object-contain h-24 opacity-90" />
                        <div class="w-full h-px bg-[#d3b484]/20" />
                        <div class="text-center">
                            <p class="text-[#d3b484]/50 text-[9px] tracking-[0.35em] uppercase font-snpro">Permainan Edukasi</p>
                            <p class="text-[#d3b484]/80 text-xs tracking-widest font-snpro mt-1">Sejarah Indonesia</p>
                        </div>
                        <!-- Stempel bulat -->
                        <div class="absolute -bottom-5 -right-5 w-16 h-16 rounded-full border-2 border-[#810000]/70 bg-[#0d0a06] flex items-center justify-center rotate-12">
                            <div class="w-12 h-12 rounded-full border border-[#810000]/50 flex items-center justify-center">
                                <p class="text-[#810000] text-[7px] tracking-wider text-center leading-tight font-snpro uppercase">© DKS<br/>2025</p>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Label bawah gambar -->
                <div class="flex items-center gap-3">
                    <div class="h-px w-6 bg-[#d3b484]/30" />
                    <p class="text-[#d3b484]/40 text-[10px] tracking-[0.3em] uppercase font-snpro">Tentang Permainan</p>
                    <div class="h-px w-6 bg-[#d3b484]/30" />
                </div>
            </div>
            <!-- Kolom Kanan: Teks -->
            <div class="flex flex-col gap-4">
                <!-- Heading -->
                <div class="flex flex-col gap-3">
                    <div class="flex items-center gap-3">
                        <span class="text-[#d3b484]/50 text-xs tracking-[0.4em] uppercase font-snpro">✦ Apa Itu</span>
                    </div>
                    <h2 class="text-[#d3b484] text-4xl md:text-5xl font-snpro font-bold leading-tight">
                        Kupas <span class="text-[#810000]">Tuntas</span>
                    </h2>
                    <!-- Garis judul -->
                    <div class="flex items-center gap-3 mt-1">
                        <div class="h-px w-16 bg-[#810000]/70" />
                        <div class="h-1 w-1 rounded-full bg-[#d3b484]/40" />
                        <div class="h-px w-8 bg-[#d3b484]/20" />
                    </div>
                </div>
                <!-- Nama panjang dengan ornamen -->
                <div class="border-l-2 border-[#810000]/60 pl-5">
                    <p class="text-[#d3b484]/60 text-xs tracking-wider font-snpro italic leading-relaxed">
                        "Kuis Pahlawan dan Sejarah Seru: Cari Tahu, Tangkap, dan Ungkap dengan Asik"
                    </p>
                </div>
                <!-- Deskripsi -->
                <p class="text-[#d3b484]/70 text-sm font-snpro leading-relaxed">
                    Permainan sejarah interaktif yang membawa pengalaman baru dalam belajar sejarah menjadi seru dan asik. Melalui tantangan singkat untuk mengenal para pahlawan dan sejarah Indonesia, kamu akan belajar banyak hal seperti kontribusi mereka dan fakta dibalik peristiwa tersebut dengan mudah dan tidak membosankan.
                </p>
                <!-- Fitur / poin -->
                <div class="grid grid-cols-1 gap-3">
                    <div v-for="(item, i) in features" :key="i" class="flex items-start gap-3 group">
                        <div class="mt-0.5 w-5 h-5 border border-[#810000]/50 flex items-center justify-center shrink-0 group-hover:border-[#d3b484]/60 transition-colors">
                            <span class="text-[#810000] text-[10px]">✦</span>
                        </div>
                        <p class="text-[#d3b484]/60 text-xs font-snpro leading-relaxed tracking-wide">{{ item }}</p>
                    </div>
                </div>
                <!-- CTA -->
                <div class="flex items-center gap-6 mt-2">
                    <a href="#menu" class="px-7 py-2.5 bg-[#810000] text-[#d3b484] text-xs font-snpro tracking-widest uppercase hover:bg-[#a00000] transition-colors relative group">
                        <span class="absolute inset-0 ring-1 ring-[#d3b484]/20 group-hover:ring-[#d3b484]/50 transition-all" />
                        Mulai Sekarang
                    </a>
                    <div class="flex items-center gap-2 text-[#d3b484]/40 text-[10px] font-snpro tracking-widest uppercase">
                        <div class="h-px w-6 bg-[#d3b484]/20" />
                        Gratis
                    </div>
                </div>
            </div>
        </div>
        <!-- Label bawah -->
        <div class="absolute flex items-center gap-3 -translate-x-1/2 bottom-8 left-1/2">
            <div class="h-px w-12 bg-[#d3b484]/20" />
            <span class="text-[#d3b484]/30 text-[9px] tracking-[0.5em] uppercase font-snpro">Kupas Tuntas · {{ new Date().getFullYear() }}</span>
            <div class="h-px w-12 bg-[#d3b484]/20" />
        </div>
    </section>
</template>

<script setup>
const features = [
    "Tebak pahlawan dari petunjuk singkat yang makin menantang",
    "Kenali kontribusi nyata para pahlawan bagi Indonesia",
    "Belajar sejarah dengan cara yang asik, cepat, dan interaktif",
]
</script>