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
  const formData = new FormData(importgame_form);
  const data = Object.fromEntries(formData);

  fetch(
    "https://padelnotes-functions-bta9hxdcajewb2cb.uksouth-01.azurewebsites.net/api/importgame",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );
});
