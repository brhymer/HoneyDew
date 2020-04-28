$(`#deleteTaskModal`).on("show.bs.modal", (event) => {
  const targetTask = event.relatedTarget;

  document.querySelector(
    "#delete-task-title"
  ).innerHTML = targetTask.getAttribute("data-tasktitle");
  const deleteForm = document.querySelector("#delete-task-form");
  const targetTaskId = targetTask.getAttribute("data-taskid");
  deleteForm.setAttribute("action", `/tasks/${targetTaskId}?_method=DELETE`);
});

$(`#deleteSpaceModal`).on("show.bs.modal", (event) => {
  const targetSpace = event.relatedTarget;

  document.querySelector(
    "#delete-space-name"
  ).innerHTML = targetSpace.getAttribute("data-spacename");
  const deleteForm = document.querySelector("#delete-space-form");
  const targetSpaceId = targetSpace.getAttribute("data-spaceid");
  deleteForm.setAttribute("action", `/spaces/${targetSpaceId}?_method=DELETE`);
});

$(`#showTaskModal`).on("show.bs.modal", (event) => {
  const targetTask = event.relatedTarget;

  console.log("You clicked show");
  console.log(targetTask);
  document.querySelector(
    "#show-task-title"
  ).innerHTML = targetTask.getAttribute("data-tasktitle");
  const editButton = document.querySelector("#show-task-button");
  const targetTaskId = targetTask.getAttribute("data-taskId");
  editButton.setAttribute("href", `/tasks/edit/${targetTaskId}`);
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
