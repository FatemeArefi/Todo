const taskInput = document.getElementById("task-input");
const dateInput = document.getElementById("date-input");
const addButton = document.getElementById("add-button");
const editebutton = document.getElementById("edite-button");
const alertMessage = document.getElementById("alert-message");
const todosBody = document.querySelector("tbody");
const deleteAllButton = document.getElementById("delete-all-button");
const filterButton = document.querySelectorAll(".filter-todos");
let todos = JSON.parse(localStorage.getItem("todos")) || [];

const generateId = () => {
  const id = Math.round(
    Math.random() * Math.random() * Math.pow(10, 15)
  ).toString();
  return id;
};

const showAlert = (message, type) => {
  alertMessage.innerHTML = "";
  const alert = document.createElement("p");
  alert.innerText = message;
  alert.classList.add("alert");
  alert.classList.add(`alert-${type}`);
  alertMessage.append(alert);

  setTimeout(() => {
    alert.style.display = "none";
  }, 2000);
};
const displayTodos = (data) => {
  const todoList = data || todos;
  todosBody.innerHTML = "";
  if (!todoList.length) {
    todosBody.innerHTML = "<tr><td colspan='4'>No task Found!</td></tr>";
    return;
  }

  todoList.forEach((todo) => {
    todosBody.innerHTML =
      todosBody.innerHTML +
      `
    <tr>
    <td>${todo.task}</td>
    <td>${todo.date || "No date!"}</td>
    <td>${todo.compelted || "Pending"}</td>
    <td>
    <button onclick="editeHandler('${todo.id}')">Edite</button>
    <button onclick = "toggleHandler('${todo.id}')">${
        todo.compelted ? "Undo" : "Do"
      }</button>
    <button onclick ="deleteHandler('${todo.id}')">Delete</button>
    </td>
    </tr>
    `;
  });
};

const saveToLocalStorage = () => {
  localStorage.setItem("todos", JSON.stringify(todos));
};

const addHandler = () => {
  const task = taskInput.value;
  const date = dateInput.value;
  const todo = {
    id: generateId(),
    completed: false,
    task: task,
    date: date,
  };

  if (task) {
    todos.push(todo);
    saveToLocalStorage();
    displayTodos();
    taskInput.value = "";
    dateInput.value = "";
    showAlert("Todo added successfully", "success");
  } else {
    showAlert("Please enter a todo!", "error");
  }
};
const deleteAllHandler = () => {
  if (todos.length) {
    todos = [];
    saveToLocalStorage();
    displayTodos();
    showAlert("All todos cleared successfully", "success");
  } else {
    showAlert("Todos not cleared", "error");
  }
};
const deleteHandler = (id) => {
  const newTodos = todos.filter((todo) => todo.id !== id);
  todos = newTodos;
  displayTodos();
  saveToLocalStorage();
  showAlert("Todo deleted successfully");
};
const toggleHandler = (id) => {
  //   const newTodos = todos.map((todo) => {
  //     if (todo.id === id) {
  //       return {
  //         id: todo.id,
  //         task: todo.task,
  //         date: todo.date,
  //         completed: !todo.completed,
  //       };
  //     } else {
  //       return todo;
  //     }
  //   });
  //   todos = newTodos;
  const todo = todos.find((todo) => todo.id === id);
  todo.compelted = !todo.compelted;
  saveToLocalStorage();
  displayTodos();
  showAlert("Todo statuse changed successfully", "success");
};
const editeHandler = (id) => {
  const todo = todos.find((todo) => todo.id === id);
  taskInput.value = todo.task;
  dateInput.value = todo.date;
  addButton.style.display = "none";
  editebutton.style.display = "inline-block";
  editebutton.dataset.id = id;
};
const applyEditHandler = (event) => {
  const id = event.target.dataset.id;
  const todo = todos.find((todo) => todo.id === id);
  todo.task = taskInput.value;
  todo.date = dateInput.value;
  taskInput.value = "";
  dateInput.value = "";
  addButton.style.display = "inline-block";
  editebutton.style.display = "none";
  saveToLocalStorage();
  displayTodos();
  showAlert("Todo edited successfully", "success");
};
const filter = (event) => {
  let filterTodos = null;
  const filter = event.target.dataset.filter;
  switch (filter) {
    case "pending":
      filterTodos = todos.filter((todo) => todo.compelted === false);
      break;
    default:
      filterTodos = todos;
      break;
  }
  displayTodos(filterTodos);
};
window.addEventListener("load", () => displayTodos());
addButton.addEventListener("click", addHandler);
deleteAllButton.addEventListener("click", deleteAllHandler);
editebutton.addEventListener("click", applyEditHandler);
filterButton.forEach((button) => {
  button.addEventListener("click", filterHandler);
});
