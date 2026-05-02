const toast = ref<{ show: boolean; message: string }>({ 
    show: false, 
    message: "" 
})

let toastTimer: ReturnType<typeof setTimeout> | null = null

export const useToast = () => {
    const showToast = (msg: string) => {
        if (toastTimer) clearTimeout(toastTimer)
            toast.value = { show: true, message: msg }
        toastTimer = setTimeout(() => {
            toast.value = { ...toast.value, show: false }
        }, 3000)
    }

    const hideToast = () => {
        toast.value = { ...toast.value, show: false }
    }

    return { toast: readonly(toast), showToast, hideToast }
}