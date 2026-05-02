/**
 * composables/useAssetManager.ts
 *
 * Composable untuk preload aset gambar sebelum user masuk ke halaman.
 * Aman dipakai di halaman manapun — state di-reset setiap startLoading() dipanggil.
 */

import { ref } from 'vue'

interface AssetManagerOptions {
  /** Timeout per aset dalam ms sebelum dianggap gagal (default: 8000) */
  timeout?: number
  /** Jika true, loading tetap selesai meski ada aset yang gagal (default: true) */
  continueOnError?: boolean
  /** Delay minimum sebelum loading dianggap selesai, ms (default: 0) */
  minDuration?: number
}

export function useAssetManager(assets: string[], options: AssetManagerOptions = {}) {
  const {
    timeout = 8000,
    continueOnError = true,
    minDuration = 0,
  } = options

  const progress = ref(0)
  const loading = ref(true)
  const failedAssets = ref<string[]>([])

  const total = assets.length

  const startLoading = (): Promise<void> => {
    let loaded = 0
    progress.value = 0
    loading.value = true
    failedAssets.value = []

    if (total === 0) {
      progress.value = 100
      loading.value = false
      return Promise.resolve()
    }

    const startTime = Date.now()

    return new Promise((resolve) => {
      const onAssetDone = () => {
        loaded++
        progress.value = Math.floor((loaded / total) * 100)

        if (loaded === total) {
          const elapsed = Date.now() - startTime
          const remaining = Math.max(0, minDuration - elapsed)

          setTimeout(() => {
            progress.value = 100
            loading.value = false
            resolve()
          }, remaining)
        }
      }

      assets.forEach((src) => {
        const img = new Image()
        let settled = false

        const timer = setTimeout(() => {
          if (settled) return
          settled = true
          failedAssets.value.push(src)
          if (continueOnError) onAssetDone()
        }, timeout)

        img.onload = () => {
          if (settled) return
          settled = true
          clearTimeout(timer)
          onAssetDone()
        }

        img.onerror = () => {
          if (settled) return
          settled = true
          clearTimeout(timer)
          failedAssets.value.push(src)
          if (continueOnError) onAssetDone()
        }

        img.src = src
      })
    })
  }

  return { progress, loading, failedAssets, startLoading }
}