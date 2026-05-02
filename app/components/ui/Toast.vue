<script setup lang="ts">
defineProps<{
    toast: { show: boolean, message: string }
}>()

defineEmits(['close'])
</script>

<template>
    <Transition
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0 translate-y-4"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 translate-y-4"
    >
        <div v-if="toast.show" class="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4">
            <div class="absolute inset-0 translate-x-1.5 translate-y-1.5 border border-[#810000]/30 bg-transparent" />
            <div class="relative border border-[#810000]/70 bg-[#1a0800] px-6 py-3 flex items-center gap-3">
                <div class="absolute top-1.5 left-1.5 w-3 h-3 border-t border-l border-[#d3b484]/40" />
                <div class="absolute top-1.5 right-1.5 w-3 h-3 border-t border-r border-[#d3b484]/40" />
                <div class="absolute bottom-1.5 left-1.5 w-3 h-3 border-b border-l border-[#d3b484]/40" />
                <div class="absolute bottom-1.5 right-1.5 w-3 h-3 border-b border-r border-[#d3b484]/40" />
                <span class="text-[#810000] text-sm">✦</span>
                <p class="text-[#d3b484]/90 text-xs font-snpro tracking-wider">{{ toast.message }}</p>
                <button @click="$emit('close')" class="text-[#d3b484]/40 hover:text-[#d3b484]/80 hover:cursor-pointer text-xs font-snpro ml-2 transition-colors">✕</button>
            </div>
        </div>
  </Transition>
</template>