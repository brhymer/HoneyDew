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
  const taskId = targetTask.getAttribute("data-taskId");
  const taskTitle = targetTask.getAttribute("data-tasktitle");
  const taskDescription = targetTask.getAttribute("data-taskdescription");
  const taskDueDate = targetTask.getAttribute("data-taskduedate");
  const taskComplete = targetTask.getAttribute("data-taskcomplete");
  const taskImgUrl = targetTask.getAttribute("data-taskimageurl");

  //Modal Label
  document.querySelector("#showTaskModalLabel").innerHTML = taskTitle;
  //Body
  document.querySelector("#show-task-description").innerHTML = taskDescription;
  document.querySelector("#show-task-dueDate").innerHTML = taskDueDate;
  document.querySelector("#show-task-complete").innerHTML = taskComplete;
  document.querySelector("#show-task-image").setAttribute("src", taskImgUrl);
  if (taskImgUrl)
    document.querySelector("#show-task-image").setAttribute("alt", taskTitle);

  //Buttons
  const editButton = document.querySelector("#show-task-button");
  editButton.setAttribute("href", `/tasks/edit/${taskId}`);
});

$(`#showTaskModal`).on("hidden.bs.modal", (event) => {
  document.querySelector("#showTaskModalLabel").innerHTML = "";
  //Body
  document.querySelector("#show-task-description").innerHTML = "";
  document.querySelector("#show-task-dueDate").innerHTML = "";
  document.querySelector("#show-task-complete").innerHTML = "";
  document.querySelector("#show-task-image").setAttribute("src", "");
  document.querySelector("#show-task-image").setAttribute("alt", "");

  //Buttons
  const editButton = document.querySelector("#show-task-button");
  editButton.setAttribute("href", `/tasks/edit/`);
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
