$(document).ready(function() {
    // Saat tombol "Mulai Tebak" (desktop atau mobile) diklik
    $("#mulai-tebak-btn").on("click", function(e) {
        e.preventDefault();

        let playerName = $("#input-nama-pemain").val().trim();

        if (playerName === "") {
            alert("Silakan masukkan namamu terlebih dahulu!");
            return;
        }

        // Simpan ke sessionStorage
        sessionStorage.setItem("playerName", playerName);

        // Langsung update tampilan tanpa refresh
        $("#name").hide();
        $("#gamemode-section").show();
        $("#player-name-display").text(playerName.toUpperCase());

        // Sembunyikan tombol mulai, tampilkan tombol reset
        $("#mulai-tebak-btn-desktop, #mulai-tebak-btn-mobile").hide();
        $("#reset-nama-btn-desktop, #reset-nama-btn-mobile").show();

        // Sembunyikan no-name, tampilkan permainan
        $("#no-name-section").hide();
        $("#game-section").show();
    });

    // Saat halaman pertama kali dimuat, cek apakah sudah ada nama tersimpan
    let storedName = sessionStorage.getItem("playerName");

    if (storedName) {
        $("#input-nama-pemain").val(storedName);
        $("#name").hide();
        $("#gamemode-section").show();
        $("#player-name-display").text(storedName.toUpperCase());

        // mulai disembunyikan, reset ditampilkan
        $("#mulai-tebak-btn-desktop, #mulai-tebak-btn-mobile").hide();
        $("#reset-nama-btn-desktop, #reset-nama-btn-mobile").show();

        // Sembunyikan no-name, tampilkan permainan
        $("#no-name-section").hide()
        $("#game-section").show();
    } else {
        // kalau belum ada nama -> tombol mulai kelihatan, reset disembunyikan
        $("#mulai-tebak-btn-desktop, #mulai-tebak-btn-mobile").show();
        $("#reset-nama-btn-desktop, #reset-nama-btn-mobile").hide();

        // Sembunyikan no-name, tampilkan permainan
        $("#no-name-section").show();
        $("#game-section").hide();
    }

    // Hapus nama pemain saat tombol reset (desktop & mobile) diklik
    $("#reset-nama-btn-desktop, #reset-nama-btn-mobile").on("click", function() {  
        sessionStorage.removeItem("playerName"); 
        $("#name").show(); 
        $("#gamemode-section").hide(); 

        // kembali ke state awal
        $("#mulai-tebak-btn-desktop, #mulai-tebak-btn-mobile").show();
        $("#reset-nama-btn-desktop, #reset-nama-btn-mobile").hide();
        $("#no-name-section").show();
        $("#game-section").hide();
    });

    console.log("storedName:", storedName);
});
