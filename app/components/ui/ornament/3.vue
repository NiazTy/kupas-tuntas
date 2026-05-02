<template>
    <!-- Background gelap -->
    <div class="absolute inset-0 bg-[#0d0a06]"></div>
    <!-- Grain -->
    <div class="absolute inset-0 opacity-20 z-0" style="background-image: url('data:image/svg+xml,%3Csvg viewBox=%220 0 256 256%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22 opacity=%221%22/%3E%3C/svg%3E'); background-size: 200px 200px;"></div>
    <!-- Cahaya merah -->
    <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 rounded-full bg-[#810000]/20 blur-[120px] pointer-events-none"></div>
    <!-- Fade bawah -->
    <div class="absolute bottom-0 left-0 w-full h-40 bg-linear-to-t from-[#0d0a06] to-transparent z-10"></div>
    <!-- Ornamen sudut -->
    <div class="absolute top-5 left-5 w-12 h-12 border-t border-l border-[#d3b484]/40 pointer-events-none z-10"></div>
    <div class="absolute top-5 right-5 w-12 h-12 border-t border-r border-[#d3b484]/40 pointer-events-none z-10"></div>
    <div class="absolute bottom-5 left-5 w-12 h-12 border-b border-l border-[#d3b484]/40 pointer-events-none z-10"></div>
    <div class="absolute bottom-5 right-5 w-12 h-12 border-b border-r border-[#d3b484]/40 pointer-events-none z-10"></div>
    <div class="absolute inset-5 border border-[#d3b484]/10 pointer-events-none z-10"></div>
</template>