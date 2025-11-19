// data gamemode dan logika pemilihan gamemode
let gamemode = [
    {
        nama: "Tebak Gambar Pahlawan",
        deskripsi: "Silakan menebak gambar pahlawan berdasarkan clue yang telah diberikan, dalam waktu 2 menit.",
    },
    {
        nama: "Tebak Kejadian Sejarah",
        deskripsi: "Silakan menebak suara pahlawan berdasarkan clue yang telah diberikan, dalam waktu 2 menit.",
    },
    {
        nama: "Mode Cerita",
        deskripsi: "Silakan menebak kutipan pahlawan berdasarkan clue yang telah diberikan, dalam waktu 2 menit.",
    }
];

let selectedGamemode = 0;

// fungsi untuk render tampilan
function renderGamemode() {
    $("#gamemode").html(`
        <div class="w-full px-6 py-3 bg-white border shadow-sm border-maroon rounded-2xl">
            <h1 class="text-2xl font-bold text-maroon md:text-3xl font-display">
                ${gamemode[selectedGamemode].nama}
            </h1>
        </div>

        <p class="max-w-xl text-lg leading-relaxed text-white font-display">
            ${gamemode[selectedGamemode].deskripsi}
        </p>
        <!-- Tombol -->
        <div class="flex items-center gap-4 mt-4">
            <button id="mode-play" class="hover:cursor-pointer px-6 py-2 font-semibold transition bg-white text-maroon rounded-xl font-display hover:bg-yellow-400/90 hover:text-white">
                Mulai Game
            </button>

            <button id="htp" class="hover:cursor-pointer px-6 py-2 font-semibold text-white transition border border-maroon rounded-xl font-display hover:bg-maroon/10">
                Cara Bermain
            </button>
        </div>
    `);
}

// event click tombol mulai game
$(document).on("click", "#mode-play", function() {
    switch (selectedGamemode) {
        case 0:
            window.location.href = "tebak-gambar-pahlawan.html";
            break;
        case 1:
            window.location.href = "tebak-kejadian-sejarah.html";
            break;
        case 2:
            window.location.href = "mode-cerita.html";
            break;
        default:
            break;
    }
});

$(document).on("click", "#htp", function() {
    alert("Tampilkan popup / modal cara bermain di sini.");
});

// panggil fungsi render saat halaman dimuat
renderGamemode();

// event click tombol
$("#TGP-btn").on("click", function() {
    selectedGamemode = 0;
    renderGamemode();
});

$("#TKS-btn").on("click", function() {
    selectedGamemode = 1;
    renderGamemode();
});

$("#MC-btn").on("click", function() {
    selectedGamemode = 2;
    renderGamemode();
});