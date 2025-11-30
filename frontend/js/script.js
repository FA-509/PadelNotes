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

  //   SORT DATE BY LATEST DATE FIRST

  .then(function (responseData) {
    let placeholder = document.querySelector("#table-data");
    let out = "";
    const dataArray = responseData.data;
    newDateArray = dataArray.sort(
      (a, b) => new Date(b.data.date) - new Date(a.data.date)
    );

    // ADD MATCHES TO MATCH HISTORY CARD IF LESS THAN OR EQUAL TO 4 MATCHES

    lastFiveMatchesArray = [];
    if (newDateArray.length <= 4) {
      for (let match of newDateArray) {
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

      // IF 5 OR MORE MATCHES
    } else {
      for (let i = 0; i < 5; i++) {
        lastFiveMatchesArray.push(newDateArray[i].data);
      }
      for (let match of lastFiveMatchesArray) {
        let rawDate = match.date;
        let rawResult = match.result;
        let matchId = match.id;
        out += `
                  <tr id="${matchId}">
                    <td style="text-align: left;">${dateFormatter(rawDate)}</td>
                    <td class="${colourResult(rawResult)}">${rawResult}</td>
                  </tr>
              `;
      }
    }
    placeholder.innerHTML = out;

    // RATING CHART

    const dates = [];
    const ratings = [];
    const startRating = "";
    for (let match of newDateArray) {
      let rawDate = match.data.date;
      let rawRating = match.data.rating;
      dates.push(rawDate);
      ratings.push(rawRating);
    }

    sortDates = dataArray.sort(
      (a, b) => new Date(a.data.date) - new Date(b.data.date)
    );

    datesOrdered = [];

    for (let date of sortDates) {
      datesOrdered.push(date.data.date);
    }

    // ADD START RATING TO ARRAY

    datesOrdered.unshift(startRating);

    // CREATE RATINGS ARRAY

    ratingsAdded = [];
    const RatingValue = localStorage.getItem("start-rating");
    const FloatRatingValue = parseFloat(RatingValue);
    ratingsAdded.push(FloatRatingValue);
    let n = 0;
    for (let rating of sortDates) {
      let floatRating = parseFloat(rating.data.rating);
      let combinedRating = ratingsAdded[n] + floatRating;
      ratingsAdded.push(combinedRating);
      n = n + 1;
    }

    const labels = datesOrdered;
    const data = {
      labels: labels,
      datasets: [
        {
          data: ratingsAdded,
          fill: true,
          tension: 0.1,
          radius: 5,
          borderColor: "rgb(60, 120, 255)",
          pointBackgroundColor: "rgb(60, 120, 255)",
          backgroundColor: function (context) {
            const chart = context.chart;
            const { ctx, chartArea } = chart;
            if (!chartArea) {
              return;
            }
            return getGradient(ctx, chartArea);
          },
        },
      ],
    };

    // COLOUR GRADIENT FUNCTION

    let width, height, gradient;
    function getGradient(ctx, chartArea) {
      const chartWidth = chartArea.right - chartArea.left;
      const chartHeight = chartArea.bottom - chartArea.top;
      if (!gradient || width !== chartWidth || height !== chartHeight) {
        width = chartWidth;
        height = chartHeight;
        gradient = ctx.createLinearGradient(
          0,
          chartArea.bottom,
          0,
          chartArea.top
        );
        gradient.addColorStop(0, "rgba(173, 197, 252, 1)");
        gradient.addColorStop(0.5, "rgba(127, 163, 247, 1)");
        gradient.addColorStop(1, "rgb(60, 120, 255)");
      }

      return gradient;
    }

    const lastArrayIndex = ratingsAdded.length;
    const config = {
      type: "line",
      data: data,
      // plugins: [ChartDataLabels],
      options: {
        layout: {
          padding: {
            top: 30,
            right: 15,
          },
        },
        scales: {
          y: {
            display: true,
            position: "right",
          },
          x: {
            display: false,
          },
        },
        plugins: {
          // datalabels: {
          //   anchor: "end",
          //   align: "end",
          //   font: {
          //     size: 15,
          //     weight: "bold",
          //   },
          //   display: function (context) {
          //     return context.dataIndex === lastArrayIndex - 1;
          //   },
          // },
          legend: {
            display: false,
          },
        },
      },
    };

    const chart = new Chart(document.getElementById("line-chart"), config);

    // GRAB LAST 5 OR LESS BAD FEEDBACKS

    const badFeedbackArray = [];
    const lengthNewDateArray = newDateArray.length;
    let count;
    if (lengthNewDateArray > 5) {
      count = 5;
    } else {
      count = lengthNewDateArray;
    }
    for (let i = 0; i < count; i++) {
      badFeedbackArray.push(newDateArray[i].data.negativefeedback);
    }

    // GENERATE CHALLENGE

    const badFeedbackJson = {
      content: badFeedbackArray.toString(),
    };

    challengeBtn = document.getElementById("btn-challenge");

    challengeBtn.addEventListener("click", (event) => {
      fetch(
        `https://padelnotes-function-app001.azurewebsites.net/api/generate_challenge`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(badFeedbackJson),
        }
      )
        .then(function (response) {
          return response.json();
        })
        .then(function (response) {
          localStorage.setItem("challenge", JSON.stringify(response));
          window.location.reload();
        });
    });

    // LOCAL STORAGE CHALLENGE

    const generated_challenge = localStorage.getItem("challenge");
    parsedJSON = JSON.parse(generated_challenge);
    primaryWeaknessText = parsedJSON["primaryWeakness"];
    whyItMattersText = parsedJSON["whyItMatters"];
    challengeText = parsedJSON["challenge"];
    document.getElementById("primary-weakness").innerText = primaryWeaknessText;
    document.getElementById("why-it-matters").innerText = whyItMattersText;
    document.getElementById("your-challenge").innerText = challengeText;

    // LISTEN FOR CLICKS ON MATCH HISTORY TABLE

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

          let editGameTableBody = document.querySelector(
            "#editform-table-data"
          );
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
      let importGameTableBody = document.querySelector(
        "#importform-table-data"
      );
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

      fetch(
        "https://padelnotes-function-app001.azurewebsites.net/api/import_game",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      ).then(function () {
        document
          .getElementById("importgame-container")
          .classList.remove("open");
        window.location.reload();
      });
    });

    // SETTINGS PANEL

    const settingsIcon = document.getElementById("settings-icon");
    const settingsContainer = document.getElementById("settings-container");

    settingsIcon.addEventListener("click", () => {
      settingsContainer.classList.add("open");
    });

    // SAVE START RATING IN SETTINGS PANEL

    const settingsSaveBtn = document.getElementById("setting-save-button");
    const startRatingInput = document.getElementById("start-rating");

    settingsSaveBtn.addEventListener("click", () => {
      settingsContainer.classList.remove("open");
      startRatingValue = startRatingInput.value;
      localStorage.setItem("start-rating", startRatingValue);
      window.location.reload();
    });
  });
