const TKS_JSON_PATH = "../../assets/soal/TKS.json";
const QUIZ_DURATION = 120;
const MAX_QUESTIONS = 5;

let allQuestions = [];
let currentIndex = 0;
let score = 0;
let remainingTime = QUIZ_DURATION;
let timerInterval = null;
let quizFinished = false;
let modalOpen = false;

function shuffleArray(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
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
  $el.each(function () { void this.offsetWidth; });
  $el.addClass(className);
}

function resetAnimationClasses($el) {
  $el.removeClass("animate-fade-in-up animate-fade-out-down animate-pop animate-shake");
  $el.css("opacity", "");
  $el.css("transform", "");
  $el.css("animation-delay", "");
}

function normalizeText(str) {
  return (str || "")
    .toLowerCase()
    .replace(/[.,!?]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function isAnswerCorrect(userAnswer, keyAnswer, kataKunci = []) {
  const u = normalizeText(userAnswer);
  const k = normalizeText(keyAnswer || "");

  if (!u) return false;

  if (k && (u === k || u.includes(k) || k.includes(u))) {
    return true;
  }

  let keyWords = [];

  if (Array.isArray(kataKunci) && kataKunci.length > 0) {
    keyWords = kataKunci
      .map(kw => normalizeText(kw))
      .filter(Boolean);
  } else if (k) {
    keyWords = k.split(" ").filter(w => w.length > 3);
  }

  if (keyWords.length === 0) return false;

  const matched = keyWords.filter(kw => u.includes(kw));

  const minNeeded = Math.max(1, Math.floor(keyWords.length * 0.4));

  return matched.length >= minNeeded;
}

function renderKeywordIndicator(userAnswer, kataKunci = []) {
  const user = normalizeText(userAnswer);

  const rawKeywords = Array.isArray(kataKunci) ? kataKunci : [];
  const normalizedKeywords = rawKeywords
    .map(kw => normalizeText(kw))
    .filter(Boolean);

  const $box = $("#tks-keywords");
  $box.empty();

  if (!normalizedKeywords.length) return;

  normalizedKeywords.forEach((normKw, idx) => {
    const match    = user.includes(normKw);
    const original = rawKeywords[idx] || normKw;

    const $chip = $("<span>")
      .addClass(
        "px-2 py-1 rounded-full font-semibold " +
        (match ? "bg-green-500 text-white" : "bg-red-500 text-white")
      )
      .text(original + (match ? " ✓" : " ✗"));

    $box.append($chip);
  });
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

function openResultModal({ title, feedbackText, explanationText }) {
  modalOpen = true;
  pauseTimer();

  $("#modal-hero-name").text(title || "Kejadian Sejarah");
  $("#modal-feedback").text(feedbackText || "");
  $("#modal-explanation").text(explanationText || "");

  const $modal   = $("#result-modal");
  const $card    = $modal.find(".rounded-2xl");

  $modal.removeClass("hidden").addClass("flex");
  resetAnimationClasses($card);
  restartAnimation($card, "animate-fade-in-up");
}

function closeResultModal() {
  const $modal = $("#result-modal");
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
      desc:  "Kamu sangat mengenal peristiwa-peristiwa penting negeri ini. Tinggal sedikit lagi menuju gelar Kesatria Sejarah!",
      badgeClass: "badge-silver",
      icon: "📜"
    };
  }

  if (ratio >= 0.5) {
    return {
      title: "Sahabat Pahlawan",
      desc:  "Kamu cukup akrab dengan kisah perjuangan. Terus asah rasa ingin tahumu!",
      badgeClass: "badge-bronze",
      icon: "🤝"
    };
  }

  return {
    title: "Penjelajah Waktu Pemula",
    desc:  "Setiap kisah besar dimulai dari satu langkah. Yuk coba lagi dan jelajahi lebih banyak kejadian sejarah!",
    badgeClass: "badge-basic",
    icon: "⏳"
  };
}

function initGame() {
  $.getJSON(TKS_JSON_PATH)
    .done(function(data) {
      if (!Array.isArray(data)) {
        console.error("Format TKS.json harus berupa array!");
        return;
      }

      let loadedQuestions = shuffleArray(data);

      if (loadedQuestions.length > MAX_QUESTIONS) {
        loadedQuestions = loadedQuestions.slice(0, MAX_QUESTIONS);
      }

      allQuestions = loadedQuestions;

      console.log("Total soal TKS di file:", data.length);
      console.log("Soal TKS yang dipakai:", allQuestions.length);

      if (allQuestions.length === 0) {
        $("#question").text("Belum ada soal untuk mode ini.");
        return;
      }

      // reset status game
      score = 0;
      quizFinished = false;
      modalOpen = false;
      currentIndex = 0;
      remainingTime = QUIZ_DURATION;

      $("#score-display").text(score);
      $("#timer-display").text(formatTime(remainingTime));
      $("#q-title").text("");
      $("#question").text("");
      $("#answers").empty();
      $("#result-badge").addClass("hidden");
      $("#end-buttons").addClass("hidden");

      // tombol next: sembunyi dulu
      $("#btn-next-question")
        .addClass("hidden")
        .prop("disabled", true)
        .text("Soal Berikutnya");

      startTimerLoop();
      renderQuestion(0);
    })
    .fail(function(err) {
      console.error("Gagal load TKS.json:", err);
    });
}

function renderQuestion(index) {
  currentIndex = index;
  let hasAnswered = false;

  const total = allQuestions.length;
  const q     = allQuestions[index];

  if (!q) {
    console.warn("Soal TKS tidak ditemukan di index:", index);
    return;
  }

  resetAnimationClasses($("#q-title"));
  resetAnimationClasses($("#question"));
  resetAnimationClasses($("#answers"));

  $("#question-counter").text((index + 1) + " / " + total);

  const questionText = q["soal"] || "";
  const titleText    = q["judul-soal"] || "";
  const keyAnswer    = q["kunci-jawaban"] || "";
  const explanation  = q["penjelasan"] || "";
  const clue         = q["clue"] || "";
  const kataKunci    = Array.isArray(q["kata-kunci"]) ? q["kata-kunci"] : [];

  $("#q-title").text(titleText);
  $("#question").text(questionText);

  const isLast = (index === total - 1);

  // -------- AREA JAWABAN (teks) --------
  const $answers = $("#answers");
  $answers
    .empty()
    .addClass("flex flex-col items-center gap-3");

  const $clueText = $("<p>")
    .attr("id", "tks-clue")
    .addClass("hidden mt-1 text-xs text-yellow-100 font-display sm:text-sm")
    .text(clue || "Belum ada clue untuk soal ini.");

  const $input = $("<input>")
    .attr("id", "tks-answer-input")
    .attr("type", "text")
    .attr("autocomplete", "off")
    .attr("placeholder", '(misal: "pemasangan pancang di tanah Diponegoro")')
    .addClass("w-full max-w-md px-3 py-2 text-sm rounded-xl outline-none font-display text-maroon bg-white sm:text-base");

  const $feedback = $("<p>")
    .attr("id", "tks-feedback")
    .addClass("mt-1 text-sm font-display text-white sm:text-base");

  const $keywordBox = $("<div>")
    .attr("id", "tks-keywords")
    .addClass("flex flex-wrap justify-center gap-2 mt-2 text-xs font-display");

  $answers.append($clueText, $input, $feedback, $keywordBox);

  // -------- AREA TOMBOL --------
  const $buttons = $("#buttons");
  const $nextBtn = $("#btn-next-question"); // ini sudah ada di HTML dan TIDAK dihapus

  // hapus tombol clue & submit lama, tapi jangan hapus btn-next-question
  $buttons.find("#tks-show-clue, #tks-submit").remove();

  const $clueBtn = $("<button>")
    .attr("id", "tks-show-clue")
    .addClass(
      "w-full px-4 py-2 font-semibold rounded-xl bg-yellow-400 text-maroon font-display flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform"
    )
    .html('<span>💡</span><span>Lihat Clue</span>');

  const $submitBtn = $("<button>")
    .attr("id", "tks-submit")
    .addClass(
      "w-full px-4 py-2 font-bold bg-white rounded-xl text-maroon font-display flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform"
    )
    .html('<span>✅</span><span>Kunci Jawaban</span>');

  // siapin tombol Next
  $nextBtn
    .addClass("hidden")
    .removeClass("opacity-50")
    .prop("disabled", true)
    .text(isLast ? "Selesai" : "Soal Berikutnya");

  // susunan tombol: clue, submit, lalu next
  $buttons
    .addClass("flex flex-col w-full gap-3 sm:flex-row");

  // sisipkan di depan Next (jadi Next selalu di paling kanan / bawah)
  $clueBtn.insertBefore($nextBtn);
  $submitBtn.insertBefore($nextBtn);

  restartAnimation($("#q-title"), "animate-fade-in-up");
  restartAnimation($("#question"), "animate-fade-in-up");
  restartAnimation($answers, "animate-fade-in-up");
  restartAnimation($buttons, "animate-fade-in-up");

  // -------- EVENT: LIHAT CLUE --------
  $clueBtn.on("click", function() {
    $clueText.removeClass("hidden");
    restartAnimation($clueText, "animate-fade-in-up");
  });

  // -------- EVENT: KUNCI JAWABAN --------
  $submitBtn.on("click", function() {
    if (hasAnswered || quizFinished || modalOpen) return;

    const userAnswer = $input.val().trim();
    if (!userAnswer) {
      alert("Isi dulu jawabanmu ya 😊");
      return;
    }

    hasAnswered = true;

    const correct = isAnswerCorrect(userAnswer, keyAnswer, kataKunci);
    let feedbackText = "";

    if (correct) {
      score++;
      $("#score-display").text(score);
      feedbackText = "Jawaban kamu sudah tepat! 🎉";
    } else {
      feedbackText = "Belum tepat. Jawaban yang dimaksud: " + keyAnswer;
    }

    $feedback.text(feedbackText);
    restartAnimation($feedback, "animate-pop");

    renderKeywordIndicator(userAnswer, kataKunci);

    // munculkan tombol next
    $nextBtn.removeClass("hidden").prop("disabled", false);
    restartAnimation($nextBtn, "animate-pop");

    openResultModal({
      title: titleText,
      feedbackText: feedbackText,
      explanationText: explanation
    });
  });
}

function endGame(reasonText) {
  quizFinished = true;
  pauseTimer();
  closeResultModal();

  const total = allQuestions.length;
  const achievement = getAchievement(score, total);

  const header   = reasonText;
  const skorText = "Skor akhir kamu: " + score + " dari " + total + " soal.";

  $("#q-title").text("");
  $("#question").html(header + "<br>" + skorText);
  resetAnimationClasses($("#question"));
  restartAnimation($("#question"), "animate-fade-in-up");

  $("#answers").empty();

  // hapus tombol clue & submit, sembunyikan Next
  $("#buttons").find("#tks-show-clue, #tks-submit").remove();
  $("#btn-next-question").addClass("hidden").prop("disabled", true);

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
    localStorage.setItem("tks_lastScore", String(score));
    localStorage.setItem("tks_lastTotal", String(total));
    if (achievement) {
      localStorage.setItem("tks_lastTitle", achievement.title);
    }
  } catch (e) {
    console.warn("Gagal menyimpan skor TKS:", e);
  }
}

$(document).ready(function() {
  initGame();

  // tombol next soal
  $("#btn-next-question").on("click", function() {
    if (quizFinished) return;

    // kalau modal masih kebuka, tutup dulu
    if (modalOpen) {
      closeResultModal();
    }

    const total = allQuestions.length;

    if (currentIndex < total - 1) {
      renderQuestion(currentIndex + 1);
    } else {
      endGame("Kuis selesai! ✅");
    }
  });

  // modal close
  $("#result-modal-close").on("click", function() {
    closeResultModal();
  });

  $("#result-overlay").on("click", function() {
    closeResultModal();
  });

  // tombol mulai ulang
  $("#btn-restart").on("click", function () {
    $("#end-buttons").addClass("hidden");
    $("#result-badge").addClass("hidden");
    initGame();
  });

  // tombol kembali
  $("#btn-back").on("click", function () {
    window.location.href = "index.html"; // sesuaikan kalau perlu
  });
});
