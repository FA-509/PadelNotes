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

// IMPORT GAME FORM

//POPULATE NAMES IN SCOREBOARD AND PREVIEW CARD
const myTeamInput = document.querySelector("#myTeam");
const opponentsNames = document.querySelector("#opponentsNames");
const pairInput = document.querySelector("#pairInput");

const myOpponentsInput = document.querySelector("#myOpponents");
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
  })
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
  "#previewCardRatingContainer"
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
  fetch("http://localhost:4280/api/import_game", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then(function () {
    document.getElementById("importgame-form").reset();
    window.location.reload();
  });
});

// RECENT GAMES
