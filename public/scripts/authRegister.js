passwordEl = document.querySelector("#password");
confirmPasswordEl = document.querySelector("#confirm-password");
const registerButton = document.querySelector("#registerButton");

function flagPasswordError(messages) {
  if (messages.length > 0) {
    //Bad button
    registerButton.disabled = true;
    registerButton.style.cursor = "not-allowed";

    //Show warning
    messages.forEach((message) => {
      const wrongPassword = document.createElement("p");
      wrongPassword.classList.add("wrongPasswordWarning");
      wrongPassword.style.color = "red";
      wrongPassword.innerHTML = message;
      document
        .querySelector("#consent")
        .insertAdjacentElement("beforebegin", wrongPassword);
    });
  }
}

confirmPasswordEl.addEventListener("blur", () => {
  //Remove existing warnings
  if (document.querySelectorAll(".wrongPasswordWarning")) {
    const toDelete = document.querySelectorAll(".wrongPasswordWarning");
    toDelete.forEach((elem) => elem.remove());
  }
  //Generate error messages
  const errorMessages = [];
  //Current rules:
  //Passwords must match
  //Length must be at least 12
  if (passwordEl.value !== confirmPasswordEl.value) {
    errorMessages.push("Passwords do not match");
  }
  if (passwordEl.value.length < 12) {
    errorMessages.push("Password must be 12 characters or longer");
  }

  flagPasswordError(errorMessages);

  if (errorMessages.length === 0) {
    registerButton.disabled = false;
    registerButton.style.cursor = "default";
  }
});
