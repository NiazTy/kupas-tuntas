<template>
    <!-- Overlay gelap + grain texture -->
    <div class="absolute inset-0 bg-black/60" />
    <div class="absolute inset-0 opacity-30" style="background-image: url('data:image/svg+xml,%3Csvg viewBox=%220 0 256 256%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22 opacity=%221%22/%3E%3C/svg%3E'); background-size: 200px 200px;" />
    <!-- Border ornamen lawas -->
    <div class="absolute inset-4 border border-[#d3b484]/40 pointer-events-none" />
    <div class="absolute inset-6 border border-[#d3b484]/20 pointer-events-none" />
    <!-- Sudut ornamen -->
    <div class="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-[#d3b484]/70 pointer-events-none" />
    <div class="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-[#d3b484]/70 pointer-events-none" />
    <div class="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-[#d3b484]/70 pointer-events-none" />
    <div class="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-[#d3b484]/70 pointer-events-none" />
    <!-- Garis horizontal atas & bawah -->
    <div class="absolute top-12 left-12 right-12 h-px bg-[#d3b484]/30 pointer-events-none" />
    <div class="absolute bottom-12 left-12 right-12 h-px bg-[#d3b484]/30 pointer-events-none" />
</template>