document.addEventListener("DOMContentLoaded", () => {
  const todoInput = document.getElementById("todo-input");
  const addBtn = document.getElementById("add-btn");
  const todoList = document.getElementById("todo-list");
  const hoursInput = document.getElementById("hours-input");
  const minutesInput = document.getElementById("minutes-input");
  const secondsInput = document.getElementById("seconds-input");

  addBtn.addEventListener("click", () => {
    const task = todoInput.value.trim();
    const hours = parseInt(hoursInput.value) || 0;
    const minutes = parseInt(minutesInput.value) || 0;
    const seconds = parseInt(secondsInput.value) || 0;

    if (!task) {
      alert("Please enter a task!");
      return;
    }

    const totalSeconds = hours * 3600 + minutes * 60 + seconds;

    const li = document.createElement("li");
    const span = document.createElement("span");
    span.textContent = task;

    const timer = document.createElement("span");
    timer.classList.add("timer");
    timer.textContent = formatTime(totalSeconds);

    const actions = document.createElement("div");
    actions.classList.add("actions");

    const completeBtn = document.createElement("button");
    completeBtn.textContent = "Complete";

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";

    // Edit button with pencil icon
    const editBtn = document.createElement("button");
    editBtn.innerHTML = "✏️"; // Pencil icon

    actions.appendChild(editBtn);
    actions.appendChild(completeBtn);
    actions.appendChild(deleteBtn);

    li.appendChild(span);
    li.appendChild(timer);
    li.appendChild(actions);

    todoList.appendChild(li);

    todoInput.value = "";
    hoursInput.value = "";
    minutesInput.value = "";
    secondsInput.value = "";

    let interval;
    let remainingSeconds = totalSeconds;

    const startTimer = () => {
      interval = setInterval(() => {
        if (remainingSeconds > 0) {
          remainingSeconds--;
          timer.textContent = formatTime(remainingSeconds);
        } else {
          clearInterval(interval);
          timer.textContent = "00:00:00";
        }
      }, 1000);
    };

    const completeTask = () => {
      li.classList.add("completed");
      completeBtn.textContent = "Resume";
      clearInterval(interval);
    };

    completeBtn.addEventListener("click", () => {
      if (completeBtn.textContent === "Complete") {
        completeTask();
      } else {
        li.classList.remove("completed");
        if (remainingSeconds === 0) {
          remainingSeconds = 1; // Allow restarting the timer from 1 second
        }
        startTimer(); // Resume the timer
        completeBtn.textContent = "Complete";
      }
    });

    deleteBtn.addEventListener("click", () => {
      clearInterval(interval);
      li.remove();
    });

    // Edit task functionality
    editBtn.addEventListener("click", () => {
      const newTask = prompt("Edit your task:", task);
      if (newTask) {
        span.textContent = newTask;
      }
    });

    if (totalSeconds > 0) {
      startTimer();
    }
  });

  const formatTime = (totalSeconds) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };
});



document.addEventListener("DOMContentLoaded", () => {
  const calendar = document.getElementById("calendar");
  const todoSection = document.getElementById("todo-section");
  const dateHeader = document.getElementById("date-header");
  const selectedDateElement = document.getElementById("selected-date");
  const todoInput = document.getElementById("todo-input");
  const addBtn = document.getElementById("add-btn");
  const todoList = document.getElementById("todo-list");

  let selectedDate = null;

  // Generate the calendar for the current month
  const generateCalendar = () => {
    const date = new Date();
    const currentMonth = date.getMonth();
    const currentYear = date.getFullYear();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
    const totalDays = lastDayOfMonth.getDate();

    calendar.innerHTML = "";

    // Generate days of the month
    for (let i = 1; i <= totalDays; i++) {
      const dayElement = document.createElement("div");
      dayElement.textContent = i;
      dayElement.addEventListener("click", () => showTodoForDate(i));
      calendar.appendChild(dayElement);
    }
  };

  const showTodoForDate = (day) => {
    selectedDate = new Date();
    selectedDate.setDate(day);
    selectedDate.setMonth(new Date().getMonth());

    selectedDateElement.textContent = selectedDate.toDateString();
    dateHeader.textContent = `Tasks for ${selectedDate.toDateString()}`;
    todoSection.style.display = "block";
    loadTasksForSelectedDate();
  };

  // Add a task for the selected date
  addBtn.addEventListener("click", () => {
    const task = todoInput.value.trim();
    if (!task) return;

    let tasks = JSON.parse(localStorage.getItem("tasks")) || {};
    const dateKey = selectedDate.toDateString();

    if (!tasks[dateKey]) {
      tasks[dateKey] = [];
    }

    tasks[dateKey].push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));

    todoInput.value = "";
    loadTasksForSelectedDate();
  });

  const loadTasksForSelectedDate = () => {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || {};
    const dateKey = selectedDate.toDateString();
    const taskListForDate = tasks[dateKey] || [];

    todoList.innerHTML = "";
    taskListForDate.forEach(task => {
      const li = document.createElement("li");
      li.textContent = task;
      todoList.appendChild(li);
    });
  };

  generateCalendar();
});
