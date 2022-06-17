//================================================================================================
//==============================          Main Vars          =====================================
//================================================================================================

// Get Elements
let input = document.querySelector(".input");
let buttons = document.querySelector(".buttons");
let tasksDiv = document.querySelector(".tasks");
let tasksArray = [];

if (localStorage.getItem("tasks")) {
  tasksArray = JSON.parse(localStorage.getItem("tasks"));
}



//================================================================================================
//==============================            Events           =====================================
//================================================================================================

// Get Data From Local Storage And Add The To Tasks Div
(() => { // ========> self invoke function
  let data = window.localStorage.getItem("tasks");
  if (data) {
    let tasks = JSON.parse(data);
    addElements(tasks);
  }
})()

// On Click Tasks Div Element
tasksDiv.addEventListener("click", function (e) {
  // make sure That The Clicked Element is The Deleting Button
  if (e.target.classList.contains("delete")) {
    // Remove Task From Local Storage
    deleteElementById(e.target.parentElement.parentElement.getAttribute("data-id"));
    // Remove Div.task Element
    e.target.parentElement.parentElement.remove();
  }
  // make sure That The Clicked Element is The Task
  if (e.target.classList.contains("task")) {
    // Toggle Task's Status Value And (done) class
    toggleTaskStatus(e.target.getAttribute("data-id"));
    e.target.classList.toggle("done");
  }
})

// Add Task And removing All Tasks
buttons.addEventListener("click", (e) => {
  if (e.target.classList.contains("remove-all")) {
    tasksDiv.innerHTML = '';
    tasksArray = [];
    updateLocalStorage(tasksArray);
  }
  if (e.target.classList.contains("add")) {
    if (input.value !== "") {
      addTask(input.value);
      input.value = '';
    }
  }
})
// Add Task Only
input.addEventListener("keypress",  (e) => {
  if (e.key === "Enter") {
    if (input.value !== "") {
      addTask(input.value);
      input.value = '';
    }
  }
})

//================================================================================================
//==============================          Functions          =====================================
//================================================================================================

// Create Task
function addTask (txt) {
  let newDate = new Date();
  // Add Task Initial Data
  let task = {
    id: Date.now(),
    taskText: txt,
    status: false,
    date: {
      year: newDate.getFullYear(),
      month: newDate.getMonth() + 1,
      day: newDate.getDate(),
      hour: newDate.getHours() > 12 ? newDate.getHours() - 12 : newDate.getHours(),
      minutes: newDate.getMinutes() < 10 ? `0${newDate.getMinutes()}` : `${newDate.getMinutes()}`
    }
  }
  // Push Task To Tasks Array
  tasksArray.push(task);
  // Add Tasks Elements To The Page
  addElements(tasksArray);
  // Add Tasks To Local Storage
  updateLocalStorage(tasksArray);
}

// create Div And Delete Span And Add Them To Tasks Div
function addElements (tasksArray) {
  tasksDiv.innerHTML = '';
  tasksArray.forEach(task => {
    // Create Div And It's Content And Append It And It's Attrs
    let div = typeContentClass("div", task.taskText, "task");
    div.setAttribute("data-id", task.id);
    if (task.status) div.classList.add("done");
    // Create Spans Container Add It's Classes
    let spansContainer = typeContentClass("div", undefined, "span-container");
    // Create Date Span And It's Content
    let dateSpan = typeContentClass("span",
    `${task.date.hour < 10 ? `0${task.date.hour}` : task.date.hour}:${task.date.minutes}
    ${task.date.hour < 12 ? `PM` : `AM`}
    ${task.date.day} /
    ${task.date.month} /
    ${task.date.year}`
    ,"");
    // Create Delete Task Span And It'd Content And Add It's Classes
    let DeleteSpan = typeContentClass("span", "Delete", "delete");
    // Append date Span And Delete Task To Spans Container
    spansContainer.append(dateSpan, DeleteSpan)
    // Append Spans Container To the Task Div
    div.append(spansContainer);
    // Append Task To Tasks Div
    tasksDiv.append(div);
  });
}

// Remove Task From Local Storage
function deleteElementById (taskId) {
  tasksArray = tasksArray.filter(task => task.id != taskId);
  updateLocalStorage(tasksArray);
}

// Update Local Storage Data
function updateLocalStorage (tasksArray) {
  window.localStorage.setItem("tasks", JSON.stringify(tasksArray))
}

// Toggle Status Of Completion In The Task
function toggleTaskStatus (taskId) {
  tasksArray.forEach(task => {
    if (task.id == taskId) {
      task.status === false ? task.status = true : task.status = false;
    }
  });
  updateLocalStorage(tasksArray);
}

// Custom Func To Create An Element And It's Classes And Text
function typeContentClass (eleType, text = "", ...Classes) {
  if (eleType === "" || eleType === undefined) eleType = "div";
  let ele = document.createElement(eleType.toLowerCase());
  let eleValue = document.createTextNode(text);
  Classes.forEach(e => {
    e === undefined || e === "" ? ele.className = e : ele.classList.add(e);
  });
  ele.append(eleValue);
  return ele;
}