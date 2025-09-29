// Opening and Closing ""

const open_button = document.getElementById("importagame");
const close_button = document.getElementById("close-button");
const importagame_form = document.getElementById("importagame-form");

open_button.addEventListener("click", () => {
  importagame_form.classList.add("open");
});

close_button.addEventListener("click", () => {
  importagame_form.classList.remove("open");
});
