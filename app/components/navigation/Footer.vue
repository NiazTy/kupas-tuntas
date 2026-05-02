<template>
    <footer class="w-full text-[#810000] px-4 py-8 bg-white md:px-16">
        <div class="flex flex-col items-center gap-6 mx-auto text-center md:flex-row md:justify-between md:text-left">
            <p class="order-2 font-semibold text-md md:order-1 text-maroon md:text-sm text-display">
                © {{ new Date().getFullYear() }} <a href="https://dikalasenja.id" class="">Dikalasenja</a>
            </p>
            <ul class="flex flex-col items-start order-1 gap-2 md:order-2 text-maroon font-display text-display md:flex-row md:gap-6">
                <li v-for="menu in menus" :key="menu.name" class="transition-all duration-300">
                    <a :href="menu.to" class="relative font-semibold group text-md md:text-sm">
                        {{ menu.name }}
                        <span class="absolute left-0 bottom-0 w-0 h-0.5 bg-[#810000] transition-all duration-300 group-hover:w-full" />
                    </a>
                </li>
            </ul>
        </div>
    </footer>
</template>

<script lang="ts" setup>
const menus = [
    { 
        name: "BERANDA", 
        to: "/" ,
    },
    { 
        name: "TENTANG KUPAS TUNTAS", 
        to: "/#about",
    },
    {
        name: "BELAJAR SEJARAH SERU ", 
        to: "/mulai-belajar",
    }
];
</script>