interface AssetManagerOptions {
  timeout?: number
  continueOnError?: boolean
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
        let settled = false

        const timer = setTimeout(() => {
          if (settled) return
          settled = true
          failedAssets.value.push(src)
          if (continueOnError) onAssetDone()
        }, timeout)

        const finish = (failed: boolean) => {
          if (settled) return
          settled = true
          clearTimeout(timer)
          if (failed) {
            failedAssets.value.push(src)
            if (continueOnError) onAssetDone()
          } else {
            onAssetDone()
          }
        }

        const isAudio = src.endsWith(".wav") || src.endsWith(".mp3") || src.endsWith(".ogg")

        if (isAudio) {
          const audio = new Audio()
          audio.oncanplaythrough = () => finish(false)
          audio.onerror = () => finish(true)
          audio.src = src
          audio.load()
        } else {
          const img = new Image()
          img.src = src

          if (typeof img.decode === "function") {
            img.decode()
              .then(() => finish(false))
              .catch(() => {
                finish(true)
              })
          } else {
            const fallbackImg = img as any
            fallbackImg.onload = () => finish(false)
            fallbackImg.onerror = () => finish(true)
          }
        }
      })
    })
  }

  return { progress, loading, failedAssets, startLoading }
}