import { loadTasks, saveTasks } from "./storage.js";
import { createTaskElement } from "./task.js";

const taskForm = document.querySelector("#task-form");
const taskInput = document.querySelector("#task-input");
const taskList = document.querySelector(".todo__list");
const emptyMessage = document.querySelector(".todo__empty");
const taskInputError = document.querySelector(".task-form__error");
const storageWarning = document.querySelector(".todo__storage-warning");

const defaultTasks = [
  {
    id: "task-1",
    text: "Review JavaScript fundamentals",
    completed: true,
  },
  {
    id: "task-2",
    text: "Practice BEM methodology",
    completed: true,
  },
  {
    id: "task-3",
    text: "Build my to-do application",
    completed: false,
  },
];

const tasks = loadTasks(defaultTasks);

function showTaskInputError(message) {
  taskInputError.textContent = message;
  taskInputError.hidden = false;
  taskInput.setAttribute("aria-invalid", "true");
}

function clearTaskInputError() {
  taskInputError.textContent = "";
  taskInputError.hidden = true;
  taskInput.removeAttribute("aria-invalid");
}

// function renderTask(task) {
//   // Create the task container
//   const taskElement = document.createElement("li");
//   taskElement.classList.add("task");

//   // Create the checkbox
//   const checkbox = document.createElement("input");
//   checkbox.classList.add("task__checkbox");
//   checkbox.type = "checkbox";
//   checkbox.id = `checkbox-${task.id}`;
//   checkbox.checked = task.completed;

//   checkbox.addEventListener("change", () => {
//     task.completed = checkbox.checked;

//     saveTasks(tasks);
//     updateTaskUI();
//   });

//   // Create the label
//   const label = document.createElement("label");
//   label.classList.add("task__label");
//   label.htmlFor = checkbox.id;
//   label.textContent = task.text;

//   // Create the delete button
//   const deleteButton = document.createElement("button");
//   deleteButton.classList.add("task__delete-button");
//   deleteButton.type = "button";
//   deleteButton.textContent = "Delete";
//   deleteButton.setAttribute("aria-label", `Delete task: ${task.text}`);

//   deleteButton.addEventListener("click", () => {
//     deleteTask(task.id, taskElement);
//   });

//   // Assemble the task element
//   taskElement.append(checkbox, label, deleteButton);

//   // Insert the task into the list
//   taskList.append(taskElement);
// }

// new renderTask() function

function renderTask(task) {
  const taskElement = createTaskElement(task, handleTaskToggle, deleteTask);

  taskList.prepend(taskElement);
}

function handleTaskToggle(taskId, isChecked) {
  const task = tasks.find((task) => {
    return task.id === taskId;
  });
  if (!task) {
    console.error("Task not found:", taskId);
    return;
  }
  task.completed = isChecked;
  saveTasksWithFeedback();
  updateTaskUI();
}

function handleTaskSubmit(event) {
  event.preventDefault();

  const taskText = taskInput.value.trim();

  if (taskText.length < 2) {
    showTaskInputError("Enter at least 2 characters for your task.");
    return;
  }

  if (taskText.length > 100) {
    showTaskInputError("Task cannot exceed 100 characters.");
    return;
  }

  clearTaskInputError();

  const newTask = {
    id: crypto.randomUUID(),
    text: taskText,
    completed: false,
  };

  tasks.push(newTask);
  // updateTaskSummary();
  saveTasksWithFeedback();
  renderTask(newTask);
  updateTaskUI();
  taskForm.reset();
}

function deleteTask(taskId, taskElement) {
  const taskIndex = tasks.findIndex((task) => {
    return task.id === taskId;
  });
  if (taskIndex === -1) {
    console.error("Task not found:", taskId);
    return;
  }

  tasks.splice(taskIndex, 1);
  saveTasksWithFeedback();
  taskElement.remove();
  // updateTaskSummary();
  updateTaskUI();
}

function updateTaskSummary() {
  const completedTasks = tasks.filter((task) => {
    return task.completed;
  });
  const completedCount = completedTasks.length;
  const totalCount = tasks.length;

  const summary = document.querySelector(".todo__summary");

  summary.textContent = `${completedCount} of ${totalCount} tasks completed`;
}

function updateEmptyState() {
  const isEmpty = tasks.length === 0;

  emptyMessage.hidden = !isEmpty;
}

function updateTaskUI() {
  updateTaskSummary();
  updateEmptyState();
}

function saveTasksWithFeedback() {
  const savedSuccessfully = saveTasks(tasks);

  storageWarning.hidden = savedSuccessfully;

  return savedSuccessfully;
}

tasks.forEach((task) => {
  renderTask(task);
});

updateTaskUI();

taskForm.addEventListener("submit", handleTaskSubmit);

taskInput.addEventListener("input", () => {
  if (taskInput.value.trim().length >= 2) {
    clearTaskInputError();
  }
});
