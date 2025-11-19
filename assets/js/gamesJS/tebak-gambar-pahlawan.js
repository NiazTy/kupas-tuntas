const QUESTIONS_JSON_PATH = "../assets/soal/TGP.json";
const HEROES_JSON_PATH = "../assets/soal/pahlawan.json";

const QUIZ_DURATION = 120;
const MAX_QUESTIONS = 10;

let allQuestions = [];
let allHeroes = [];
let heroMapById = {};

let currentIndex = 0;
let hasAnswered = false;
let score = 0;
let remainingTime = QUIZ_DURATION;
let timerInterval = null;
let quizFinished = false;
let modalOpen = false;

function shuffleArray(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = a[i];
    a[i] = a[j];
    a[j] = temp;
  }
  return a;
}

function getRandomOtherHeroes(correctId, count) {
  const others = allHeroes.filter(function(h) {
    return h.id !== correctId;
  });
  const shuffled = shuffleArray(others);
  return shuffled.slice(0, count);
}

function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  const mm = m < 10 ? "0" + m : m;
  const ss = s < 10 ? "0" + s : s;
  return mm + ":" + ss;
}

function restartAnimation($el, className) {
  $el.removeClass(className);
  $el.each(function() { void this.offsetWidth; });
  $el.addClass(className);
}

function resetAnimationClasses($el) {
  $el.removeClass("animate-fade-out-down animate-fade-in-up animate-shake animate-pop");
  $el.css("opacity", "");
  $el.css("transform", "");
  $el.css("animation-delay", "");
}

function startTimerLoop() {
  if (timerInterval) clearInterval(timerInterval);

  timerInterval = setInterval(function() {
    if (quizFinished || modalOpen) {
      return;
    }

    remainingTime--;
    $("#timer-display").text(formatTime(remainingTime));

    if (remainingTime <= 0) {
      clearInterval(timerInterval);
      endGame("Waktu habis! ⏰");
    }
  }, 1000);
}

function pauseTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

function resumeTimer() {
  if (quizFinished) return;
  if (!timerInterval) {
    startTimerLoop();
  }
}

function openResultModal(params) {
  const { heroName, feedbackText, explanationText } = params;

  modalOpen = true;
  pauseTimer();

  $("#modal-hero-name").text(heroName || "Pahlawan Indonesia");
  $("#modal-feedback").text(feedbackText || "");
  $("#modal-explanation").text(explanationText || "");

  const $modal = $("#result-modal");
  resetAnimationClasses($modal);
  $modal.removeClass("hidden").addClass("flex");
  restartAnimation($modal, "animate-pop");
}

function closeResultModal() {
  const $modal = $("#result-modal");
  resetAnimationClasses($modal);
  $modal.addClass("hidden").removeClass("flex");
  modalOpen = false;

  if (!quizFinished) {
    resumeTimer();
  }
}

function getAchievement(score, total) {
  if (total === 10 && score === 10) {
    return {
      title: "Kesatria Sejarah",
      desc:  "Kamu menaklukkan semua soal tanpa tersisa. Ingatan sejarahmu tajam bak pedang para pejuang!",
      badgeClass: "badge-gold",
      icon: "🛡️"
    };
  }

  const ratio = score / total;

  if (ratio >= 0.8) {
    return {
      title: "Penjaga Arsip Bangsa",
      desc:  "Kamu sangat mengenal para pahlawan. Tinggal sedikit lagi menuju gelar Kesatria Sejarah!",
      badgeClass: "badge-silver",
      icon: "📜"
    };
  }

  if (ratio >= 0.5) {
    return {
      title: "Sahabat Pahlawan",
      desc:  "Kamu cukup akrab dengan kisah para pahlawan. Terus asah rasa ingin tahumu!",
      badgeClass: "badge-bronze",
      icon: "🤝"
    };
  }

  return {
    title: "Penjelajah Waktu Pemula",
    desc:  "Setiap kisah besar selalu dimulai dari langkah pertama. Yuk coba lagi dan kenali lebih banyak pahlawan!",
    badgeClass: "badge-basic",
    icon: "⏳"
  };
}

function initGame() {
  $.when(
    $.getJSON(QUESTIONS_JSON_PATH),
    $.getJSON(HEROES_JSON_PATH)
  ).done(function(qRes, hRes) {
    let loadedQuestions = qRes[0];
    allHeroes           = hRes[0];

    if (!Array.isArray(loadedQuestions)) {
      console.error("Format TGP.json harus berupa array!");
      return;
    }

    loadedQuestions = shuffleArray(loadedQuestions);

    if (loadedQuestions.length > MAX_QUESTIONS) {
      loadedQuestions = loadedQuestions.slice(0, MAX_QUESTIONS);
    }

    allQuestions = loadedQuestions;

    console.log("Total soal di file:", qRes[0].length);
    console.log("Soal yang dipakai:", allQuestions.length);
    console.log("Total pahlawan:", allHeroes.length);

    heroMapById = {};
    allHeroes.forEach(function(h) {
      heroMapById[h.id] = h;
    });

    if (allQuestions.length === 0) {
      console.warn("Tidak ada soal yang bisa dipakai.");
      $("#question").text("Belum ada soal tersedia.");
      return;
    }

    // reset status kuis
    score = 0;
    quizFinished = false;
    modalOpen = false;
    currentIndex = 0;
    remainingTime = QUIZ_DURATION;

    $("#score-display").text(score);
    $("#timer-display").text(formatTime(remainingTime));
    $("#question").text("");
    $("#feedback").text("");
    $("#explanation").text("");
    $("#result-badge").addClass("hidden");
    $("#end-buttons").addClass("hidden");
    $("#btn-next-question").removeClass("hidden").prop("disabled", true);
    $("#game-section").removeClass("hidden");

    startTimerLoop();
    renderQuestion(0);
  }).fail(function(err) {
    console.error("Gagal load JSON:", err);
  });
}

function transitionToQuestion(newIndex) {
  if (quizFinished) return;

  renderQuestion(newIndex);
}

function renderQuestion(index) {
  currentIndex = index;
  hasAnswered  = false;

  const total = allQuestions.length;
  const q     = allQuestions[index];

  if (!q) {
    console.warn("Soal tidak ditemukan di index:", index);
    return;
  }

  const heroBenar = heroMapById[q.heroId];
  if (!heroBenar) {
    console.warn("Hero tidak ditemukan untuk heroId:", q.heroId);
  }

  // reset animasi & visibilitas sebelum isi konten baru
  resetAnimationClasses($("#question"));
  resetAnimationClasses($("#card-stacker-quiz"));
  resetAnimationClasses($("#feedback"));
  resetAnimationClasses($("#explanation"));

  // update indikator soal
  $("#question-counter").text((index + 1) + " / " + total);

  // 3 hero lain untuk opsi salah
  const wrongHeroes = getRandomOtherHeroes(q.heroId, 3);

  // 4 opsi (1 benar + 3 salah), lalu diacak
  const options = shuffleArray(
    [{ hero: heroBenar, isCorrect: true }].concat(
      wrongHeroes.map(function(h) {
        return { hero: h, isCorrect: false };
      })
    )
  );

  // isi teks soal
  $("#question").text(q.soal || "");

  // kosongkan feedback & penjelasan
  $("#feedback").text("");
  $("#explanation").text("");

  // state tombol next
  const isLast = (index === total - 1);
  $("#btn-next-question")
    .prop("disabled", true)
    .text(isLast ? "Selesai" : "Soal Berikutnya");

  const $container = $("#card-stacker-quiz");
  $container.empty();

  // Mobile Slider
  const $mobileWrapper = $("<div>")
    .addClass("w-full overflow-x-auto md:hidden");

  const $mobileTrack = $("<div>")
    .attr("id", "card-track-mobile")
    .addClass("flex flex-nowrap gap-4 w-max snap-x snap-mandatory px-2");

  // Dekstop only
  const $desktopRow = $("<div>")
    .attr("id", "card-row-desktop")
    .addClass("hidden md:flex w-full justify-center gap-4");

  // Buat dua versi kartu untuk setiap opsi:
  options.forEach(function(opt) {
    if (!opt.hero) return;
    const hero = opt.hero;

    // Mobile Only
    const $cardWrapperMobile = $("<div>")
      .addClass(
        "snap-center flex-shrink-0 w-[30%] sm:w-[15%] cursor-pointer"
      );

    const $cardMobile = $("<div>")
      .addClass(
        "option-card option-card-mobile relative overflow-hidden rounded-2xl bg-white shadow-lg transition-transform duration-200 hover:-translate-y-1"
      )
      .attr("data-correct", opt.isCorrect ? "1" : "0");

    const $imgMobile = $("<img>")
      .attr("src", hero.photo)
      .attr("alt", hero.nama || "")
      .addClass("w-full object-cover aspect-[3/4] max-h-[280px]"); // 3x4 style

    const $labelMobile = $("<div>")
      .addClass("px-2 py-2 text-center text-sm font-display text-maroon")
      .text("Pilih gambar ini");

    $cardMobile.append($imgMobile, $labelMobile);
    $cardWrapperMobile.append($cardMobile);
    $mobileTrack.append($cardWrapperMobile);

    // -Desktop-only
    const $cardWrapperDesktop = $("<div>")
      .addClass("w-[20%] max-w-[180px] cursor-pointer");

    const $cardDesktop = $("<div>")
      .addClass(
        "option-card option-card-desktop relative overflow-hidden rounded-2xl bg-white shadow-lg transition-transform duration-200 hover:-translate-y-1"
      )
      .attr("data-correct", opt.isCorrect ? "1" : "0");

    const $imgDesktop = $("<img>")
      .attr("src", hero.photo)
      .attr("alt", hero.nama || "")
      .addClass("w-full aspect-[3/4] object-cover");

    const $labelDesktop = $("<div>")
      .addClass("px-2 py-2 text-center text-sm font-display text-maroon")
      .text("Pilih gambar ini");

    $cardDesktop.append($imgDesktop, $labelDesktop);
    $cardWrapperDesktop.append($cardDesktop);
    $desktopRow.append($cardWrapperDesktop);
  });

  $mobileWrapper.append($mobileTrack);
  $container.append($mobileWrapper, $desktopRow);

  // animasi fade-in untuk soal
  restartAnimation($("#question"), "animate-fade-in-up");

 // animasi fade-in untuk soal per elemen
  const $q = $("#question");
  resetAnimationClasses($q);
  restartAnimation($q, "animate-fade-in-up");

  // animasi fade-in untuk container kartu, bukan per kartu
  const $cardsContainer = $("#card-stacker-quiz");
  resetAnimationClasses($cardsContainer);
  restartAnimation($cardsContainer, "animate-fade-in-up");

  // event klik kartu
  $(".option-card").off("click").on("click", function() {
    if (hasAnswered || quizFinished) return;
    hasAnswered = true;

    const isCorrect = $(this).attr("data-correct") === "1";
    const correctName = q.nama || (heroBenar ? heroBenar.nama : "");

    $(".option-card").each(function() {
      const cardCorrect = $(this).attr("data-correct") === "1";
      $(this)
        .removeClass("ring-4 ring-green-400 opacity-60");

      if (cardCorrect) {
        $(this).addClass("ring-4 ring-green-400");
      } else {
        $(this).addClass("opacity-60");
      }
    });

    let feedbackText = "";

    if (isCorrect) {
      let bonus = Math.floor(Math.random() * 10);
      score += bonus;

      $("#score-display").text(score);
      feedbackText = "Jawaban benar! 🎉";
    } else {
      feedbackText = "Masih salah. Jawaban yang tepat: " + correctName;

      const $clicked = $(this);
      resetAnimationClasses($clicked);
      restartAnimation($clicked, "animate-shake");
    }

    $("#feedback").text(feedbackText);
    $("#explanation").text(q.penjelasan || "");

    resetAnimationClasses($("#feedback"));
    restartAnimation($("#feedback"), "animate-pop");

    resetAnimationClasses($("#explanation"));
    restartAnimation($("#explanation"), "animate-fade-in-up");

    $("#btn-next-question").prop("disabled", false);

    openResultModal({
      heroName: correctName,
      feedbackText: feedbackText,
      explanationText: q.penjelasan || ""
    });
  });
}

function endGame(reasonText) {
  quizFinished = true;
  pauseTimer();
  closeResultModal();

  const total = allQuestions.length;
  const achievement = getAchievement(score, total);

  const header = reasonText;
  const skorText = "Skor akhir kamu: " + score + " dari " + total + " soal.";

  $("#question").html(header + "<br>" + skorText);
  resetAnimationClasses($("#question"));
  restartAnimation($("#question"), "animate-fade-in-up");

  $("#card-stacker-quiz").empty();
  $("#feedback").text("");
  $("#explanation").text("");

  $("#btn-next-question").addClass("hidden");

  if (achievement) {
    $("#badge-title").text(achievement.title);
    $("#badge-desc").text(achievement.desc);
    $("#badge-icon")
      .text(achievement.icon || "🏅")
      .removeClass("badge-gold badge-silver badge-bronze badge-basic")
      .addClass(achievement.badgeClass || "badge-basic");

    $("#result-badge").removeClass("hidden");
    restartAnimation($("#result-badge"), "animate-fade-in-up");
  }

  $("#end-buttons").removeClass("hidden");

  try {
    localStorage.setItem("kupasTuntas_lastScore", String(score));
    localStorage.setItem("kupasTuntas_lastTotal", String(total));
    if (achievement) {
      localStorage.setItem("kupasTuntas_lastTitle", achievement.title);
    }
  } catch (e) {
    console.warn("Gagal menyimpan ke localStorage:", e);
  }
}

$(document).ready(function() {
  initGame();

  $("#btn-next-question").on("click", function() {
    if (quizFinished || modalOpen) return;

    const total = allQuestions.length;

    if (currentIndex < total - 1) {
      transitionToQuestion(currentIndex + 1);
    } else {
      endGame("Kuis selesai! ✅");
    }
  });

  $("#result-modal-close").on("click", function() {
    closeResultModal();
  });

  $("#result-overlay").on("click", function() {
    closeResultModal();
  });

  $("#btn-restart").on("click", function () {
    $("#end-buttons").addClass("hidden");
    $("#result-badge").addClass("hidden");
    $("#btn-next-question").removeClass("hidden");
    initGame();
  });

  $("#btn-back").on("click", function () {
    window.location.href = "mulai-tebak.html";
  });
});