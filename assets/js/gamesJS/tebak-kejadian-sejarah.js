const TKS_JSON_PATH = "../../assets/soal/TKS.json";
const TKS_QUIZ_DURATION = 210;
const TKS_MAX_QUESTIONS = 5;

let tksAllQuestions = [];
let tksCurrentIndex = 0;
let tksScore = 0;
let tksRemainingTime = TKS_QUIZ_DURATION;
let tksTimerInterval = null;
let tksQuizFinished = false;
let tksModalOpen = false;

const MAS_LUCKY_BASE_PATH_TKS = "../../assets/images/mas-lucky/";
const MAS_LUCKY_VO_BASE_PATH_TKS = "../../assets/audio/";
const MAS_LUCKY_JSON_PATH_TKS = "../../assets/soal/mas-lucky.json";

let masLuckyListTks = [];

const MAS_LUCKY_STATE_TKS = {
  default: {
    matchSource: "mas-lucky-menyapa.png",
    vo: null
  },
  thinking: {
    matchSource: "mas-lucky-berpikir1.png",
    vo: "mas-lucky-berpikir-vo.wav"
  },
  correct: {
    matchSource: "mas-lucky-mengapresiasi.png",
    vo: "mas-lucky-mengapresiasi-vo.wav"
  },
  wrong: {
    matchSource: "mas-lucky-kecewa.png",
    vo: "mas-lucky-kecewa-vo.wav"
  },
  shocked: {
    matchSource: "mas-lucky-terkejut.png",
    vo: "mas-lucky-terkejut-vo.wav"
  },
  perfect: {
    matchSource: "mas-lucky-mengapresiasi.png",
    vo: "mas-lucky-perfect-vo.wav"
  },
  timeOut: {
    matchSource: "mas-lucky-berpikir1.png",
    vo: "mas-lucky-waktu-habis.wav"
  }
};

function tksLoadMasLuckyFromJson() {
  return $.getJSON(MAS_LUCKY_JSON_PATH_TKS)
    .done(function (data) {
      if (!Array.isArray(data)) {
        console.error("mas-lucky.json harus berupa array!");
        masLuckyListTks = [];
        return;
      }
      masLuckyListTks = data;
      console.log("TKS: Mas Lucky config loaded:", masLuckyListTks);
    })
    .fail(function (err) {
      console.error("TKS: Gagal load mas-lucky.json:", err);
      masLuckyListTks = [];
    });
}

function tksResolveMasLuckyState(stateKey) {
  const stateCfg = MAS_LUCKY_STATE_TKS[stateKey] || MAS_LUCKY_STATE_TKS.default;
  const fallback = {
    alt: stateKey,
    source: stateCfg.matchSource || "",
    vo: stateCfg.vo || null
  };

  if (!masLuckyListTks.length || !stateCfg.matchSource) {
    return fallback;
  }

  const found = masLuckyListTks.find(item => item.source === stateCfg.matchSource);

  if (!found) {
    console.warn("TKS: Config Mas Lucky untuk state", stateKey, "tidak ditemukan di JSON. Fallback.");
    return fallback;
  }

  return {
    alt: found.alt,
    source: found.source,
    vo: stateCfg.vo || null
  };
}

function tksPlayMasLuckyVoice(voFile) {
  const audioEl = document.getElementById("mas-lucky-voice");
  if (!audioEl || !voFile) return;

  audioEl.pause();
  audioEl.currentTime = 0;
  audioEl.src = MAS_LUCKY_VO_BASE_PATH_TKS + voFile;

  audioEl.play().catch(() => {
  });
}

function tksSetMasLucky(stateKey, options = {}) {
  const data = tksResolveMasLuckyState(stateKey);
  const $img = $("#mas-lucky");

  if ($img.length) {
    $img
      .attr("src", MAS_LUCKY_BASE_PATH_TKS + (data.source || ""))
      .attr("alt", data.alt || "");

    tksResetAnimationClasses($img);
    tksRestartAnimation($img, "animate-pop");
  }

  const shouldPlayVoice = options.playVoice !== false;

  if (shouldPlayVoice && data.vo) {
    tksPlayMasLuckyVoice(data.vo);
  }
}

function tksFormatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  const mm = m < 10 ? "0" + m : m;
  const ss = s < 10 ? "0" + s : s;
  return mm + ":" + ss;
}

function tksShuffleArray(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function tksRestartAnimation($el, className) {
  $el.removeClass(className);
  $el.each(function () { void this.offsetWidth; });
  $el.addClass(className);
}

function tksResetAnimationClasses($el) {
  $el.removeClass("animate-fade-in-up animate-fade-out-down animate-pop animate-shake");
  $el.css("opacity", "");
  $el.css("transform", "");
  $el.css("animation-delay", "");
}

function tksNormalizeText(str) {
  return (str || "")
    .toLowerCase()
    .replace(/[.,!?]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function tksIsAnswerCorrect(userAnswer, keyAnswer, kataKunci = []) {
  const u = tksNormalizeText(userAnswer);
  const k = tksNormalizeText(keyAnswer || "");

  if (!u) return false;

  if (k && u === k) {
    return true;
  }

  let keyWords = [];

  if (Array.isArray(kataKunci) && kataKunci.length > 0) {
    keyWords = kataKunci
      .map(kw => tksNormalizeText(kw))
      .filter(Boolean);
  } else if (k) {
    keyWords = k
      .split(" ")
      .filter(w => w.length > 3);
  }

  if (keyWords.length === 0) return false;

  const matched = keyWords.filter(kw => u.includes(kw));

  if (Array.isArray(kataKunci) && kataKunci.length > 0) {
    const totalKeywords = keyWords.length;
    const minNeeded = totalKeywords === 1 ? 1 : 2;
    return matched.length >= minNeeded;
  }

  const minNeeded = Math.max(1, Math.floor(keyWords.length * 0.4));
  return matched.length >= minNeeded;
}

function tksRenderKeywordIndicator(userAnswer, kataKunci = []) {
  const user = tksNormalizeText(userAnswer);

  const rawKeywords = Array.isArray(kataKunci) ? kataKunci : [];
  const normalizedKeywords = rawKeywords
    .map(kw => tksNormalizeText(kw))
    .filter(Boolean);

  const $box = $("#tks-keywords");
  $box.empty();

  if (!normalizedKeywords.length) return;

  normalizedKeywords.forEach((normKw, idx) => {
    const match = user.includes(normKw);
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

function tksStartTimerLoop() {
  if (tksTimerInterval) clearInterval(tksTimerInterval);

  tksTimerInterval = setInterval(function () {
    if (tksQuizFinished || tksModalOpen) {
      return;
    }

    tksRemainingTime--;
    $("#timer-display").text(tksFormatTime(tksRemainingTime));

    if (tksRemainingTime <= 0) {
      clearInterval(tksTimerInterval);
      tksSetMasLucky("timeOut", { playVoice: true });

      tksEndGame("Waktu habis! ⏰");
    }
  }, 1000);
}

function tksPauseTimer() {
  if (tksTimerInterval) {
    clearInterval(tksTimerInterval);
    tksTimerInterval = null;
  }
}

function tksResumeTimer() {
  if (tksQuizFinished) return;
  if (!tksTimerInterval) {
    tksStartTimerLoop();
  }
}

function tksOpenResultModal({ title, feedbackText, explanationText }) {
  tksModalOpen = true;
  tksPauseTimer();

  $("#modal-hero-name").text(title || "Kejadian Sejarah");
  $("#modal-feedback").text(feedbackText || "");
  $("#modal-explanation").text(explanationText || "");

  const $modal = $("#result-modal");
  const $card  = $modal.find(".rounded-2xl");

  $modal.removeClass("hidden").addClass("flex");
  tksResetAnimationClasses($card);
  tksRestartAnimation($card, "animate-fade-in-up");
}

function tksCloseResultModal() {
  const $modal = $("#result-modal");
  $modal.addClass("hidden").removeClass("flex");
  tksModalOpen = false;

  if (!tksQuizFinished) {
    tksResumeTimer();
  }
}

function tksGetAchievement(score, total) {
  if (total === 10 && score === 10) {
    return {
      title: "Kesatria Sejarah",
      desc:  "Kamu menaklukkan semua soal tanpa tersisa. Ingatan sejarahmu tajam bak bambu runcing para pejuang!",
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
      title: "Sahabat Sejarahwan",
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

function tksInitGame() {
  $.getJSON(TKS_JSON_PATH)
    .done(function (data) {
      if (!Array.isArray(data)) {
        console.error("Format TKS.json harus berupa array!");
        return;
      }

      let loadedQuestions = tksShuffleArray(data);

      if (loadedQuestions.length > TKS_MAX_QUESTIONS) {
        loadedQuestions = loadedQuestions.slice(0, TKS_MAX_QUESTIONS);
      }

      tksAllQuestions = loadedQuestions;

      console.log("Total soal TKS di file:", data.length);
      console.log("Soal TKS yang dipakai:", tksAllQuestions.length);

      if (tksAllQuestions.length === 0) {
        $("#question").text("Belum ada soal untuk mode ini.");
        return;
      }

      tksScore = 0;
      tksQuizFinished = false;
      tksModalOpen = false;
      tksCurrentIndex = 0;
      tksRemainingTime = TKS_QUIZ_DURATION;

      $("#score-display").text(tksScore);
      $("#timer-display").text(tksFormatTime(tksRemainingTime));
      $("#q-title").text("");
      $("#question").text("");
      $("#answers").empty();
      $("#result-badge").addClass("hidden");
      $("#end-buttons").addClass("hidden");

      $("#btn-next-question")
        .addClass("hidden")
        .prop("disabled", true)
        .text("Soal Berikutnya");

      tksSetMasLucky("default", { playVoice: false });

      tksStartTimerLoop();
      tksRenderQuestion(0);
    })
    .fail(function (err) {
      console.error("Gagal load TKS.json:", err);
    });
}

function tksRenderQuestion(index) {
  tksCurrentIndex = index;
  let hasAnswered = false;

  tksSetMasLucky("thinking", { playVoice: true });

  const total = tksAllQuestions.length;
  const q = tksAllQuestions[index];

  if (!q) {
    console.warn("Soal TKS tidak ditemukan di index:", index);
    return;
  }

  tksResetAnimationClasses($("#q-title"));
  tksResetAnimationClasses($("#question"));
  tksResetAnimationClasses($("#answers"));

  $("#question-counter").text((index + 1) + " / " + total);

  const questionText = q["soal"]          || "";
  const titleText = q["judul-soal"]    || "";
  const keyAnswer = q["kunci-jawaban"] || "";
  const explanation = q["penjelasan"]    || "";
  const clue = q["clue"]          || "";
  const kataKunci = Array.isArray(q["kata-kunci"]) ? q["kata-kunci"] : [];

  $("#q-title").text(titleText);
  $("#question").text(questionText);

  const isLast = (index === total - 1);

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

  const $buttons = $("#buttons");
  const $nextBtn = $("#btn-next-question");

  $buttons.find("#tks-show-clue, #tks-submit").remove();

  const $clueBtn = $("<button>")
    .attr("id", "tks-show-clue")
    .addClass(
      "w-full px-4 py-2 font-semibold rounded-xl bg-yellow-400 text-maroon font-display flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform"
    )
    .html('<span>Lihat Clue</span>');

  const $submitBtn = $("<button>")
    .attr("id", "tks-submit")
    .addClass(
      "w-full px-4 py-2 font-bold bg-white rounded-xl text-maroon font-display flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform"
    )
    .html('<span>Cek Jawaban</span>');

  $nextBtn
    .addClass("hidden")
    .removeClass("opacity-50")
    .prop("disabled", true)
    .text(isLast ? "Selesai" : "Soal Berikutnya");

  $buttons
    .addClass("flex flex-col w-full gap-3 sm:flex-row");

  $clueBtn.insertBefore($nextBtn);
  $submitBtn.insertBefore($nextBtn);

  tksRestartAnimation($("#q-title"), "animate-fade-in-up");
  tksRestartAnimation($("#question"), "animate-fade-in-up");
  tksRestartAnimation($answers, "animate-fade-in-up");
  tksRestartAnimation($buttons, "animate-fade-in-up");

  $clueBtn.on("click", function () {
    $clueText.removeClass("hidden");
    tksRestartAnimation($clueText, "animate-fade-in-up");
  });

  $submitBtn.on("click", function () {
    if (hasAnswered || tksQuizFinished || tksModalOpen) return;

    const userAnswer = $input.val().trim();
    if (!userAnswer) {
      alert("Isi dulu jawabanmu ya");
      return;
    }

    hasAnswered = true;

    const correct = tksIsAnswerCorrect(userAnswer, keyAnswer, kataKunci);
    let feedbackText = "";

    if (correct) {
      tksScore++;
      $("#score-display").text(tksScore);
      feedbackText = "Jawaban kamu sudah tepat! 🎉";

      tksSetMasLucky("correct", { playVoice: true });
    } else {
      feedbackText = "Belum tepat. Jawaban yang dimaksud: " + keyAnswer;

      tksSetMasLucky("wrong", { playVoice: true });
    }

    $feedback.text(feedbackText);
    tksRestartAnimation($feedback, "animate-pop");

    tksRenderKeywordIndicator(userAnswer, kataKunci);

    $nextBtn.removeClass("hidden").prop("disabled", false);
    tksRestartAnimation($nextBtn, "animate-pop");

    tksOpenResultModal({
      title: titleText,
      feedbackText: feedbackText,
      explanationText: explanation
    });
  });
}

function tksEndGame(reasonText) {
  tksQuizFinished = true;
  tksPauseTimer();
  tksCloseResultModal();

  const total = tksAllQuestions.length;
  const achievement = tksGetAchievement(tksScore, total);

  const header = reasonText;
  const skorText = "Skor akhir kamu: " + tksScore + " dari " + total + " soal.";

  $("#q-title").hide();
  $("#question").text("");
  $("#headerFinish").html(header + "<br>" + skorText);
  tksResetAnimationClasses($("#question"));
  tksRestartAnimation($("#question"), "animate-fade-in-up");

  $("#answers").empty();

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
    tksRestartAnimation($("#result-badge"), "animate-fade-in-up");
  }

  const ratio = total > 0 ? tksScore / total : 0;
  if (total === 10 && tksScore === 10) {
    tksSetMasLucky("shocked", { playVoice: true });
  } else if (ratio >= 0.8) {
    tksSetMasLucky("correct", { playVoice: false });
  } else if (ratio >= 0.5) {
    tksSetMasLucky("thinking", { playVoice: false });
  } else {
    tksSetMasLucky("wrong", { playVoice: false });
  }

  $("#end-buttons").removeClass("hidden");

  try {
    localStorage.setItem("tks_lastScore", String(tksScore));
    localStorage.setItem("tks_lastTotal", String(total));
    if (achievement) {
      localStorage.setItem("tks_lastTitle", achievement.title);
    }
  } catch (e) {
    console.warn("Gagal menyimpan skor TKS:", e);
  }
}

$(document).ready(function () {
  tksLoadMasLuckyFromJson().always(function () {
    tksInitGame();

    $("#btn-next-question").on("click", function () {
      if (tksQuizFinished) return;

      if (tksModalOpen) {
        tksCloseResultModal();
      }

      const total = tksAllQuestions.length;

      if (tksCurrentIndex < total - 1) {
        tksRenderQuestion(tksCurrentIndex + 1);
      } else {
        tksEndGame("Kuis selesai! ✅");
      }
    });

    $("#result-modal-close").on("click", function () {
      tksCloseResultModal();
    });

    $("#result-overlay").on("click", function () {
      tksCloseResultModal();
    });

    $("#btn-restart").on("click", function () {
      $("#end-buttons").addClass("hidden");
      $("#result-badge").addClass("hidden");
      tksEndGame("");
      $("#headerFinish").html("");
      tksInitGame();
    });

    $("#btn-back").on("click", function () {
      window.location.href = "index.html";
    });
  });
});
