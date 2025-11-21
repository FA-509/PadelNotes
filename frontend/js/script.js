// Match History Table Card

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

  let dayLastDigit = intDay % 10;
  let suffixDate;

  if ([11, 12, 13].includes(intDay)) {
    suffixDate = "<sup>th</sup>";
  } else if (dayLastDigit === 1) {
    suffixDate = "<sup>st</sup>";
  } else if (dayLastDigit === 2) {
    suffixDate = "<sup>nd</sup>";
  } else if (dayLastDigit === 3) {
    suffixDate = "<sup>rd</sup>";
  } else {
    suffixDate = "<sup>th</sup>";
  }

  return intDay + suffixDate + " " + monthName;
}

//   RESULT COLOURING

function colourResult(result) {
  let colouredResult;
  if (result === "Win") {
    colouredResult = "win";
  } else if (result === "Loss") {
    colouredResult = "loss";
  } else if (result === "Draw") {
    colouredResult = "draw";
  }
  return colouredResult;
}
fetch(
  "https://padelnotes-function-app001.azurewebsites.net/api/full_match_history"
)
  .then(function (response) {
    return response.json();
  })

  //   ADD MATCH HISTORY TO TABLE

  .then(function (responseData) {
    let placeholder = document.querySelector("#table-data");
    let out = "";
    for (let match of responseData.data) {
      let rawDate = match.data.date;
      let rawResult = match.data.result;
      let matchId = match.data.id;
      out += `
              <tr id="${matchId}">
                <td style="text-align: left;">${dateFormatter(rawDate)}</td>
                <td class="${colourResult(rawResult)}">${rawResult}</td>
              </tr>
          `;
    }
    placeholder.innerHTML = out;
  });

// LISTEN FOR CLICKS ON TABLE

document.querySelector("#table-data").addEventListener("click", (event) => {
  let closestRow = event.target.closest("tr");
  let matchId = closestRow.id;
  fetch(
    `https://padelnotes-function-app001.azurewebsites.net/api/find_game_via_id?id=${matchId}`
  )
    .then(function (response) {
      return response.json();
    })

    // PUT MATCH INFO ONTO EDIT GAME FORM

    .then(function (game_info) {
      document.getElementById("form-container").classList.add("open");
      document.getElementById("date").value = game_info.data.date;
      document.getElementById("time").value = game_info.data.time;
      document.getElementById("location").value = game_info.data.location;
      document.getElementById("duration").value = game_info.data.duration;
      document.getElementById("result").value = game_info.data.result;
      document.getElementById("positivefeedback").value =
        game_info.data.positivefeedback;
      document.getElementById("negativefeedback").value =
        game_info.data.negativefeedback;
      document.getElementById("matchid").value = game_info.data.id;
      document.getElementById("rating").value = game_info.data.rating;

      // PUT NAMES AND SCORES INTO EDIT TABLE

      let editGameTableBody = document.querySelector("#editform-table-data");
      let tableRows = "";
      {
        tableRows += `
        <tr>
          <td scope="row">${game_info.data.teamaplayer1} / ${game_info.data.teamaplayer2}</td>
          <td><input type="number" name="set1scorea" class="score-edit" value="${game_info.data.set1scorea}"></td>
          <td><input type="number" name="set2scorea" class="score-edit" value="${game_info.data.set2scorea}"></td>
          <td><input type="number" name="set3scorea" class="score-edit" value="${game_info.data.set3scorea}"></td>
        </tr>
        <tr>
          <td scope="row">${game_info.data.teambplayer1} / ${game_info.data.teambplayer2}</td>
          <td><input type="number" name="set1scoreb" class="score-edit" value="${game_info.data.set1scoreb}"></td>
          <td><input type="number" name="set2scoreb" class="score-edit" value="${game_info.data.set2scoreb}"></td>
          <td><input type="number" name="set3scoreb" class="score-edit" value="${game_info.data.set3scoreb}"></td>
        </tr>
          `;
      }
      editGameTableBody.innerHTML = tableRows;
    });
});

// POST FORM AFTER SAVE BUTTON HAS BEEN CLICKED
let editgame_form = document.getElementById("editgame_form");

editgame_form.addEventListener("submit", (event) => {
  event.preventDefault();
  const matchIdInput = document.getElementById("matchid");
  const matchId = matchIdInput.value;
  console.log(matchId);
  let formData_edit = new FormData(editgame_form);
  let match_edit = Object.fromEntries(formData_edit);
  document.getElementById("form-container").classList.remove("open");

  fetch(
    `https://padelnotes-function-app001.azurewebsites.net/api/edit_game?id=${matchId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(match_edit),
    }
  ).then(function () {
    window.location.reload();
  });
});

// DELETE GAME IF DELETE BUTTON IS PRESSED

deleteBtn = document.getElementById("delete-btn");

deleteBtn.addEventListener("click", () => {
  const matchIdInput = document.getElementById("matchid");
  const matchId = matchIdInput.value;
  console.log(matchId);
  fetch(
    `https://padelnotes-function-app001.azurewebsites.net/api/delete_game?id=${matchId}`
  ).then(function () {
    document.getElementById("form-container").classList.remove("open");
    window.location.reload();
  });
});

// IMPORT A GAME

importGameBtn = document.getElementById("import-game-btn");

importGameBtn.addEventListener("click", () => {
  document.getElementById("importgame-container").classList.add("open");
  // PUT NAMES AND SCORES INTO IMPORT GAME TABLE
  let importGameTableBody = document.querySelector("#importform-table-data");
  let tableRows = "";
  {
    tableRows += `
        <tr>
          <td scope="row"><input type="text" name="teamaplayer1" class="name-edit" placeholder="Player A"> / <input type="text" name="teamaplayer2" class="name-edit" placeholder="Player A"></td>
          <td><input type="number" name="set1scorea" class="score-edit" placeholder="0"></td>
          <td><input type="number" name="set2scorea" class="score-edit" placeholder="0"></td>
          <td><input type="number" name="set3scorea" class="score-edit" placeholder="0"></td>
        </tr>
        <tr>
          <td scope="row"><input type="text" name="teambplayer1" class="name-edit" placeholder="Player B"> / <input type="text" name="teambplayer2" class="name-edit" placeholder="Player B"></td>
          <td><input type="number" name="set1scoreb" class="score-edit" placeholder="0"></td>
          <td><input type="number" name="set2scoreb" class="score-edit" placeholder="0"></td>
          <td><input type="number" name="set3scoreb" class="score-edit" placeholder="0"></td>
        </tr>
          `;
  }
  importGameTableBody.innerHTML = tableRows;
});

// SUBMIT GAME TO API

const importGameForm = document.getElementById("importgame-form");

importGameForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(importGameForm);
  const data = Object.fromEntries(formData);

  fetch("https://padelnotes-function-app001.azurewebsites.net/api/importgame", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then(function () {
    document.getElementById("importgame-container").classList.remove("open");
    window.location.reload();
  });
});
