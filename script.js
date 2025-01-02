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
