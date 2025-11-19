// Memasukkan video YouTube ke dalam kontainer
const videos = [
  "6lveJ8B_fWA?si=Kktp8eM03BO0BFDR",
  "2UR4ZiLahQg?si=ATVTkMfPQLRGBHZ6",
  "GVpvL3dextw?si=AO05mhvKbZOHhaEu"
];

// Logika penampilan video YouTube secara dinamis
let html = "";

// Loop melalui setiap ID video dan buat elemen iframe
videos.forEach(id => {
  html += `
    <div class="w-full aspect-video rounded-xl overflow-hidden shadow-lg mb-6">
      <iframe 
        src="https://www.youtube.com/embed/${id}" 
        class="w-full h-full"
        allowfullscreen
      ></iframe>
    </div>
  `;
});

// Menampilkan video di dalam kontainer
$("#video-container").html(html);

// Fungsi animasi fade-up pada scroll
function fadeUpOnScroll(selector) {
  const $el = $(selector);
  if ($el.length === 0) return;

  function checkVisibility() {
    const windowBottom = $(window).scrollTop() + $(window).height();
    const elTop = $el.offset().top;
    if (windowBottom >= elTop + 50) {
      $el.removeClass("opacity-0 translate-y-4");
      $(window).off("scroll", checkVisibility);
    }
  }
  checkVisibility();
  $(window).on("scroll", checkVisibility);
}

// Panggil fungsi scroll "animasi fade-up"
fadeUpOnScroll("#TK-title");
fadeUpOnScroll("#TK-content");
fadeUpOnScroll("#BSS-title");
fadeUpOnScroll("#BSS-content");
fadeUpOnScroll("#video-container");
