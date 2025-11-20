// data gamemode dan logika pemilihan gamemode
let gamemode = [
    {
        nama: "Tebak Gambar Pahlawan",
        deskripsi: "Di mode ini, kamu akan menebak siapa pahlawan yang muncul melalui gambar dan clue yang sudah disiapkan. Setiap soal menghadirkan potongan visual yang memancing rasa penasaran, dan kamu harus menebak dengan cepat sebelum waktu 2 menit habis. Jawab setiap pertanyaan, kumpulkan skor, dan lihat seberapa banyak pahlawan yang bisa kamu kenali dalam waktu singkat. Fokus pada gambar, baca cluenya, dan siap-siap berburu jawaban dengan cepat!",
        youtube: "https://www.youtube.com/embed/68ky7AZffvY?si=RCEtPv37UcCsBgqf"
    },
    {
        nama: "Tebak Kejadian Sejarah",
        deskripsi: "Di mode ini, kamu menebak sebuah peristiwa sejarah berdasarkan clue yang diberikan. Setiap soal menggambarkan momen penting bangsa, dan kamu harus menebaknya sebelum waktu 2 menit habis. Jawab cepat, kumpulkan skor, dan lihat seberapa jauh kamu mengenal perjalanan sejarah Indonesia!",
        youtube: "https://www.youtube.com/embed/uEZDOGmTxoA?si=hJwrF3F8Z0NsY5K9" // bisa diganti nanti
    },
];


let selectedGamemode = 0;

function renderGamemode() {
    $("#gamemode").html(`
        <div class="w-full px-6 py-3 bg-white border shadow-sm border-maroon rounded-2xl">
            <h1 class="text-2xl font-bold text-maroon md:text-3xl font-display">
                ${gamemode[selectedGamemode].nama}
            </h1>
        </div>

        <p class="text-md text-justify text-white font-display">
            ${gamemode[selectedGamemode].deskripsi}
        </p>

        <div class="flex items-center gap-4 mt-6">
            <button id="mode-play" class="hover:cursor-pointer px-6 py-2 font-semibold transition bg-white text-maroon rounded-xl font-display hover:bg-yellow-400/90 hover:text-white">
                Mulai Game
            </button>

            <button id="htp" class="hover:cursor-pointer px-6 py-2 font-semibold text-white transition border border-maroon rounded-xl font-display hover:bg-maroon/10">
                Cara Bermain
            </button>
        </div>
    `);
}

function openHtpModal() {
    const gm = gamemode[selectedGamemode];

    $("#htp-gamemode-title").text("Cara Bermain – " + gm.nama);
    $("#htp-gamemode-label").text(gm.nama);

    const videoSrc = gm.youtube ? gm.youtube : "";

    $("#htp-iframe").attr("src", videoSrc);
    $("#htp-modal").removeClass("hidden").addClass("flex");
}

function closeHtpModal() {
    $("#htp-modal").removeClass("flex").addClass("hidden");
    $("#htp-iframe").attr("src", "");
}

function scrollToGamemode() {
    const gm = document.getElementById("gamemode");
    if (!gm) return;
    const y = gm.getBoundingClientRect().top + window.pageYOffset - 120; 

    window.scrollTo({
        top: y,
        behavior: "smooth"
    });
}

function changeGamemode(index) {
    if (selectedGamemode === index) {
        scrollToGamemode();
        return;
    }
    selectedGamemode = index;

    const $gm = $("#gamemode");
    $gm.addClass("gm-hidden");

    setTimeout(function () {
        renderGamemode();

        $gm.addClass("gm-hidden");
        requestAnimationFrame(function () {
            $gm.removeClass("gm-hidden");
        });
    }, 250);

    setTimeout(scrollToGamemode, 260);
}

$(document).on("click", "#mode-play", function() {
    switch (selectedGamemode) {
        case 0:
            window.location.href = "tebak-gambar-pahlawan.html";
            break;
        case 1:
            window.location.href = "tebak-kejadian-sejarah.html";
            break;
        default:
            break;
    }
});

$(document).on("click", "#htp", function() {
    openHtpModal();
});
$(document).on("click", "#htp-close", function() {
    closeHtpModal();
});
$(document).on("click", "#htp-modal", function(e) {
    if (e.target.id === "htp-modal") {
        closeHtpModal();
    }
});

renderGamemode();

$("#TGP-btn").on("click", function() {
    changeGamemode(0);
});

$("#TKS-btn").on("click", function() {
    changeGamemode(1);
});