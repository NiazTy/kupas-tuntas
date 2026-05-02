<template>
    <section id="belajar-sejarah-seru" class="relative flex flex-col items-center justify-center w-full min-h-screen px-6 py-24 bg-[#0d0a06] overflow-hidden">
        <Ornament4 />
        <!-- Nomor halaman -->
        <div class="absolute z-20 flex items-center gap-3 top-8 right-16">
            <div class="h-px w-10 bg-[#d3b484]/30" />
            <span class="text-[#d3b484]/40 text-[10px] tracking-[0.4em] font-snpro uppercase">Hal. 03</span>
        </div>
        <!-- Konten -->
        <div class="relative z-20 flex flex-col items-center w-full max-w-5xl gap-10 mx-auto">
            <!-- Heading -->
            <div id="BSS-title" class="flex flex-col items-center gap-3 text-center transition-all duration-700 translate-y-4 opacity-0">
                <span class="text-[#d3b484]/50 text-xs tracking-[0.4em] uppercase font-snpro">✦ Ruang Belajar ✦</span>
                <h2 class="text-4xl sm:text-5xl font-bold font-snpro text-[#d3b484] leading-tight">
                    Belajar Sejarah <span class="text-[#810000]">dengan Seru</span>
                </h2>
                <div class="flex items-center gap-3 mt-1">
                    <div class="h-px w-16 bg-[#810000]/70" />
                    <div class="h-1 w-1 rounded-full bg-[#d3b484]/40" />
                    <div class="h-px w-8 bg-[#d3b484]/20" />
                </div>
            </div>
            <!-- Teks deskripsi -->
            <div id="BSS-content" class="w-full transition-all duration-700 delay-150 translate-y-4 opacity-0">
                <div class="border-l-2 border-[#810000]/60 pl-5 max-w-3xl mx-auto">
                    <p class="text-[#d3b484]/70 text-sm sm:text-base font-snpro leading-relaxed">
                        Di sini, kamu bisa menikmati berbagai video pembelajaran sejarah yang dikemas dengan cara yang seru, visual yang menarik, dan penjelasan yang mudah dipahami. Lewat konten pilihan dari <a href="https://youtube.com/playlist?list=PLCnD2jU_siVrTxiOGo-kbqGvFzEzONjdA&si=w8AM7Qp3SZk6wmoW" target="_blank" class="text-[#d3b484] border-b border-[#810000]/60 hover:border-[#d3b484]/60 transition-colors">Kok Bisa?</a>, kamu akan diajak menelusuri cerita, peristiwa, dan tokoh penting Indonesia dengan cara yang jauh dari kata membosankan.
                    </p>
                </div>
            </div>
            <!-- Video container dengan bingkai lawas -->
            <div id="video-container" class="relative w-full transition-all duration-700 delay-300 translate-y-4 opacity-0">
                <!-- Shadow offset -->
                <div class="absolute inset-0 translate-x-2 translate-y-2 border border-[#d3b484]/15" />
                <!-- Bingkai -->
                <div class="relative border border-[#d3b484]/30 bg-[#0d0a06]/60 p-4">
                    <div class="absolute top-2 left-2 w-5 h-5 border-t border-l border-[#d3b484]/40" />
                    <div class="absolute top-2 right-2 w-5 h-5 border-t border-r border-[#d3b484]/40" />
                    <div class="absolute bottom-2 left-2 w-5 h-5 border-b border-l border-[#d3b484]/40" />
                    <div class="absolute bottom-2 right-2 w-5 h-5 border-b border-r border-[#d3b484]/40" />
                    <!-- Video akan di-inject JS di sini -->
                    <div ref="videoWrapper" class="flex flex-col items-center w-full gap-8 md:flex-row md:items-start"></div>
                </div>
            </div>
            <div class="flex flex-col items-center gap-6 text-center">
                <div class="flex items-center gap-3">
                    <div class="h-px w-8 bg-[#d3b484]/20" />
                    <p class="text-[#d3b484]/60 text-sm font-snpro leading-relaxed">
                        Setelah menonton dan menambah wawasan, siap untuk bermain?
                    </p>
                    <div class="h-px w-8 bg-[#d3b484]/20" />
                </div>
                <div class="flex gap-5">
                    <a href="#menu" class="relative px-7 py-2.5 text-xs sm:text-sm font-snpro tracking-widest uppercase text-[#d3b484] border border-[#d3b484]/40 hover:border-[#d3b484]/80 hover:bg-[#d3b484]/10 transition-all group">
                        <span class="absolute inset-0 ring-1 ring-inset ring-[#d3b484]/10 group-hover:ring-[#d3b484]/30 transition-all" /> 
                        Mulai Bermain
                    </a>
                    <NuxtLink to="/mulai-belajar" class="relative px-7 py-2.5 text-xs sm:text-sm font-snpro tracking-widest uppercase text-[#0d0a06] bg-[#d3b484] hover:bg-[#c4a070] transition-all group">
                        Mulai Belajar
                        <span class="absolute inset-0 ring-1 ring-inset ring-[#d3b484]/30 group-hover:ring-[#d3b484]/60 transition-all" />
                    </NuxtLink>
                </div>
                <!-- Ornamen -->
                <div class="flex items-center gap-3 mt-2">
                    <div class="h-px w-6 bg-[#d3b484]/15" />
                    <span class="text-[#d3b484]/30 text-xs font-snpro">✦</span>
                    <div class="h-px w-6 bg-[#d3b484]/15" />
                </div>
            </div>
        </div>
    </section>
</template>

<script lang="ts" setup>
const videoWrapper = ref<HTMLElement | null>(null)

const videos: string[] = [
  "6lveJ8B_fWA?si=Kktp8eM03BO0BFDR",
  "2UR4ZiLahQg?si=ATVTkMfPQLRGBHZ6",
  "GVpvL3dextw?si=AO05mhvKbZOHhaEu"
]

function injectVideos() {
  if (!videoWrapper.value) return
  videoWrapper.value.innerHTML = videos.map(id => `
    <div class="w-full my-2 overflow-hidden shadow-lg aspect-video rounded-xl">
      <iframe 
        src="https://www.youtube.com/embed/${id}" 
        class="w-full h-full"
        allowfullscreen
      ></iframe>
    </div>
  `).join("")
}

function fadeUpOnScroll(selector: string): void {
  const elements = document.querySelectorAll<HTMLElement>(selector)
  if (elements.length === 0) return

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        (entry.target as HTMLElement).classList.remove("opacity-0", "translate-y-4")
        obs.unobserve(entry.target)
      }
    })
  }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" })

  elements.forEach(el => observer.observe(el))
}

function initContent() {
  nextTick(() => {
    injectVideos()

    const selectorsToAnimate = [
      "#BSS-title", "#BSS-content", "#video-container"
    ]
    selectorsToAnimate.forEach(selector => fadeUpOnScroll(selector))
  })
}

onMounted(() => {
  initContent()
})
</script>