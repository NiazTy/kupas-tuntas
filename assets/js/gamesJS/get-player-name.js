$(document).ready(function() {
    // Saat tombol "Mulai Tebak" (desktop atau mobile) diklik
    $("#mulai-tebak-btn").on("click", function(e) {
        e.preventDefault();

        let playerName = $("#input-nama-pemain").val().trim();

        if (playerName === "") {
            alert("Silakan masukkan namamu terlebih dahulu!");
            return;
        }

        sessionStorage.setItem("playerName", playerName);

        $("#name").hide();
        $("#gamemode-section").show();
        $("#player-name-display").text(playerName.toUpperCase());
        $("#mulai-tebak-btn-desktop, #mulai-tebak-btn-mobile").hide();
        $("#reset-nama-btn-desktop, #reset-nama-btn-mobile").show();
        $("#no-name-section").hide();
        $("#game-section").show();
    });

    let storedName = sessionStorage.getItem("playerName");

    if (storedName) {
        $("#input-nama-pemain").val(storedName);
        $("#name").hide();
        $("#gamemode-section").show();
        $("#player-name-display").text(storedName.toUpperCase());
        $("#mulai-tebak-btn-desktop, #mulai-tebak-btn-mobile").hide();
        $("#reset-nama-btn-desktop, #reset-nama-btn-mobile").show();
        $("#no-name-section").hide()
        $("#game-section").show();
    } else {
        $("#mulai-tebak-btn-desktop, #mulai-tebak-btn-mobile").show();
        $("#reset-nama-btn-desktop, #reset-nama-btn-mobile").hide();
        $("#no-name-section").show();
        $("#game-section").hide();
    }

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
