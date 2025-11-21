// Data card video (bisa kamu ganti link & judulnya)
const videoData = [
    {
        title: "Asal-usul Nama Indonesia",
        desc: "Kenapa negara kita disebut “Indonesia”? Dari mana istilah itu muncul dan siapa yang pertama kali mempopulerkannya?",
        url: "https://www.youtube.com/results?search_query=asal+usul+nama+indonesia",
        tag: "Konsep Bangsa"
    },
    {
        title: "Proses Panjang Menuju Proklamasi",
        desc: "Bukan hanya 17 Agustus 1945. Ada banyak peristiwa penting yang mengantar Indonesia menuju kemerdekaan.",
        url: "https://www.youtube.com/results?search_query=sejarah+proklamasi+kemerdekaan+indonesia",
        tag: "Kemerdekaan"
    },
    {
        title: "Perlawanan Pahlawan Daerah",
        desc: "Mengenal pahlawan dari berbagai daerah yang kisahnya sering luput dari buku pelajaran di kelas.",
        url: "https://www.youtube.com/results?search_query=pahlawan+daerah+indonesia",
        tag: "Pahlawan Daerah"
    },
    {
        title: "Sumpah Pemuda dan Persatuan",
        desc: "Bagaimana Sumpah Pemuda menjadi titik penting lahirnya semangat satu tanah air, bangsa, dan bahasa.",
        url: "https://www.youtube.com/results?search_query=sumpah+pemuda",
        tag: "Pergerakan Nasional"
    },
    {
        title: "Perjalanan Panjang Bendera Merah Putih",
        desc: "Dari simbol perjuangan hingga menjadi bendera resmi negara. Apa makna di balik Merah Putih?",
        url: "https://www.youtube.com/results?search_query=sejarah+bendera+merah+putih",
        tag: "Simbol Negara"
    }
];

// Data ringkasan perpustakaan mini
const ringkasanData = { 
    "pergerakan-nasional": {
        title: "Pergerakan Nasional",
        body: 
        `Pergerakan nasional adalah masa ketika rakyat Nusantara mulai menyadari bahwa penjajahan tidak bisa dilawan secara sendiri-sendiri. 
        Organisasi seperti Budi Utomo (1908), Sarekat Islam, dan Indische Partij menjadi wadah awal kaum terpelajar untuk berkumpul, berdiskusi, dan menyusun strategi perjuangan.
        Puncak semangat persatuan itu tampak dalam peristiwa Sumpah Pemuda tahun 1928, ketika para pemuda dari berbagai daerah berikrar: satu nusa, satu bangsa, dan satu bahasa – Indonesia. 
        Dari sinilah identitas “bangsa Indonesia” mulai terbentuk secara kuat.`
    },
    "proklamasi-kemerdekaan": {
        title: "Proklamasi Kemerdekaan Indonesia",
        body:
        `Proklamasi kemerdekaan Indonesia dibacakan oleh Soekarno pada 17 Agustus 1945 di Jakarta. Namun, peristiwa ini bukan terjadi secara tiba-tiba.
        Sebelumnya, ada perdebatan antara golongan tua dan golongan muda tentang waktu dan cara memproklamasikan kemerdekaan. Peristiwa Rengasdengklok menjadi salah satu momen penting ketika para pemuda “mendesak” Soekarno-Hatta agar segera memproklamasikan kemerdekaan tanpa campur tangan Jepang.
        Naskah proklamasi disusun di rumah Laksamana Tadashi Maeda, lalu diketik oleh Sayuti Melik dengan beberapa perubahan kecil. 
        Setelah proklamasi, perjuangan belum selesai. Berbagai daerah bangkit mempertahankan kemerdekaan melalui pertempuran dan diplomasi melawan Belanda yang ingin kembali berkuasa.`
    },
    "pahlawan-pendidikan": {
        title: "Pahlawan Pendidikan Indonesia",
        body:
        `Pahlawan pendidikan adalah tokoh-tokoh yang berjuang lewat ilmu pengetahuan, sekolah, dan kesadaran kritis – bukan hanya lewat senjata.
        Salah satu tokoh penting adalah Ki Hajar Dewantara. Ia mendirikan Taman Siswa pada tahun 1922, sebuah lembaga pendidikan yang memberi kesempatan belajar bagi rakyat pribumi dengan suasana merdeka dan mendidik kepribadian bangsa.
        Melalui semboyan “Ing ngarso sung tulodo, ing madyo mangun karso, tut wuri handayani”, Ki Hajar menegaskan bahwa pendidik bukan sekadar mengajar, tetapi juga menjadi teladan, penggerak, dan pendorong dari belakang.
        Perjuangan pahlawan pendidikan mengingatkan kita bahwa kemerdekaan sejati hanya dapat dijaga jika masyarakatnya terdidik, berpikir kritis, dan mencintai bangsanya.`
    }
};

$(document).ready(function () {
    const $track = $("#video-marquee-track");

    videoData.forEach(function (video) {
        const $card = $(`
            <a href="${video.url}" target="_blank" rel="noopener"
                class="block w-64 shrink-0 p-4 bg-white rounded-2xl shadow-md backdrop-blur-sm
                        hover:-translate-y-1 hover:shadow-lg transition-transform duration-300">
                <p class="mb-1 text-[0.7rem] uppercase tracking-wide font-semibold text-maroon/70 font-display">
                    ${video.tag || "Video Pembelajaran"}
                </p>
                <h3 class="mb-1 text-base font-semibold font-display text-maroon">
                    ${video.title}
                </h3>
                <p class="mb-2 text-sm font-display text-maroon/80">
                    ${video.desc}
                </p>
                <span class="inline-flex items-center gap-1 text-xs font-semibold text-maroon font-display">
                    Tonton sekarang
                    <span aria-hidden="true">↗</span>
                </span>
            </a>
        `);
        $track.append($card);
    });

    const itemsHtml = $track.html();
    $track.append(itemsHtml);

    const $ringkasanModal = $("#ringkasan-modal");
    const $ringkasanTitle = $("#ringkasan-title");
    const $ringkasanBody  = $("#ringkasan-body");

    function openRingkasan(id) {
        const data = ringkasanData[id];
        if (!data) return;

        $ringkasanTitle.text(data.title);
        $ringkasanBody.text(data.body);

        $ringkasanModal.removeClass("hidden").addClass("flex");
        $("body").addClass("overflow-hidden");
    }

    function closeRingkasan() {
        $ringkasanModal.addClass("hidden").removeClass("flex");
        $("body").removeClass("overflow-hidden");
    }

    // Klik tombol "Baca Ringkasan"
    $("[data-ringkasan-id]").on("click", function () {
        const id = $(this).data("ringkasan-id");
        openRingkasan(id);
    });

    // Tombol close & OK
    $("#ringkasan-close, #ringkasan-ok-btn").on("click", function () {
        closeRingkasan();
    });

    // Klik di luar kotak modal
    $ringkasanModal.on("click", function (e) {
        if (e.target === this) {
            closeRingkasan();
        }
    });

    // ESC untuk tutup
    $(document).on("keydown", function (e) {
        if (e.key === "Escape") {
            closeRingkasan();
        }
    });
});