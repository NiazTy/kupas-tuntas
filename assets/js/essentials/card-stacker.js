let imageLink = "assets/images/pahlawan/";

const data = [
  { image: imageLink + "jendral-sudirman.png" },
  { image: imageLink + "ki-hajar-dewantara.png" },
  { image: imageLink + "pangeran-diponegoro.png" },
  { image: imageLink + "sukarno.png" },
  { image: imageLink + "tuanku-imam-bonjol.png" }
];

let currentIndex = 0;

const $cards = $("[data-card]");  // versi 3 kartu
const $cardsQuiz = $("[data-card-quiz]");  // versi 5 kartu

function getDataIndex(offset) {
  const len = data.length;
  return (currentIndex + offset + len) % len;
}

function renderStack($cards, positions) {
  $cards.each(function (i) {
    const $card = $(this);
    const dIndex = getDataIndex(i);

    $card.attr("data-pos", positions[i]);
    $card.attr("data-dataindex", dIndex);

    const imageURL = data[dIndex].image;
    $card.find("[data-img]").css({
      "background-image": `url(${imageURL})`,
      "background-size": "cover",
      "background-position": "center"
    });
  });
}

function renderStackMain() {
  renderStack($cards, ["front", "middle", "back"]);
}

function renderStackQuiz() {
  renderStack($cardsQuiz, ["front", "middle-1", "middle-2", "back-1", "back-2"]);
}

$cards.on("click", function () {
  const idx = parseInt($(this).attr("data-dataindex"));
  if (idx === currentIndex) return;
  currentIndex = idx;
  renderStackMain();
  renderStackQuiz();
});

$cardsQuiz.on("click", function () {
  const idx = parseInt($(this).attr("data-dataindex"));
  if (idx === currentIndex) return;
  currentIndex = idx;
  renderStackMain();
  renderStackQuiz();
});

// initial render
renderStackMain();
renderStackQuiz();
