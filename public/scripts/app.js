$(`#deleteTaskModal`).on("show.bs.modal", (event) => {
  console.log("YOU CLICKED DELETE!");
});

function addFavIcon() {
  const favicon = document.createElement("link");
  favicon.type = "image/icon";
  favicon.rel = "icon";

  if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark").matches
  ) {
    favicon.href = "/assets/honeydew-logo-white.svg";
  } else {
    favicon.href = "/assets/honeydew-logo-black.svg";
  }
  const head = document.head;
  head.appendChild(favicon);
}

addFavIcon();
