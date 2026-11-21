export function createTaskElement(task, onToggle, onDelete) {
  // Create the task container
  const taskElement = document.createElement("li");
  taskElement.classList.add("task");

  // Create the checkbox
  const checkbox = document.createElement("input");
  checkbox.classList.add("task__checkbox");
  checkbox.type = "checkbox";
  checkbox.id = `checkbox-${task.id}`;
  checkbox.checked = task.completed;

  checkbox.addEventListener("change", () => {
    onToggle(task.id, checkbox.checked);
  });

  // Create the label
  const label = document.createElement("label");
  label.classList.add("task__label");
  label.htmlFor = checkbox.id;
  label.textContent = task.text;

  // Create the delete button
  const deleteButton = document.createElement("button");
  deleteButton.classList.add("task__delete-button");
  deleteButton.type = "button";
  deleteButton.textContent = "Delete";
  deleteButton.setAttribute("aria-label", `Delete task: ${task.text}`);

  deleteButton.addEventListener("click", () => {
    onDelete(task.id, taskElement);
  });

  // Assemble the task
  taskElement.append(checkbox, label, deleteButton);

  // Return the completed element
  return taskElement;
}
