const STORAGE_KEY = "taskflow-tasks";

function isValidTask(task) {
  if (task === null || typeof task !== "object") {
    return false;
  }

  return (
    typeof task.id === "string" &&
    task.id.trim() !== "" &&
    typeof task.text === "string" &&
    task.text.trim().length >= 2 &&
    task.text.length <= 100 &&
    typeof task.completed === "boolean"
  );
}

function areValidTasks(tasks) {
  if (!Array.isArray(tasks)) {
    return false;
  }

  const allTasksValid = tasks.every((task) => {
    return isValidTask(task);
  });

  if (!allTasksValid) {
    return false;
  }

  const taskIds = tasks.map((task) => task.id);
  const uniqueIds = new Set(taskIds);

  return uniqueIds.size === taskIds.length;
}

export function loadTasks(defaultTasks) {
  try {
    const savedTasks = localStorage.getItem(STORAGE_KEY);

    if (savedTasks === null) {
      return defaultTasks.map((task) => ({ ...task }));
    }

    const parsedTasks = JSON.parse(savedTasks);

    if (!areValidTasks(parsedTasks)) {
      throw new Error("Saved task data is invalid.");
    }

    return parsedTasks;
  } catch (error) {
    console.error("Failed to load tasks:", error);
    return defaultTasks.map((task) => ({ ...task }));
  }
}

export function saveTasks(tasks) {
  // // TEMPORARY: Simulate storage failure for testing purposes
  // return false;
  try {
    if (!areValidTasks(tasks)) {
      throw new Error("Cannot save invalid task data.");
    }

    const tasksJSON = JSON.stringify(tasks);

    localStorage.setItem(STORAGE_KEY, tasksJSON);

    return true;
  } catch (error) {
    console.error("Failed to save tasks:", error);
    return false;
  }
}
