// Opening and Closing ""

const open_button = document.getElementById("importagame");
const close_button = document.getElementById("close-button");
const importagame_form = document.getElementById("importagame-form");
const submit_button = document.getElementById("submit_button");

open_button.addEventListener("click", () => {
  importagame_form.classList.add("open");
});

close_button.addEventListener("click", () => {
  importagame_form.classList.remove("open");
});

submit_button.addEventListener("click", () => {
  importagame_form.classList.remove("open");
});

// POST JSON to API

const importgame_form = document.getElementById("importagameform");

importgame_form.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(importgame_form);
  const data = Object.fromEntries(formData);

  fetch("https://padelnotes-function-app001.azurewebsites.net/api/importgame", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
});

// Full Match History Table

fetch(
  "https://padelnotes-function-app001.azurewebsites.net/api/full_match_history"
)
  .then(function (response) {
    return response.json();
  })

  .then(function (match_history) {
    console.log(match_history);
    let placeholder = document.querySelector("#table-data");
    let out = "";
    for (let match of match_history.data) {
      out += `
        <tr>
          <td>${match.data.date}</td>
          <td>${match.data.time}</td>
          <td>${match.data.location}</td>
          <td>${match.data.matchtype}</td>
          <td>${match.data.teamaplayer1}</td>
          <td>${match.data.teamaplayer2}</td>
          <td>${match.data.teambplayer1}</td>
          <td>${match.data.teambplayer2}</td>
          <td>${match.data.set1scorea}</td>
          <td>${match.data.set2scorea}</td>
          <td>${match.data.set3scorea}</td>
          <td>${match.data.set1scoreb}</td>
          <td>${match.data.set2scoreb}</td>
          <td>${match.data.set3scoreb}</td>
        </tr>
    `;
    }
    placeholder.innerHTML = out;
  });
