// Opening and Closing Import Game Form ""

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
          <td>${match.data.id}</td>
          <td><button class="edit-button" id="${match.data.id}" type="button">Edit</button></td>
        </tr>
    `;
    }
    placeholder.innerHTML = out;

    // Edit Game Form

    const edit_buttons = document.querySelectorAll(".edit-button");
    const editgameform = document.getElementById("editgameform");

    edit_buttons.forEach(function (editbutton) {
      editbutton.addEventListener("click", () =>
        editgameform.classList.add("open")
      );
    });

    const edit_close_button = document.getElementById("editgame-close-button");

    edit_close_button.addEventListener("click", () =>
      editgameform.classList.remove("open")
    );

    edit_buttons.forEach(function (editbutton) {
      editbutton.addEventListener("click", () => {
        editbutton_id = editbutton.id;
        fetch(
          `https://padelnotes-function-app001.azurewebsites.net/api/find_game_via_id?id=${editbutton_id}`
        )
          .then(function (response) {
            return response.json();
          })
          .then(function (game_info) {
            document.getElementById("location_input").value =
              game_info.data.location;
            document.getElementById("date_input").value = game_info.data.date;
            document.getElementById("time_input").value = game_info.data.time;
            document.getElementById("duration_input").value =
              game_info.data.duration;
            document.getElementById("matchtype_input").value =
              game_info.data.matchtype;
            document.getElementById("teamaplayer1_input").value =
              game_info.data.teamaplayer1;
            document.getElementById("teamaplayer2_input").value =
              game_info.data.teamaplayer2;
            document.getElementById("teamaplayer1_input").value =
              game_info.data.teamaplayer1;
            document.getElementById("teamaplayer2_input").value =
              game_info.data.teamaplayer2;
            document.getElementById("teambplayer1_input").value =
              game_info.data.teambplayer1;
            document.getElementById("teambplayer2_input").value =
              game_info.data.teambplayer2;
            document.getElementById("set1scorea_input").value =
              game_info.data.set1scorea;
            document.getElementById("set2scorea_input").value =
              game_info.data.set2scorea;
            document.getElementById("set3scorea_input").value =
              game_info.data.set3scorea;
            document.getElementById("set1scoreb_input").value =
              game_info.data.set1scoreb;
            document.getElementById("set2scoreb_input").value =
              game_info.data.set2scoreb;
            document.getElementById("set3scoreb_input").value =
              game_info.data.set3scoreb;
            document.getElementById("positivefeedback_input").value =
              game_info.data.positivefeedback;
            document.getElementById("negativefeedback_input").value =
              game_info.data.negativefeedback;
          });

        const edit_form = document.getElementById("editgame_form");

        edit_form.addEventListener("submit", (event) => {
          event.preventDefault();
          const formData = new FormData(importgame_form);
          const data = Object.fromEntries(formData);

          fetch(`http://localhost:7071/api/edit_game?id=${editbutton_id}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          });
        });
      });
    });
  });
