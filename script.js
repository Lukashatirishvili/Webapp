// ******** Selecting Elements ********
const todoApp = document.querySelector(".todo-app");
const input = document.querySelector(".input");
const taskSection_el = document.querySelector(".task-section");
const filterSection_el = document.querySelector(".filter-section");
console.log(filterSection_el);
const allBtn = document.querySelector(".all-btn");
const activeBtn = document.querySelector(".active-btn");
const completedBtn = document.querySelector(".completed-btn");

// ******** Event Listeners ********
input.addEventListener("keydown", createTask);
taskSection_el.addEventListener("mouseover", displayDeletebtn);
taskSection_el.addEventListener("mouseout", displayDeletebtn);
document.addEventListener("click", (e) => {
  checkDelete_logic(e);
  filterSection_logic(e);
});
todoApp.addEventListener("dblclick", updateTask);

// ******** Functions ********
getFromLocalStorage();

function createTask(e) {
  if (e.keyCode === 13 && input.value) {
    const task_el = document.createElement("div");
    task_el.classList.add("task", "active");
    task_el.innerHTML = `<button class="check unclicked">
    <i class="fa-regular fa-circle-check fa-2xl"></i>
  </button>
  <input type="text" class="task-field" readonly />
  <button class="delete">
    <i class="fa-solid fa-xmark fa-lg"></i>
  </button>`;
    taskSection_el.appendChild(task_el);

    const taskField_el = task_el.children[1];
    const checkBtn = task_el.children[0];
    taskField_el.placeholder = input.value;

    if (completedBtn.matches(".clicked")) {
      task_el.style.display = "none";
    }

    input.value = "";

    saveToLocalStorage();
    displayItem();
  }
}

function updateTask(e) {
  const target = e.target;
  const task = target.parentElement;
  if (target.matches(".task-field")) {
    target.removeAttribute("readonly");
    let temp = target.placeholder;
    target.placeholder = "";
    target.value = temp;

    target.addEventListener("keydown", (e) => {
      if (e.keyCode === 13) {
        if (!target.value) {
          target.parentElement.remove();
          displayItem();
        }
        target.setAttribute("readonly", "readonly");
        target.placeholder = target.value;
        displayItem();
      }
      saveToLocalStorage();
    });

    document.addEventListener("click", (e) => {
      if (!e.target.matches(".task-field")) {
        target.setAttribute("readonly", "readonly");
        if (!target.value) {
          target.parentElement.remove();
          displayItem();
        }
        target.placeholder = target.value;
        displayItem();
      }
      saveToLocalStorage();
    });
  }
}

function filterSection_logic(e) {
  const task_el = document.querySelectorAll(".task");
  const target = e.target;
  if (target.matches(".all-btn")) {
    task_el.forEach((task) => {
      task.style.display = "flex";
    });
    allBtn.classList.add("clicked");
    activeBtn.classList.remove("clicked");
    completedBtn.classList.remove("clicked");
  }

  if (target.matches(".active-btn")) {
    task_el.forEach((task) => {
      if (task.matches(".task.active")) {
        task.style.display = "flex";
      } else {
        task.style.display = "none";
      }
      allBtn.classList.remove("clicked");
      activeBtn.classList.add("clicked");
      completedBtn.classList.remove("clicked");
    });
  }

  if (target.matches(".completed-btn")) {
    task_el.forEach((task) => {
      if (task.matches(".task.completed")) {
        task.style.display = "flex";
      } else {
        task.style.display = "none";
      }
      allBtn.classList.remove("clicked");
      activeBtn.classList.remove("clicked");
      completedBtn.classList.add("clicked");
    });
  }
}

function checkDelete_logic(e) {
  const target = e.target;
  const task_el = document.querySelectorAll(".task");
  const taskCompleted_el = document.querySelectorAll(".task.completed");

  const checkallBtn = document.querySelector(".checkall-btn");
  let task = target.parentElement;

  // check task
  if (target.classList.contains("check")) {
    task.classList.toggle("completed");
    task.classList.toggle("active");
    if (completedBtn.matches(".clicked")) {
      task.style.display = "none";
    }
    if (activeBtn.matches(".clicked")) {
      task.style.display = "none";
    }
  }

  // delete task
  if (target.classList.contains("delete")) {
    task.remove();
  }

  if (target.classList.contains("clear-task")) {
    taskCompleted_el.forEach((task) => {
      task.remove();
    });
  }
  if (target.matches(".checkall-btn.unclicked")) {
    // check all btn
    task_el.forEach((task) => {
      task.classList.remove("active");
      task.classList.add("completed");
      checkallBtn.style.color = "#797777";
      checkallBtn.classList.remove("unclicked");
      checkallBtn.classList.add("clicked");
      if (completedBtn.matches(".clicked")) {
        task.style.display = "none";
      }
      if (activeBtn.matches(".clicked")) {
        task.style.display = "none";
      }
    });
  } else if (target.matches(".checkall-btn.clicked")) {
    task_el.forEach((task) => {
      task.classList.remove("completed");
      task.classList.add("active");
      checkallBtn.style.color = "#e6e6e6";
      checkallBtn.classList.remove("clicked");
      checkallBtn.classList.add("unclicked");
      if (completedBtn.matches(".clicked")) {
        task.style.display = "none";
      }
      if (activeBtn.matches(".clicked")) {
        task.style.display = "none";
      }
    });
  }

  displayItem();
  saveToLocalStorage();
}

function displayDeletebtn(e) {
  const target = e.target;
  switch (e.type) {
    case "mouseover":
      if (target.classList.contains("task") || target.closest(".task")) {
        const deleteBtn = target.closest(".task").children[2];
        deleteBtn.style.visibility = "visible";
        saveToLocalStorage();
      }
      break;
    case "mouseout":
      if (target.classList.contains("task") || target.closest(".task")) {
        const deleteBtn = target.closest(".task").children[2];
        deleteBtn.style.visibility = "hidden";
        saveToLocalStorage();
      }
      break;
  }
}

function displayItem() {
  const task_el = document.querySelectorAll(".task");
  const taskCompleted_el = document.querySelectorAll(".task.completed");
  const taskActive_el = document.querySelectorAll(".task.active");
  const filterSection_el = document.querySelector(".filter-section");
  const clearbtn = document.querySelector(".clear-task");
  const itemCounter_el = document.querySelector(".items-left");
  const checkallBtn = document.querySelector(".checkall-btn");

  // Display Clear Button
  if (taskCompleted_el.length > 0) {
    clearbtn.classList.remove("hidden");
  } else {
    clearbtn.classList.add("hidden");
  }

  // Display Filter Section
  if (task_el.length > 0) {
    filterSection_el.classList.remove("hidden");
  } else {
    filterSection_el.classList.add("hidden");
  }

  // Display Item Counter
  const taskLength = task_el.length - taskCompleted_el.length;
  itemCounter_el.innerHTML = `${taskLength} items left`;

  // Display CheckAll Button
  if (taskActive_el.length == 0 && taskCompleted_el.length > 0) {
    checkallBtn.style.color = "#797777";
    checkallBtn.classList.remove("unclicked");
    checkallBtn.classList.add("clicked");
  } else if (taskActive_el.length > 0 || task_el.length == 0) {
    checkallBtn.style.color = "#e6e6e6";
    checkallBtn.classList.remove("clicked");
    checkallBtn.classList.add("unclicked");
  }

  //
  // task_el.forEach((task) => {
  //   task.style.display = "flex";
  // });
}

function saveToLocalStorage() {
  localStorage.setItem("taskSection", taskSection_el.innerHTML);
}

function getFromLocalStorage() {
  taskSection_el.innerHTML = localStorage.getItem("taskSection");
  displayItem();
  taskAfterReload();
}

function taskAfterReload() {
  const task_el = document.querySelectorAll(".task");
  task_el.forEach((task) => {
    task.style.display = "flex";
  });
}
