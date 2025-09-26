document.addEventListener("DOMContentLoaded", () => {
    const todoInput = document.getElementById("todo-input");
    const addBtn = document.getElementById("add-btn");
    const todoList = document.getElementById("todo-list");
    const clockElement = document.getElementById("clock");
    const themeButtons = document.querySelectorAll(".theme-btn");
    const [hoursInput, minutesInput, secondsInput] = [
        document.getElementById("hours-input"),
        document.getElementById("minutes-input"),
        document.getElementById("seconds-input"),
    ];

    const formatTime = (seconds) => {
        if (isNaN(seconds) || seconds <= 0) return "00:00:00";
        const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
        const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
        const s = String(seconds % 60).padStart(2, "0");
        return `${h}:${m}:${s}`;
    };

    const updateClock = () => {
        const now = new Date();
        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const dateString = now.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        clockElement.textContent = `${dateString} | ${timeString}`;
    };

    const applyTheme = (themeName) => {
        document.body.className = `theme-${themeName}`;
        localStorage.setItem("todo-theme", themeName);

        themeButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.theme === themeName));
    };

    themeButtons.forEach(btn => {
        btn.addEventListener("click", () => applyTheme(btn.dataset.theme));
    });

    const loadTheme = () => {
        const savedTheme = localStorage.getItem("todo-theme") || "default";
        applyTheme(savedTheme);
    };

    
    
    const loadTasks = () => {
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks.forEach(task => addTaskToDOM(task));
    };

    const saveTasks = () => {
        const tasks = Array.from(todoList.children).map(li => ({
            text: li.querySelector(".task-text").textContent,
            remainingSeconds: parseInt(li.dataset.remainingSeconds, 10),
            isCompleted: li.classList.contains("completed"),
        }));
        localStorage.setItem("tasks", JSON.stringify(tasks));
    };
    
    const addTaskToDOM = ({ text, remainingSeconds, isCompleted }) => {
        const li = document.createElement("li");
        li.dataset.remainingSeconds = remainingSeconds;

        const taskText = document.createElement("span");
        taskText.className = "task-text";
        taskText.textContent = text;

        const timer = document.createElement("span");
        timer.className = "timer";
        timer.textContent = formatTime(remainingSeconds);

        const actions = document.createElement("div");
        actions.className = "actions";
        
        const completeBtn = document.createElement("button");
        completeBtn.innerHTML = "✓";
        completeBtn.title = "Complete";

        const editBtn = document.createElement("button");
        editBtn.innerHTML = "✏️";
        editBtn.title = "Edit";

        const deleteBtn = document.createElement("button");
        deleteBtn.innerHTML = "🗑️";
        deleteBtn.title = "Delete";
        
        actions.append(completeBtn, editBtn, deleteBtn);
        li.append(taskText, timer, actions);
        todoList.appendChild(li);

        if (isCompleted) {
            li.classList.add("completed");
        } else if (remainingSeconds > 0) {
            startTimer(li, timer);
        }

        setupTaskActions(li, timer, completeBtn, editBtn, deleteBtn);
    };

    const addTask = () => {
        const taskText = todoInput.value.trim();
        if (!taskText) return;

        const totalSeconds = (parseInt(hoursInput.value) || 0) * 3600 +
                             (parseInt(minutesInput.value) || 0) * 60 +
                             (parseInt(secondsInput.value) || 0);

        addTaskToDOM({ text: taskText, remainingSeconds: totalSeconds, isCompleted: false });
        saveTasks();
        
        todoInput.value = "";
        hoursInput.value = "";
        minutesInput.value = "";
        secondsInput.value = "";
    };

    const startTimer = (li, timerElement) => {
        let remainingSeconds = parseInt(li.dataset.remainingSeconds, 10);
        const intervalId = setInterval(() => {
            if (remainingSeconds > 0 && !li.classList.contains("completed")) {
                remainingSeconds--;
                li.dataset.remainingSeconds = remainingSeconds;
                timerElement.textContent = formatTime(remainingSeconds);
                // Save less frequently to improve performance
                if (remainingSeconds % 5 === 0) saveTasks();
            } else {
                clearInterval(intervalId);
                if (remainingSeconds === 0) timerElement.textContent = "Time's up!";
            }
        }, 1000);
        li.dataset.intervalId = intervalId;
    };

    const setupTaskActions = (li, timer, completeBtn, editBtn, deleteBtn) => {
        completeBtn.addEventListener("click", () => {
            li.classList.toggle("completed");
            saveTasks();
        });

        deleteBtn.addEventListener("click", () => {
            clearInterval(parseInt(li.dataset.intervalId, 10));
            li.remove();
            saveTasks();
        });
        
        editBtn.addEventListener("click", () => {
             const currentText = li.querySelector(".task-text").textContent;
             const newText = prompt("Edit your task:", currentText);
             if (newText && newText.trim() !== "") {
                 li.querySelector(".task-text").textContent = newText.trim();
                 saveTasks();
             }
        });
    };

    // --- Initial Setup ---
    addBtn.addEventListener("click", addTask);
    todoInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") addTask();
    });
    
    loadTheme();
    loadTasks();
    updateClock();
    setInterval(updateClock, 1000 * 30); // Update clock every 30 seconds
});