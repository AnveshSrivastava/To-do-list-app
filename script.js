document.addEventListener("DOMContentLoaded", () => {
  const todoInput = document.getElementById("todo-input");
  const addBtn = document.getElementById("add-btn");
  const todoList = document.getElementById("todo-list");
  const [hoursInput, minutesInput, secondsInput] = [
    document.getElementById("hours-input"),
    document.getElementById("minutes-input"),
    document.getElementById("seconds-input"),
  ];

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600).toString().padStart(2, "0");
    const mins = Math.floor((seconds % 3600) / 60).toString().padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${hrs}:${mins}:${secs}`;
  };

  const resetInputs = () => {
    todoInput.value = "";
    hoursInput.value = "";
    minutesInput.value = "";
    secondsInput.value = "";
  };

  const createElement = (tag, textContent = "", className = "") => {
    const element = document.createElement(tag);
    if (textContent) element.textContent = textContent;
    if (className) element.classList.add(className);
    return element;
  };

  const loadTasks = () => {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach((task) => addTaskToDOM(task));
  };

  const saveTasks = () => {
    const tasks = [];
    todoList.querySelectorAll("li").forEach((li) => {
      const task = {
        text: li.querySelector("span").textContent,
        remainingSeconds: parseInt(li.dataset.remainingSeconds),
        isCompleted: li.classList.contains("completed"),
      };
      tasks.push(task);
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
  };

  const addTaskToDOM = ({ text, remainingSeconds, isCompleted }) => {
    const li = createElement("li");
    li.dataset.remainingSeconds = remainingSeconds;

    const span = createElement("span", text);
    const timer = createElement("span", formatTime(remainingSeconds), "timer");

    const editBtn = createElement("button", "✏️");
    const completeBtn = createElement("button", isCompleted ? "Resume" : "Complete");
    const deleteBtn = createElement("button", "Delete");

    const actions = createElement("div", "", "actions");
    actions.append(editBtn, completeBtn, deleteBtn);
    li.append(span, timer, actions);
    todoList.appendChild(li);

    if (isCompleted) {
      li.classList.add("completed");
    } else if (remainingSeconds > 0) {
      startTimer(li, timer);
    }

    bindTaskActions(li, timer, editBtn, completeBtn, deleteBtn);
  };

  const addTask = () => {
    const task = todoInput.value.trim();
    const hours = parseInt(hoursInput.value) || 0;
    const minutes = parseInt(minutesInput.value) || 0;
    const seconds = parseInt(secondsInput.value) || 0;
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;

    if (!task) return alert("Please enter a task!");

    const newTask = { text: task, remainingSeconds: totalSeconds, isCompleted: false };
    addTaskToDOM(newTask);
    saveTasks();
    resetInputs();
  };

  const startTimer = (li, timer) => {
    let remainingSeconds = parseInt(li.dataset.remainingSeconds);
    const interval = setInterval(() => {
      if (remainingSeconds > 0) {
        remainingSeconds--;
        li.dataset.remainingSeconds = remainingSeconds;
        timer.textContent = formatTime(remainingSeconds);
        saveTasks();
      } else {
        clearInterval(interval);
        timer.textContent = "00:00:00";
      }
    }, 1000);

    li.dataset.intervalId = interval;
  };

  const bindTaskActions = (li, timer, editBtn, completeBtn, deleteBtn) => {
    const toggleCompletion = () => {
      const isCompleted = li.classList.toggle("completed");
      completeBtn.textContent = isCompleted ? "Resume" : "Complete";
      clearInterval(parseInt(li.dataset.intervalId));
      if (!isCompleted && parseInt(li.dataset.remainingSeconds) > 0) {
        startTimer(li, timer);
      }
      saveTasks();
    };

    const deleteTask = () => {
      clearInterval(parseInt(li.dataset.intervalId));
      li.remove();
      saveTasks();
    };

    const editTask = () => {
      const newTask = prompt("Edit your task:", li.querySelector("span").textContent);
      if (newTask) {
        li.querySelector("span").textContent = newTask;
        saveTasks();
      }
    };

    completeBtn.addEventListener("click", toggleCompletion);
    deleteBtn.addEventListener("click", deleteTask);
    editBtn.addEventListener("click", editTask);
  };

  addBtn.addEventListener("click", addTask);
  loadTasks();
});


