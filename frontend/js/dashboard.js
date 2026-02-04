var months_list = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sept",
  "Oct",
  "Nov",
  "Dec",
];

// DATEFORMATTER FUNCTION

function dateFormatter(rawDate) {
  let dateArray = rawDate.split("-");
  let day = dateArray[2];
  let intDay = parseInt(day, 10);
  let month = dateArray[1];
  let intMonth = parseInt(month, 10);
  let monthName = months_list[intMonth - 1];
  let intYear = dateArray[0];

  return monthName + " " + intDay + ", " + intYear;
}

// MATCH PROGRESS COUNTER FUNCTION

function matchProgressIncrease() {
  let count = localStorage.getItem("progressCount");
  newCount = Number(count) + 1;
  localStorage.setItem("progressCount", newCount);
  let progressBarStat = document.querySelector(".progress-bar");

  if (newCount == 1) {
    localStorage.setItem("progressBar", "33%");
    progressBarStat.style.width = "33%";
  } else if (newCount == 2) {
    localStorage.setItem("progressBar", "66%");
    progressBarStat.style.width = "66%";
  } else if (newCount == 3) {
    localStorage.setItem("progressBar", "100%");
    progressBarStat.style.width = "100%";
  }
}

// IMPORT GAME FORM

//POPULATE NAMES IN SCOREBOARD AND PREVIEW CARD
const myTeamInput = document.querySelector("#myTeam");
const myOpponentsInput = document.querySelector("#myOpponents");
const opponentsNames = document.querySelector("#importOpponentsNames");
const pairInput = document.querySelector("#pairInput");
const pairInput2 = document.querySelector("#pairInput2");

myTeamInput.addEventListener("input", () => {
  pairInput.value = myTeamInput.value;
});

myOpponentsInput.addEventListener("input", () => {
  pairInput2.value = myOpponentsInput.value;
  opponentsNames.textContent = "vs " + pairInput2.value;
});

// FILL OUT DATE IN PREVIEW CARD
const dateInput = document.querySelector("#dateInput");
const previewCardDate = document.querySelector("#previewCardDate");

dateInput.addEventListener("change", () => {
  previewCardDate.textContent = dateFormatter(dateInput.value);
});

// CHECK IF FRIENDLY MATCH TYPE FUNCTION
function checkIfFriendly() {
  if (matchTypeInput.value === "Friendly") {
    previewCardRating.style.display = "none";
    previewCardRatingIcon.style.display = "none";
  }
}

// UPDATE SCORE CARD PREVIEW

const previewCardScore = document.querySelector("#previewCardScore");

const myTeamSet1 = document.querySelector("#myTeamSet1");
const myTeamSet2 = document.querySelector("#myTeamSet2");
const myTeamSet3 = document.querySelector("#myTeamSet3");

const myOpponentsSet1 = document.querySelector("#myOpponentsSet1");
const myOpponentsSet2 = document.querySelector("#myOpponentsSet2");
const myOpponentsSet3 = document.querySelector("#myOpponentsSet3");

scoreInputs = [
  myTeamSet1,
  myTeamSet2,
  myTeamSet3,
  myOpponentsSet1,
  myOpponentsSet2,
  myOpponentsSet3,
];

scoreInputs.forEach((input) =>
  input.addEventListener("input", () => {
    createScoreSetPreview();
  }),
);

function createScoreSetPreview() {
  let set1ValueA = myTeamSet1.value.trim();
  let set2ValueA = myTeamSet2.value.trim();
  let set3ValueA = myTeamSet3.value.trim();
  let set1ValueB = myOpponentsSet1.value.trim();
  let set2ValueB = myOpponentsSet2.value.trim();
  let set3ValueB = myOpponentsSet3.value.trim();
  const sets = [];
  if (set1ValueA !== "" && set1ValueB !== "") {
    sets.push(set1ValueA + "-" + set1ValueB);
  }

  if (set2ValueA !== "" && set2ValueB !== "") {
    sets.push(" " + set2ValueA + "-" + set2ValueB);
  }

  if (set3ValueA !== "" && set3ValueB !== "") {
    sets.push(" " + set3ValueA + "-" + set3ValueB);
  }
  previewCardScore.textContent = sets;
}

const matchResult = document.querySelector("#resultId");
const resultCard = document.querySelector("#result-card");
const resultPill = document.querySelector("#resultPill");
const inputRating = document.querySelector("#inputRating");
const previewCardRating = document.querySelector("#previewCardRating");
const previewCardRatingIcon = document.querySelector("#previewCardRatingIcon");
const previewCardRatingContainer = document.querySelector(
  "#previewCardRatingContainer",
);

inputRating.addEventListener("input", () => {
  if (matchResult.value === "Loss") {
    previewCardRating.textContent = "-" + inputRating.value;
  } else if (matchResult.value === "Draw") {
    previewCardRating.textContent = "" + inputRating.value;
  } else if (matchResult.value === "Win") {
    previewCardRating.textContent = "+" + inputRating.value;
    previewCardRating.style.display = "inline";
    previewCardRatingIcon.style.display = "inline";
    checkIfRatingInputMissing();
    checkIfFriendly();
  }
});

// CHECK MATCH TYPE

const matchTypeInput = document.querySelector("#matchTypeInput");

matchTypeInput.addEventListener("change", () => {
  if (matchTypeInput.value === "Friendly") {
    previewCardRating.style.display = "none";
    previewCardRatingIcon.style.display = "none";
  }
  if (matchTypeInput.value === "Competitive") {
    previewCardRating.style.display = "inline";
    previewCardRatingIcon.style.display = "inline";
    checkIfRatingInputMissing();
    createScoreSetPreview();
  }
});

// CHECK IF RATING INPUT IS MISSING FUNCTION

function checkIfRatingInputMissing() {
  if (inputRating.value.trim() === "") {
    previewCardRating.style.display = "none";
    previewCardRatingIcon.style.display = "none";
  }
}

// CHECK RESULT

matchResult.addEventListener("change", () => {
  resultCard.classList.remove("win-result-card");
  resultCard.classList.remove("draw-result-card");
  resultCard.classList.remove("loss-result-card");
  resultPill.classList.remove("win-result");
  resultPill.classList.remove("draw-result");
  resultPill.classList.remove("loss-result");
  previewCardRatingContainer.classList.remove("win-rating");
  previewCardRatingContainer.classList.remove("loss-rating");
  previewCardRatingContainer.classList.remove("draw-rating");

  if (matchResult.value === "Loss") {
    resultCard.classList.add("loss-result-card");
    resultPill.classList.add("loss-result");
    resultPill.textContent = "Loss";
    previewCardRatingIcon.src = "images/trending-down.svg";
    previewCardRating.textContent = "-" + inputRating.value;
    previewCardRatingContainer.classList.add("loss-rating");
    previewCardRatingIcon.style.display = "inline";
    checkIfRatingInputMissing();
    checkIfFriendly();
  } else if (matchResult.value === "Draw") {
    resultCard.classList.add("draw-result-card");
    resultPill.classList.add("draw-result");
    resultPill.textContent = "Draw";
    previewCardRatingIcon.src = "images/minus.svg";
    previewCardRating.textContent = "" + inputRating.value;
    previewCardRatingContainer.classList.add("draw-rating");
    previewCardRatingIcon.style.display = "inline";
    checkIfRatingInputMissing();
    checkIfFriendly();
  } else if (matchResult.value === "Win") {
    resultCard.classList.add("win-result-card");
    resultPill.classList.add("win-result");
    resultPill.textContent = "Win";
    previewCardRating.textContent = "+" + inputRating.value;
    previewCardRatingIcon.src = "images/trending-up.svg";
    previewCardRatingContainer.classList.add("win-rating");
    previewCardRatingIcon.style.display = "inline";
    checkIfRatingInputMissing();
    checkIfFriendly();
  }
});

// IF MODAL CLOSES

const importGameModal = document.getElementById("importGameForm");

importGameModal.addEventListener("hidden.bs.modal", () => {
  document.getElementById("importgame-form").reset();
});

// IMPORT GAME TO API

const importGameForm = document.getElementById("importgame-form");

importGameForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(importGameForm);
  const data = Object.fromEntries(formData);
  fetch("api/import_game", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then(function () {
    document.getElementById("importgame-form").reset();
    matchProgressIncrease();
    window.location.reload();
  });
});

// RECENT GAMES

// GET USER'S MATCH HISTORY FROM API

const dataArray = [];

fetch("/api/get_user_match_history")
  .then(function (response) {
    return response.json();
  })
  .then(function (responseData) {
    const matchesSortedByDateDesc = responseData.sort(
      (a, b) => new Date(b.date) - new Date(a.date),
    );
    //   GRAB LATEST 5 MATCHES
    const lastFiveMatchesArray = matchesSortedByDateDesc.slice(0, 5);

    // GRAB FEEDBACK FROM THE LAST 5 MATCHES

    feedbackArray = [];

    for (let match of lastFiveMatchesArray) {
      const userFeedback = match.userFeedback;
      feedbackArray.push(userFeedback);
    }

    // UPDATE AI CARD RENDER FUNCTION

    function updateAICard(parsedJSON) {
      const primaryWeaknessText = parsedJSON["primaryWeakness"];
      const whyItMattersText = parsedJSON["whyItMatters"];
      const challengeText = parsedJSON["challenge"];

      document.getElementById("sub-heading").innerText = primaryWeaknessText;
      document.getElementById("whyitmatters-text").innerText = whyItMattersText;
      document.getElementById("challenge-text").innerText = challengeText;
    }

    // CHECK AI CARD MATCH PROGRESS

    const progressCounterStat = document.querySelector("#matches-progress");

    progressCounterStat.innerText =
      localStorage.getItem("progressCount") + "/3 Matches";

    const progressBarStat = document.querySelector(".progress-bar");
    progressBarStat.style.width = localStorage.getItem("progressBar");

    // GENERATE CHALLENGE

    const regenerateChallengeBtn = document.querySelector(
      ".regenerate-challenge-btn",
    );

    regenerateChallengeBtn.addEventListener("click", (event) => {
      fetch(`/api/generate_challenge`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: feedbackArray.join("\n") }),
      })
        .then(function (response) {
          return response.json();
        })
        .then(function (response) {
          // // STORE CHALLENGE INTO LOCAL STORAGE AND UPDATE AI CARD
          localStorage.setItem("challenge", JSON.stringify(response));
          updateAICard(response);

          // RESET MATCH PROGRESS TO ZERO

          let count = 0;
          localStorage.setItem("progressCount", count);
          localStorage.setItem("progressBar", "0%");

          progressBarStat.style.width = "0%";
          progressCounterStat.innerText =
            localStorage.getItem("progressCount") + "/3 Matches";
        });
    });

    // RETRIEVE GENERATED CHALLENGE ON PAGE LOAD

    const generated_challenge = localStorage.getItem("challenge");
    const parsedJSON = JSON.parse(generated_challenge);
    if (parsedJSON != null) {
      updateAICard(parsedJSON);
    }

    // RENDER LAST 5 MATCHES TO RECENT GAMES

    const matchCardTemplate = document.getElementById("matchCardTemplate");
    const docFrag = document.createDocumentFragment();
    const recentMatchesContainer = document.getElementById(
      "recentMatchesContainer",
    );

    for (let match of lastFiveMatchesArray) {
      const clonedCardTemplate = matchCardTemplate.content.cloneNode(true);
      const resultCard = clonedCardTemplate.querySelector(".win-result-card");
      const resultLabel = clonedCardTemplate.querySelector(".win-result");
      const opponentsNames =
        clonedCardTemplate.querySelector(".opponentsNames");
      const cardScore = clonedCardTemplate.querySelector(".card-score");
      const ratingResult = clonedCardTemplate.querySelector(".win-rating");
      const ratingIcon = clonedCardTemplate.querySelector(".rating-icon");
      const ratingNumber = clonedCardTemplate.querySelector(".ratingNumber");

      resultCard.classList.remove("win-result-card");
      resultLabel.classList.remove("win-result");
      ratingResult.classList.remove("win-rating");

      const result = match.result;
      const rawDate = match.date;
      const rating = match.rating;
      const matchType = match.matchType;
      const myOpponents = match.myOpponents;
      const myTeamSet1Score = match.myTeamSet1;
      const myTeamSet2Score = match.myTeamSet2;
      const myTeamSet3Score = match.myTeamSet3;
      const matchId = match.id;
      const matchFeedback = match.userFeedback;

      const myOpponentsSet1Score = match.myOpponentsSet1;
      const myOpponentsSet2Score = match.myOpponentsSet2;
      const myOpponentsSet3Score = match.myOpponentsSet3;

      let set1ValueA = myTeamSet1Score.trim();
      let set2ValueA = myTeamSet2Score.trim();
      let set3ValueA = myTeamSet3Score.trim();
      let set1ValueB = myOpponentsSet1Score.trim();
      let set2ValueB = myOpponentsSet2Score.trim();
      let set3ValueB = myOpponentsSet3Score.trim();

      resultCard.setAttribute("data-match-id", matchId);
      const sets = [];

      if (set1ValueA !== "" && set1ValueB !== "") {
        sets.push(set1ValueA + "-" + set1ValueB);
      }

      if (set2ValueA !== "" && set2ValueB !== "") {
        sets.push(" " + set2ValueA + "-" + set2ValueB);
      }

      if (set3ValueA !== "" && set3ValueB !== "") {
        sets.push(" " + set3ValueA + "-" + set3ValueB);
      }

      if (result === "Loss") {
        resultCard.classList.add("loss-result-card");
        resultLabel.classList.add("loss-result");
        ratingResult.classList.add("loss-rating");
        if (matchType != "Friendly") {
          ratingNumber.textContent = " -" + rating;
          ratingIcon.src = "images/trending-down.svg";
        }
      } else if (result === "Draw") {
        resultCard.classList.add("draw-result-card");
        resultLabel.classList.add("draw-result");
        ratingResult.classList.add("draw-rating");

        if (matchType != "Friendly") {
          ratingNumber.textContent = rating;
          ratingIcon.src = "images/minus.svg";
        }
      } else if (result === "Win") {
        resultCard.classList.add("win-result-card");
        resultLabel.classList.add("win-result");
        ratingResult.classList.add("win-rating");

        if (matchType != "Friendly") {
          ratingNumber.textContent = " +" + rating;
          ratingIcon.src = "images/trending-up.svg";
        }
      }

      resultLabel.textContent = result;
      opponentsNames.textContent = "vs " + myOpponents;
      cardScore.textContent = sets;

      const cardDate = clonedCardTemplate.querySelector(".card-date");
      cardDate.textContent = dateFormatter(rawDate);

      docFrag.appendChild(clonedCardTemplate);
    }

    recentMatchesContainer.appendChild(docFrag);

    // DETECT CLICKS ON RECENT MATCHES

    const editDateInput = document.querySelector("#editDateInput");
    const editTimeInput = document.querySelector("#editTimeInput");
    const editDurationInput = document.querySelector("#editDurationInput");
    const editLocationInput = document.querySelector("#editLocationInput");
    const editMyTeamInput = document.querySelector("#editMyTeamInput");
    const editMyOpponents = document.querySelector("#editMyOpponentsInput");
    const editRating = document.querySelector("#editInputRating");
    const editMatchType = document.querySelector("#editMatchTypeInput");
    const editResult = document.querySelector("#editResultId");
    const editResultPill = document.querySelector("#editResultPill");
    const editResultCard = document.querySelector("#editResultCard");
    const editPreviewCardRatingContainer = document.querySelector(
      "#editPreviewCardRatingContainer",
    );
    const editPreviewCardRatingIcon = document.querySelector(
      "#editPreviewCardRatingIcon",
    );
    const editPreviewCardRating = document.querySelector(
      "#editPreviewCardRating",
    );
    const editUserfeedbackInput = document.querySelector("#editUserFeedback");

    const editmyTeamSet1 = document.querySelector("#editMyTeamSet1");
    const editmyTeamSet2 = document.querySelector("#editMyTeamSet2");
    const editmyTeamSet3 = document.querySelector("#editMyTeamSet3");

    const editMyOpponentsSet1 = document.querySelector("#editMyOpponentsSet1");
    const editMyOpponentsSet2 = document.querySelector("#editMyOpponentsSet2");
    const editMyOpponentsSet3 = document.querySelector("#editMyOpponentsSet3");

    const matchCard = document.querySelector(".recent-matches-card");

    // CHECK IF MATCHTYPE INPUT HAS CHANGED

    editMatchType.addEventListener("change", () => {
      checkIfFriendlyInEditForm();
    });

    // CHECK IF RATING INPUT IS MISSING FUNCTION IN EDIT FORM

    function checkIfRatingInputMissingInEditForm() {
      if (editRating.value.trim() === "") {
        editPreviewCardRating.style.display = "none";
        editPreviewCardRatingIcon.style.display = "none";
      }
    }

    // CHECK IF FRIENDLY MATCH TYPE IN EDIT FORM
    function checkIfFriendlyInEditForm() {
      if (editMatchType.value === "Friendly") {
        editPreviewCardRating.style.display = "none";
        editPreviewCardRatingIcon.style.display = "none";
      } else if (editMatchType.value === "Competitive") {
        editPreviewCardRating.style.display = "inline";
        editPreviewCardRatingIcon.style.display = "inline";
      }
    }

    let selectedMatchId = null;

    matchCard.addEventListener("click", (event) => {
      let closestRow = event.target.closest(
        ".win-result-card, .draw-result-card, .loss-result-card",
      );
      selectedMatchId = closestRow.dataset.matchId;
      fetch(`/api/find_game_via_id?id=${selectedMatchId}`)
        .then(function (response) {
          return response.json();
        })
        .then(function (responseData) {
          const matchDate = responseData.date;
          const matchTime = responseData.time;
          const matchDuration = responseData.duration;
          const matchLocation = responseData.location;
          const matchMyTeam = responseData.myTeam;
          const matchMyOpponents = responseData.myOpponents;
          const matchRating = responseData.rating;
          const matchType = responseData.matchType;
          const matchResult = responseData.result;
          const matchMyTeamSet1 = responseData.myTeamSet1;
          const matchMyTeamSet2 = responseData.myTeamSet2;
          const matchMyTeamSet3 = responseData.myTeamSet3;
          const matchMyOpponentsSet1 = responseData.myOpponentsSet1;
          const matchMyOpponentsSet2 = responseData.myOpponentsSet2;
          const matchMyOpponentsSet3 = responseData.myOpponentsSet3;
          const matchUserFeedback = responseData.userFeedback;

          editDateInput.value = matchDate;
          editTimeInput.value = matchTime;
          editDurationInput.value = matchDuration;
          editLocationInput.value = matchLocation;
          editMyTeamInput.value = matchMyTeam;
          editMyOpponents.value = matchMyOpponents;
          editRating.value = matchRating;
          editMatchType.value = matchType;
          editResult.value = matchResult;
          editmyTeamSet1.value = matchMyTeamSet1;
          editmyTeamSet2.value = matchMyTeamSet2;
          editmyTeamSet3.value = matchMyTeamSet3;
          editMyOpponentsSet1.value = matchMyOpponentsSet1;
          editMyOpponentsSet2.value = matchMyOpponentsSet2;
          editMyOpponentsSet3.value = matchMyOpponentsSet3;
          editUserfeedbackInput.value = matchUserFeedback;

          // FORMAT PREVIEW CARD FUNCTION

          function formatPreviewCard() {
            editResultCard.classList.remove("win-result-card");
            editResultCard.classList.remove("draw-result-card");
            editResultCard.classList.remove("loss-result-card");
            editResultPill.classList.remove("win-result");
            editResultPill.classList.remove("draw-result");
            editResultPill.classList.remove("loss-result");
            editPreviewCardRatingContainer.classList.remove("win-rating");
            editPreviewCardRatingContainer.classList.remove("loss-rating");
            editPreviewCardRatingContainer.classList.remove("draw-rating");

            if (editResult.value === "Loss") {
              editResultCard.classList.add("loss-result-card");
              editResultPill.classList.add("loss-result");
              editResultPill.textContent = "Loss";
              editPreviewCardRatingIcon.src = "images/trending-down.svg";
              editPreviewCardRating.textContent = "-" + editRating.value;
              editPreviewCardRatingContainer.classList.add("loss-rating");
              editPreviewCardRatingIcon.style.display = "inline";
              checkIfFriendlyInEditForm();
              checkIfRatingInputMissingInEditForm();
            } else if (editResult.value === "Draw") {
              editResultCard.classList.add("draw-result-card");
              editResultPill.classList.add("draw-result");
              editResultPill.textContent = "Draw";
              editPreviewCardRatingIcon.src = "images/minus.svg";
              editPreviewCardRating.textContent = "" + editRating.value;
              editPreviewCardRatingContainer.classList.add("draw-rating");
              editPreviewCardRatingIcon.style.display = "inline";
              checkIfFriendlyInEditForm();
              checkIfRatingInputMissingInEditForm();
            } else if (editResult.value === "Win") {
              editResultCard.classList.add("win-result-card");
              editResultPill.classList.add("win-result");
              editResultPill.textContent = "Win";
              editPreviewCardRating.textContent = "+" + editRating.value;
              editPreviewCardRatingIcon.src = "images/trending-up.svg";
              editPreviewCardRatingContainer.classList.add("win-rating");
              editPreviewCardRatingIcon.style.display = "inline";
              checkIfFriendlyInEditForm();
              checkIfRatingInputMissingInEditForm();
            }
          }

          // FORMAT PREVIEW CARD BY RESULT
          formatPreviewCard();

          // CHECK IF INPUT RATING HAS BEEN FILLED AND POPULATE RATING PREVIEW
          editPreviewCardRating.textContent = matchRating;
          editRating.addEventListener("input", () => {
            formatPreviewCard();
          });

          // EDIT FORM RESULT CHANGE

          editResult.addEventListener("change", () => {
            formatPreviewCard();
          });

          //POPULATE NAMES IN SCOREBOARD AND PREVIEW CARD IN EDIT FORM
          const myTeamInput = document.querySelector("#editMyTeamInput");
          const myOpponentsInput = document.querySelector(
            "#editMyOpponentsInput",
          );
          const editOpponentsNames = document.querySelector(
            "#editOpponentsNames",
          );

          const pairInput = document.querySelector("#editPairInput");
          const pairInput2 = document.querySelector("#editPairInput2");
          pairInput.value = myTeamInput.value;
          pairInput2.value = myOpponentsInput.value;
          editOpponentsNames.textContent = "vs " + pairInput2.value;

          myTeamInput.addEventListener("input", () => {
            pairInput.value = myTeamInput.value;
          });

          myOpponentsInput.addEventListener("input", () => {
            pairInput2.value = myOpponentsInput.value;
            editOpponentsNames.textContent = "vs " + pairInput2.value;
          });

          // FILL OUT DATE IN PREVIEW CARD IN EDIT FORM
          const dateInput = document.querySelector("#editDateInput");
          const editPreviewCardDate = document.querySelector(
            "#editPreviewCardDate",
          );
          editPreviewCardDate.textContent = dateFormatter(dateInput.value);

          dateInput.addEventListener("change", () => {
            editPreviewCardDate.textContent = dateFormatter(dateInput.value);
          });

          // UPDATE PREVIEW SCORE CARD IN EDIT FORM

          const previewCardScore = document.querySelector(
            "#editPreviewCardScore",
          );

          const editMyTeamSet1Preview =
            document.querySelector("#editMyTeamSet1");
          const editMyTeamSet2Preview =
            document.querySelector("#editMyTeamSet2");
          const editMyTeamSet3Preview =
            document.querySelector("#editMyTeamSet3");

          const editMyOpponentsSet1Preview = document.querySelector(
            "#editMyOpponentsSet1",
          );
          const editMyOpponentsSet2Preview = document.querySelector(
            "#editMyOpponentsSet2",
          );
          const editMyOpponentsSet3Preview = document.querySelector(
            "#editMyOpponentsSet3",
          );

          scoreInputs = [
            editMyTeamSet1Preview,
            editMyTeamSet2Preview,
            editMyTeamSet3Preview,
            editMyOpponentsSet1Preview,
            editMyOpponentsSet2Preview,
            editMyOpponentsSet3Preview,
          ];

          scoreInputs.forEach((input) =>
            input.addEventListener("input", () => {
              createScoreSetEditFormPreview();
            }),
          );

          function createScoreSetEditFormPreview() {
            let set1ValueA = editMyTeamSet1Preview.value.trim();
            let set2ValueA = editMyTeamSet2Preview.value.trim();
            let set3ValueA = editMyTeamSet3Preview.value.trim();
            let set1ValueB = editMyOpponentsSet1Preview.value.trim();
            let set2ValueB = editMyOpponentsSet2Preview.value.trim();
            let set3ValueB = editMyOpponentsSet3Preview.value.trim();
            const sets = [];
            if (set1ValueA !== "" && set1ValueB !== "") {
              sets.push(set1ValueA + "-" + set1ValueB);
            }

            if (set2ValueA !== "" && set2ValueB !== "") {
              sets.push(" " + set2ValueA + "-" + set2ValueB);
            }

            if (set3ValueA !== "" && set3ValueB !== "") {
              sets.push(" " + set3ValueA + "-" + set3ValueB);
            }
            previewCardScore.textContent = sets;
          }

          createScoreSetEditFormPreview();
        });

      // DELETE GAME TO API

      const delMatchBtn = document.querySelector("#delMatchBtn");

      delMatchBtn.addEventListener("click", () => {
        fetch(`api/delete_game?id=${selectedMatchId}`, {}).then(function () {
          // IF RECENT MATCHES IS EMPTY, DELETE CHALLENGE

          if (lastFiveMatchesArray.length <= 1) {
            localStorage.removeItem("challenge");
            localStorage.setItem("progressBar", "0%");
            localStorage.setItem("progressCount", 0);
          }
          window.location.reload();
        });
      });
    });

    // SUBMIT GAME TO API

    const editGameForm = document.getElementById("editgame-form");

    editGameForm.addEventListener("submit", (event) => {
      console.countReset("edit form submit handler fired");

      event.preventDefault();
      const formData = new FormData(editGameForm);
      const data = Object.fromEntries(formData);

      fetch(`/api/edit_game?id=${selectedMatchId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }).then(function () {
        window.location.reload();
      });
    });

    //   SETTINGS PANEL

    // SAVE START RATING IN LOCAL STORAGE

    const settingsSaveBtn = document.getElementById("settingsSaveBtn");
    const welcomeSaveBtn = document.getElementById("welcomeSaveBtn");
    const startRatingInput = document.getElementById("startRatingInput");
    const welcomeStartRatingInput = document.getElementById(
      "welcomeStartRatingInput",
    );

    welcomeSaveBtn.addEventListener("click", () => {
      const startRatingValue = welcomeStartRatingInput.value;
      localStorage.setItem("start-rating", startRatingValue);
      window.location.reload();
    });

    settingsSaveBtn.addEventListener("click", () => {
      const startRatingValue = startRatingInput.value;
      localStorage.setItem("start-rating", startRatingValue);
      window.location.reload();
    });

    // IF WELCOME MESSAGE SKIPPED

    const skipBtn = document.getElementById("skipBtn");

    skipBtn.addEventListener("click", () => {
      localStorage.setItem("skipFlag", "true");
    });

    // CHECK IF START RATING EXISTS AND IF SKIP FLAG IS FALSE

    localStartRating = localStorage.getItem("start-rating");
    startRatingFloat = parseFloat(localStartRating);

    if (
      Number.isFinite(startRatingFloat) === false &&
      localStorage.getItem("skipFlag") !== "true"
    ) {
      const welcomeModal = new bootstrap.Modal(
        document.getElementById("welcomeModal"),
      );
      welcomeModal.show();
    }

    // EMPTY OR POPULATED AI STATE

    const emptyState = document.getElementById("emptyAiState");
    const populatedState = document.getElementById("populatedAiState");

    const storedChallenge = localStorage.getItem("challenge");

    if (storedChallenge === null) {
      emptyState.style.display = "block";
      populatedState.style.display = "none";
    } else {
      emptyState.style.display = "none";
      populatedState.style.display = "block";
    }

    // GENERATE CHALLENGE IF MATCH ARRAY IS 0 AND CHALLENGE STROAGE IS NULL

    const aiCardBtn = document.getElementById("aiCardBtn");
    const aiCardBtnText = document.getElementById("aiCardBtnText");

    if (lastFiveMatchesArray.length > 0 && storedChallenge === null) {
      fetch(`/api/generate_challenge`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: feedbackArray.join("\n") }),
      })
        .then(function (response) {
          return response.json();
        })
        .then(function (response) {
          // // STORE CHALLENGE INTO LOCAL STORAGE AND UPDATE AI CARD
          localStorage.setItem("challenge", JSON.stringify(response));

          // RESET MATCH PROGRESS TO ZERO

          let count = 0;
          localStorage.setItem("progressCount", count);
          localStorage.setItem("progressBar", "0%");

          progressBarStat.style.width = "0%";
          progressCounterStat.innerText =
            localStorage.getItem("progressCount") + "/3 Matches";
          emptyState.style.display = "none";
          populatedState.style.display = "block";
          updateAICard(response);
        });
    }
  });
