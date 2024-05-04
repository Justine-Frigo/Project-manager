window.addEventListener("load", () => {
  const currentDate = new Date();
  const taskDueDateInput = document.getElementById("taskDueDate");
  taskDueDateInput.value = currentDate.toISOString().slice(0, 10);

  // On vérifie si le local storage n'existe pas, auquel cas on le créé
  if (!localStorage.getItem("project-planner-tasks")) {
    localStorage.setItem("project-planner-tasks", "[]");
  }
});

// Ciblage des boutons
const buttonAll = document.getElementById("display-all");
const buttonToDo = document.getElementById("display-to-do");
const buttonDoing = document.getElementById("display-doing");
const buttonDone = document.getElementById("display-done");

const toDoSection = document.getElementById("toDo");
const doingSection = document.getElementById("doing");
const doneSection = document.getElementById("done");

// Events listeners du filtre
buttonToDo.addEventListener("click", () => {
  doingSection.style.display = "none";
  doneSection.style.display = "none";
  toDoSection.style.display = "flex";
  toDoSection.style.gridColumnStart = 2;
});

buttonDoing.addEventListener("click", () => {
  toDoSection.style.display = "none";
  doneSection.style.display = "none";
  doingSection.style.display = "flex";
  doingSection.style.gridColumnStart = 2;
});

buttonDone.addEventListener("click", () => {
  toDoSection.style.display = "none";
  doingSection.style.display = "none";
  doneSection.style.display = "flex";
  doneSection.style.gridColumnStart = 2;
});

buttonAll.addEventListener("click", () => {
  toDoSection.style.display = "flex";
  doingSection.style.display = "flex";
  doneSection.style.display = "flex";
  toDoSection.style.gridColumnStart = 1;
  doneSection.style.gridColumnStart = 3;
});

// Utilisation du tri lors d'un événement, par exemple lors du clic sur un bouton
const sortButton = document.getElementById("sort-by-due-date");
sortButton.addEventListener("click", sortTasksByDueDate);

const form = document.getElementById("taskForm");
const addTaskButton = document.getElementById("addTask");

addTaskButton.addEventListener("click", () =>{
  form.classList.toggle("hidden");
  form.classList.toggle("form-box");

})

const closeButton = document.getElementById("closeButton");
closeButton.addEventListener("click",() =>{
  form.classList.toggle("hidden");
  form.classList.toggle("form-box");
})

function createTask(event) {
  event.preventDefault();

  // Valeurs du formulaire
  const taskName = document.getElementById("taskName").value;
  const taskDescription = document.getElementById("taskDescription").value;
  const taskStatus = document.getElementById("taskStatus").value;
  const taskDueDate = document.getElementById("taskDueDate").value;

  // Calcul du délai restant
  const remainingTime = calculateRemainingTime(taskDueDate);

  const taskElement = document.createElement("article");
  taskElement.innerHTML = `
              <div class="task-header"><h3>${taskName}</h3>
              <button class="deleteTaskBtn">Delete</button></div>
              <p>${taskDescription}</p>
              <select class="taskSelect">
                <option value="toDo" ${
                  taskStatus === "toDo" ? "selected" : ""
                }>To do</option>
                <option value="doing" ${
                  taskStatus === "doing" ? "selected" : ""
                }>Doing</option>
                <option value="done" ${
                  taskStatus === "done" ? "selected" : ""
                }>Done</option>
              </select>
              <h4>${formatDate(taskDueDate, "fr-FR")} (${remainingTime})</h4>
              
          `;

  const container = getContainerByStatus(taskStatus);
  container.appendChild(taskElement);

  // Récupère les tâches depuis le localStorage
  let storedTasks = JSON.parse(localStorage.getItem("project-planner-tasks"));

  // Ajoute la nouvelle tâche
  const task = {
    name: taskName,
    description: taskDescription,
    status: taskStatus,
    dueDate: taskDueDate,
  };
  storedTasks.push(task);

  // Enregistre le tableau mis à jour dans le localStorage
  localStorage.setItem("project-planner-tasks", JSON.stringify(storedTasks));

  document.getElementById("taskName").value = "";
  document.getElementById("taskDescription").value = "";
  document.getElementById("taskStatus").value = "null";
  document.getElementById("taskDueDate").value = new Date()
    .toISOString()
    .slice(0, 10);

  // Ajoute un event listener pour mettre à jour le statut de la tâche
  taskElement
    .querySelector(".taskSelect")
    .addEventListener("change", function () {
      const newStatus = this.value;
      // Modifie le conteneur de la tâche
      const newContainer = getContainerByStatus(newStatus);
      newContainer.appendChild(taskElement);
    });

  // Ajoute un event listener pour supprimer la tâche
  taskElement
    .querySelector(".deleteTaskBtn")
    .addEventListener("click", function () {
      // Supprime l'élément de l'interface utilisateur
      taskElement.remove();
      // Supprime la tâche du localStorage
      storedTasks = storedTasks.filter((t) => t.name !== task.name);
      localStorage.setItem(
        "project-planner-tasks",
        JSON.stringify(storedTasks)
      );
    });

    form.classList.toggle("hidden");
    form.classList.toggle("form-box");

}

function calculateRemainingTime(dueDate) {
  const dueDateTime = new Date(dueDate).getTime();
  const today = new Date().getTime();
  const difference = dueDateTime - today;
  const daysRemaining = Math.ceil(difference / (1000 * 3600 * 24));

  if (daysRemaining < 0) {
    return "Date expired";
  } else if (daysRemaining === 0) {
    return "Today";
  } else {
    return `In ${daysRemaining} ${daysRemaining > 1 ? "days" : "day"}`;
  }
}

function getContainerByStatus(status) {
  switch (status) {
    case "toDo":
      return document.getElementById("toDo");
    case "doing":
      return document.getElementById("doing");
    case "done":
      return document.getElementById("done");
    default:
      return null;
  }
}

const submitButton = document.getElementById("taskSubmit");
submitButton.addEventListener("click", createTask);

function displayTasks() {
  let storedTasks = JSON.parse(localStorage.getItem("project-planner-tasks"));

  storedTasks.forEach((task, index) => {
    const remainingTime = calculateRemainingTime(task.dueDate);

    const taskElement = document.createElement("article");
    taskElement.innerHTML = `
      <div class="task-header"><h3>${task.name}</h3>
      <button class="deleteTaskBtn">Delete</button></div>
              <p>${task.description}</p>
              <select class="taskSelect">
                <option value="toDo" ${
                  task.status === "toDo" ? "selected" : ""
                }>To do</option>
                <option value="doing" ${
                  task.status === "doing" ? "selected" : ""
                }>Doing</option>
                <option value="done" ${
                  task.status === "done" ? "selected" : ""
                }>Done</option>
              </select>
              <h4>${formatDate(task.dueDate, "fr-FR")} (${remainingTime})</h4>
          `;

    const container = getContainerByStatus(task.status);
    container.appendChild(taskElement);

    taskElement.querySelector("select").addEventListener("change", function () {
      const newStatus = this.value;
      // Modifie le conteneur de la tâche
      const newContainer = getContainerByStatus(newStatus);
      newContainer.appendChild(taskElement);
      storedTasks[index].status = newStatus;
      localStorage.setItem(
        "project-planner-tasks",
        JSON.stringify(storedTasks)
      );
    });

    taskElement
      .querySelector(".deleteTaskBtn")
      .addEventListener("click", function () {
        // Supprime l'élément de l'interface utilisateur
        taskElement.remove();
        // Supprime la tâche du localStorage
        storedTasks = storedTasks.filter((t) => t.name !== task.name);
        localStorage.setItem(
          "project-planner-tasks",
          JSON.stringify(storedTasks)
        );
      });
  });
}

function sortTasksByDueDate() {
  const statuses = ["toDo", "doing", "done"];

  statuses.forEach((status) => {
    const container = getContainerByStatus(status);
    const tasks = Array.from(container.querySelectorAll("article"));

    tasks.sort((taskElement1, taskElement2) => {
      const dueDateText1 = taskElement1.querySelector("h4");
      const dueDateText2 = taskElement2.querySelector("h4");

      if (dueDateText1 && dueDateText2) {
        const dueDate1 = new Date(dueDateText1.textContent);
        const dueDate2 = new Date(dueDateText2.textContent);
        return dueDate1 - dueDate2;
      } else if (!dueDateText1 && dueDateText2) {
        // Si seulement la première tâche n'a pas de date, la placer après
        return 1;
      } else if (dueDateText1 && !dueDateText2) {
        // Si seulement la deuxième tâche n'a pas de date, la placer avant
        return -1;
      } else {
        return 0; // Si aucune des tâches n'a de date, conserver l'ordre actuel
      }
    });

    // Réinsérer les tâches triées dans la section
    tasks.forEach((taskElement) => {
      container.appendChild(taskElement);
    });
  });
}

function formatDate(dateString, locale) {
  return new Date(dateString).toLocaleDateString(locale);
}

displayTasks();
