console.log("Here we are");
const mainEl = document.querySelector("main");

mainEl.addEventListener("click", (event) => {
  if (event.target.classList.contains("fa-check-circle")) {
    const icon = event.target;
    const id = icon.getAttribute("data-taskId");
    const taskStatus = icon.getAttribute("data-taskcomplete");
    fetch(`/api/v1/tasks/complete/${id}/${taskStatus}`, {
      method: "PUT",
      credentials: "include", //Passes our cookie
    })
      .then((status) => {
        icon.classList.remove("fas");
        icon.classList.remove("far");
        if (taskStatus === "true") {
          //Adjust our class and data
          icon.classList.add("far");
          icon.setAttribute("data-taskcomplete", "false");
          //Adjust our show modal
          document
            .querySelector(`#show-${id}`)
            .setAttribute("data-taskcomplete", "Nope");
        } else {
          icon.classList.add("fas");
          icon.setAttribute("data-taskcomplete", "true");
          document
            .querySelector(`#show-${id}`)
            .setAttribute("data-taskcomplete", "Yep");
        }
      })
      .catch((err) => console.log(err));
  }
});
