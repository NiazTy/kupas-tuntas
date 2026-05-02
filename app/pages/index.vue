<script setup lang="ts">
usePageMusic(true)

const content = [
  `Halo pemain yang melihat ini melalui console log! 👋`,
  `Kami dari Dikalasenja, pengembang Kupas Tuntas, ingin mengucapkan terima kasih karena telah mampir ke sini. Kami sangat senang bisa berbagi permainan ini dengan kalian semua!`,
  `Kupas Tuntas adalah hasil kerja keras dan dedikasi kami untuk menciptakan pengalaman belajar sejarah yang seru dan interaktif. Kami berharap kalian menikmati permainan ini sebanyak kami menikmatinya saat membuatnya.`,
  `Jika kalian memiliki pertanyaan, saran, atau hanya ingin menyapa, jangan ragu untuk menghubungi kami melalui media sosial atau website kami di https://dikalasenja.id. Kami selalu terbuka untuk mendengar dari kalian!`,
  `Terima kasih telah menjadi bagian dari perjalanan Kupas Tuntas. Selamat bermain dan semoga kalian menemukan banyak hal menarik tentang sejarah dan pahlawan Indonesia!`,
  `Salam hangat,`,
  `Tim Dikalasenja`
]

useHead({
  title: "Kupas Tuntas - Kuis Pahlawan dan Sejarah Seru",
  meta: [
    { 
      name: "description", 
      content: "KUPAS TUNTAS atau Kuis Pahlawan dan Sejarah Seru: Cari Tahu, Tangkap, dan Ungkap dengan Asik adalah permainan tebak pahlawan interaktif yang membuktikan bahwa belajar sejarah bisa menjadi pengalaman yang seru dan menyenangkan. Melalui tantangan singkat, kamu diajak mengenal lebih dekat para pahlawan Indonesia dan kontribusi mereka bagi bangsa." 
    },
  ],
  script: [
    {
      innerHTML: `console.log(${JSON.stringify(content.join("\n\n"))})`, 
    }
  ],
})

import { gameAssets, allGameAssets } from "~/data/assets"

const { progress, loading, startLoading } = useAssetManager(allGameAssets, {
  minDuration: 3000,
  continueOnError: true,
})

onMounted(async () => {
  await startLoading()
})

const artworkRoom = gameAssets.pictures.artwork.find(p =>
  p.includes("ruangan-kosong")
) ?? gameAssets.pictures.artwork[0]
</script>

<template>
  <Transition name="fade">
    <LoadingScreen v-if="loading" :progress="progress" />
  </Transition>

  <div v-if="!loading" class="home-page">
    <LandingHero :asset="artworkRoom" />
    <LandingAbout />
    <LandingLearning />
  </div>
</template>