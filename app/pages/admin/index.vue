<script setup lang="ts">
const loading = ref(true)
const saving = ref(false)
const gameData = ref<any>({})

const isAuthenticated = ref(false)
const password = ref("")
const loginError = ref("")
const loggingIn = ref(false)

const categories = [
  { id: "pickAndGuess", label: "Pick & Guess" },
  { id: "imageGuess", label: "Image Guess" },
  { id: "historyArchive", label: "History Archive" },
  { id: "partners", label: "Partners" }
]

const activeCategory = ref("pickAndGuess")

const currentDataList = computed<any[]>(() => {
  if (!gameData.value) return []
  if (activeCategory.value === "historyArchive") {
    return [gameData.value.historyArchive]
  }
  return gameData.value[activeCategory.value] || []
})

const selectedItemIndex = ref<number | null>(null)

const activeItem = computed(() => {
  if (selectedItemIndex.value === null) return null
  return currentDataList.value[selectedItemIndex.value]
})

const fetchGameData = async () => {
  loading.value = true
  try {
    const res = await $fetch("/api/admin/data")
    gameData.value = res
    isAuthenticated.value = true
  } catch (error: any) {
    if (error.response?.status === 401) {
      isAuthenticated.value = false
    } else {
      console.error("Failed to fetch game data:", error)
      alert("Gagal memuat data")
    }
  } finally {
    loading.value = false
  }
}

const login = async () => {
  loggingIn.value = true
  loginError.value = ""
  try {
    await $fetch("/api/admin/login", {
      method: "POST",
      body: { password: password.value }
    })
    isAuthenticated.value = true
    await fetchGameData()
  } catch (error: any) {
    loginError.value = "Password salah!"
  } finally {
    loggingIn.value = false
  }
}

const logout = async () => {
  try {
    await $fetch("/api/admin/logout", { method: "POST" })
    isAuthenticated.value = false
    gameData.value = {}
    password.value = ""
  } catch (error) {
    console.error("Logout failed", error)
  }
}

onMounted(() => {
  fetchGameData()
})

const selectItem = (index: number) => {
  selectedItemIndex.value = index
}

const saveData = async () => {
  saving.value = true
  try {
    await $fetch("/api/admin/data", {
      method: "PUT",
      body: {
        type: activeCategory.value,
        data: gameData.value[activeCategory.value]
      }
    })
    alert("Data berhasil disimpan!")
  } catch (error) {
    console.error("Gagal menyimpan data:", error)
    alert("Terjadi kesalahan saat menyimpan data.")
  } finally {
    saving.value = false
  }
}

const parseNestedObj = (obj: any) => {
  return JSON.stringify(obj, null, 2)
}

const updateNestedObj = (item: any, key: string | number, event: Event) => {
  try {
    const val = (event.target as HTMLTextAreaElement).value
    item[key] = JSON.parse(val)
  } catch (e) {}
}

definePageMeta({
  layout: "header"
})
</script>

<template>
  <div class="font-snpro">
    <div v-if="loading && !isAuthenticated" class="min-h-screen bg-[#0d0a06] flex justify-center items-center">
      <div class="flex flex-col items-center gap-3">
        <div class="flex gap-1 text-[#d3b484]/40 text-xs">
          <span>✦</span><span>✦</span><span>✦</span>
        </div>
        <p class="text-[#d3b484]/50 text-[10px] tracking-[0.4em] uppercase animate-pulse">
          Memeriksa Autentikasi...
        </p>
      </div>
    </div>
    <div v-else-if="!isAuthenticated" class="min-h-screen bg-[#0d0a06] flex items-center justify-center px-6">
      <!-- Ornamen sudut -->
      <Ornament2 />
      <div class="relative w-full max-w-sm">
        <!-- Shadow offset -->
        <div class="absolute inset-0 translate-x-1.5 translate-y-1.5 border border-[#d3b484]/10" />
        <div class="relative border border-[#d3b484]/30 bg-[#0d0a06] px-8 py-10 flex flex-col gap-6">
          <!-- Corner marks -->
          <div class="absolute top-2 left-2 w-4 h-4 border-t border-l border-[#d3b484]/30" />
          <div class="absolute top-2 right-2 w-4 h-4 border-t border-r border-[#d3b484]/30" />
          <div class="absolute bottom-2 left-2 w-4 h-4 border-b border-l border-[#d3b484]/30" />
          <div class="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-[#d3b484]/30" />
          <!-- Header -->
          <div class="flex flex-col items-center gap-2 border-b border-[#d3b484]/15 pb-5">
            <p class="text-[#d3b484]/30 text-[8px] tracking-[0.4em] uppercase">Akses Terbatas</p>
            <h1 class="text-xl font-display text-[#d3b484] tracking-widest text-center">
              Admin Panel
            </h1>
            <div class="flex gap-1 text-[#d3b484]/20 text-[9px]">
              <span>✦</span><span>✦</span><span>✦</span>
            </div>
          </div>
          <!-- Form -->
          <form @submit.prevent="login" class="flex flex-col gap-4">
            <div class="flex flex-col gap-1.5">
              <label class="text-[8px] tracking-[0.3em] uppercase text-[#d3b484]/50">
                Kata Sandi
              </label>
              <div class="border-b border-[#d3b484]/30 pb-1 focus-within:border-[#d3b484]/70 transition-colors">
                <input
                  v-model="password"
                  type="password"
                  placeholder="••••••••"
                  class="w-full bg-transparent text-[#d3b484] text-sm placeholder-[#d3b484]/20 focus:outline-none tracking-widest"
                />
              </div>
              <p v-if="loginError" class="text-[#ffb3b3] text-[9px] tracking-widest uppercase mt-0.5">
                ✗ {{ loginError }}
              </p>
            </div>
            <button
              type="submit"
              :disabled="loggingIn"
              class="relative mt-2 px-8 py-3 text-xs tracking-widest uppercase bg-[#810000] text-[#d3b484] hover:bg-[#a00000] disabled:opacity-40 disabled:cursor-not-allowed transition-all group"
            >
              <span class="absolute inset-0 ring-1 ring-inset ring-[#d3b484]/10 group-hover:ring-[#d3b484]/30 transition-all" />
              {{ loggingIn ? 'Memverifikasi...' : 'Masuk' }}
            </button>
          </form>
          <!-- Footer -->
          <div class="flex items-center justify-center gap-2 pt-2 border-t border-[#d3b484]/10">
            <div class="h-px w-6 bg-[#d3b484]/15" />
            <p class="text-[7px] tracking-[0.3em] uppercase text-[#d3b484]/20">Kupas Tuntas · 2025</p>
            <div class="h-px w-6 bg-[#d3b484]/15" />
          </div>
        </div>
      </div>
    </div>
    <div v-else class="h-screen bg-[#0d0a06] flex flex-col overflow-hidden">
      <!-- Ornamen -->
      <div class="fixed top-5 left-5 w-10 h-10 border-t border-l border-[#d3b484]/15 pointer-events-none z-0" />
      <div class="fixed top-5 right-5 w-10 h-10 border-t border-r border-[#d3b484]/15 pointer-events-none z-0" />
      <div class="fixed bottom-5 left-5 w-10 h-10 border-b border-l border-[#d3b484]/15 pointer-events-none z-0" />
      <div class="fixed bottom-5 right-5 w-10 h-10 border-b border-r border-[#d3b484]/15 pointer-events-none z-0" />>
      <!-- Header -->
      <header class="relative z-10 flex justify-between items-center px-8 py-5 border-b border-[#d3b484]/15">
        <div class="flex flex-col gap-0.5">
          <p class="text-[#d3b484]/30 text-[8px] tracking-[0.4em] uppercase">Papan Instrumen Pengelola</p>
          <h1 class="text-lg font-display text-[#d3b484]">Admin Panel</h1>
        </div>
        <div class="flex gap-3">
          <button @click="logout" class="relative px-5 py-2 text-[10px] tracking-widest uppercase text-[#d3b484]/60 border border-[#d3b484]/20 hover:border-[#d3b484]/50 hover:text-[#d3b484] transition-all group">
            <span class="absolute inset-0 ring-1 ring-inset ring-[#d3b484]/5 group-hover:ring-[#d3b484]/20 transition-all" />
            Keluar
          </button>
          <button @click="saveData" :disabled="saving" class="relative px-6 py-2 text-[10px] tracking-widest uppercase bg-[#810000] text-[#d3b484] hover:bg-[#a00000] disabled:opacity-40 transition-all group">
            <span class="absolute inset-0 ring-1 ring-inset ring-[#d3b484]/10 group-hover:ring-[#d3b484]/30 transition-all" />
            {{ saving ? 'Menyimpan...' : 'Simpan Perubahan' }}
          </button>
        </div>
      </header>
      <!-- Loading data -->
      <div v-if="loading" class="flex-1 flex justify-center items-center">
        <p class="text-[#d3b484]/40 text-[10px] tracking-[0.4em] uppercase animate-pulse">Memuat Data...</p>
      </div>
      <!-- Main content -->
      <div v-else class="flex flex-1 overflow-hidden px-8 py-6 gap-6">
        <!-- Sidebar Kategori -->
        <div class="w-52 flex flex-col gap-1 shrink-0">
          <p class="text-[#d3b484]/30 text-[8px] tracking-[0.4em] uppercase mb-2">Kategori</p>
          <button
            v-for="cat in categories"
            :key="cat.id"
            @click="activeCategory = cat.id; selectedItemIndex = null"
            class="relative text-left px-4 py-2.5 text-xs tracking-widest uppercase transition-all"
            :class="activeCategory === cat.id
              ? 'text-[#d3b484] border border-[#d3b484]/30 bg-[#d3b484]/5'
              : 'text-[#d3b484]/40 border border-transparent hover:text-[#d3b484]/70 hover:border-[#d3b484]/15'"
          >
            <span v-if="activeCategory === cat.id" class="absolute left-1.5 top-1/2 -translate-y-1/2 text-[#810000] text-[8px]">✦</span>
            {{ cat.label }}
          </button>
        </div>
        <!-- Divider -->
        <div class="w-px bg-[#d3b484]/10 shrink-0" />
        <!-- Daftar Item -->
        <div class="w-64 flex flex-col gap-1 overflow-y-auto shrink-0 pr-2">
          <p class="text-[#d3b484]/30 text-[8px] tracking-[0.4em] uppercase mb-2">Daftar Item</p>
          <div v-if="activeCategory === 'historyArchive'">
            <button
              @click="selectItem(0)"
              class="relative w-full text-left px-4 py-2.5 text-xs tracking-widest uppercase transition-all"
              :class="selectedItemIndex === 0
                ? 'text-[#d3b484] border border-[#d3b484]/30 bg-[#d3b484]/5'
                : 'text-[#d3b484]/40 border border-transparent hover:text-[#d3b484]/70 hover:border-[#d3b484]/15'"
            >
              <span v-if="selectedItemIndex === 0" class="absolute left-1.5 top-1/2 -translate-y-1/2 text-[#810000] text-[8px]">✦</span>
              Semua Arsip
            </button>
          </div>
          <div v-else class="flex flex-col gap-1">
            <button
              v-for="(item, index) in currentDataList"
              :key="item.id || index"
              @click="selectItem(index)"
              class="relative w-full text-left px-4 py-2.5 text-xs tracking-widest uppercase transition-all"
              :class="selectedItemIndex === index
                ? 'text-[#d3b484] border border-[#d3b484]/30 bg-[#d3b484]/5'
                : 'text-[#d3b484]/40 border border-transparent hover:text-[#d3b484]/70 hover:border-[#d3b484]/15'"
            >
              <span v-if="selectedItemIndex === index"
                    class="absolute left-1.5 top-1/2 -translate-y-1/2 text-[#810000] text-[8px]">✦</span>
              <span class="truncate block pl-2">{{ item.name || item.id || `Item ${index + 1}` }}</span>
            </button>
          </div>
        </div>
        <!-- Divider -->
        <div class="w-px bg-[#d3b484]/10 shrink-0" />
        <!-- Editor Panel -->
        <div class="flex-1 overflow-y-auto">
          <p class="text-[#d3b484]/30 text-[8px] tracking-[0.4em] uppercase mb-4">Editor</p>
          <div v-if="activeItem" class="flex flex-col gap-4">
            <div
              v-for="(val, key) in activeItem"
              :key="key"
              class="flex flex-col gap-1.5"
            >
              <label class="text-[8px] tracking-[0.3em] uppercase text-[#d3b484]/50">{{ key }}</label>
              <input
                v-if="typeof val === 'string' || typeof val === 'number'"
                v-model="activeItem[key]"
                :type="typeof val === 'number' ? 'number' : 'text'"
                class="bg-transparent border-b border-[#d3b484]/25 pb-1 text-[#d3b484] text-sm focus:outline-none focus:border-[#d3b484]/60 transition-colors placeholder-[#d3b484]/20"
              />
              <textarea
                v-else
                :value="parseNestedObj(val)"
                @change="updateNestedObj(activeItem, key, $event)"
                rows="5"
                class="bg-[#d3b484]/3 border border-[#d3b484]/15 px-3 py-2 text-[#d3b484] font-mono text-xs focus:outline-none focus:border-[#d3b484]/40 transition-colors resize-y"
              />
            </div>
          </div>
          <div v-else class="h-64 flex flex-col items-center justify-center gap-3">
            <div class="flex gap-1 text-[#d3b484]/15 text-xs">
              <span>✦</span><span>✦</span><span>✦</span>
            </div>
            <p class="text-[#d3b484]/25 text-[9px] tracking-[0.3em] uppercase">
              Pilih item untuk mengedit
            </p>
          </div>
        </div>
      </div>
      <!-- Footer -->
      <div class="flex items-center justify-center gap-3 py-4 border-t border-[#d3b484]/10">
        <div class="h-px w-10 bg-[#d3b484]/15" />
        <span class="text-[#d3b484]/20 text-[8px] tracking-widest uppercase">Kupas Tuntas · 2025</span>
        <div class="h-px w-10 bg-[#d3b484]/15" />
      </div>
    </div>
  </div>
</template>

<style scoped>
* { scrollbar-width: thin; scrollbar-color: rgba(211, 180, 132, 0.15) transparent; }
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: rgba(211, 180, 132, 0.15); }
::-webkit-scrollbar-thumb:hover { background: rgba(211, 180, 132, 0.3); }
</style>