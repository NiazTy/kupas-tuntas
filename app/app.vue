<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import { gameAssets } from "~/data/assets"

const bgm = gameAssets.bGM.find(p => p.includes("forgotten")) ?? gameAssets.bGM[0]

onMounted(() => {
  useMusicStore().init(bgm)
})
</script>