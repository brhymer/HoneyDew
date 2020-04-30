confirmPasswordEl = document.querySelector("#confirm-password");

confirmPasswordEl.addEventListener("blur", (event) => {
  console.log(event.target);
  console.log(document.querySelector("#password"));
});
