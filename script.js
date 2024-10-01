const itemForm = document.getElementById("item-form");
const itemInput = document.getElementById("item-input");
const itemList = document.getElementById("item-list");
const clearBtn = document.getElementById("clear");
const itemFilter = document.getElementById("filter");
const formBtn = itemForm.querySelector("button");
let isEditMode = false;
function displayItems() {
  const itemFromStorage = getItemsFromStorage();
  if (itemFromStorage) {
    itemFromStorage.forEach((item) => addItemToDOM(item));
  }

  checkUI();
}

const addItem = (e) => {
  e.preventDefault();
  const newItem = itemInput.value;
  if (newItem === "") {
    alert("Please add an Input");
    return;
  }

  if (isEditMode) {
    const itemToEdit = itemList.querySelector(".edit-mode");
    if (checkIfItemExists(newItem)) {
      alert("This Item Exists");
      itemToEdit.classList.remove("edit-mode");
      checkUI();
      return;
    } else {
      removeItemFromStorage(itemToEdit);
      itemToEdit.remove();
    }
    itemToEdit.classList.remove("edit-mode");
    isEditMode = false;
  } else {
    if (checkIfItemExists(newItem)) {
      alert("This Item Exists");
      return;
    }
  }
  // Add Item to DOM
  addItemToDOM(newItem);

  // Add Item to storage
  addItemToStorage(newItem);

  checkUI();
  itemInput.value = "";
};

function addItemToDOM(item) {
  const li = document.createElement("li");
  li.appendChild(document.createTextNode(item));

  const button = createButton("remove-item btn-link text-red");
  li.appendChild(button);

  itemList.appendChild(li);
}

function createButton(classes) {
  const button = document.createElement("button");
  button.className = classes;
  const icon = createIcon("fa-solid fa-xmark");
  button.appendChild(icon);
  return button;
}

function createIcon(classes) {
  const icon = document.createElement("i");
  icon.className = classes;
  return icon;
}

function addItemToStorage(item) {
  const itemFromStorage = getItemsFromStorage();

  // Add new item to the list
  itemFromStorage.push(item);

  // Store items to localstorage
  localStorage.setItem("items", JSON.stringify(itemFromStorage));
}

function getItemsFromStorage() {
  let itemFromStorage;

  // check if local storage is empty or not
  if (localStorage.getItem("items") === null) {
    itemFromStorage = [];
  } else {
    itemFromStorage = JSON.parse(localStorage.getItem("items"));
  }

  return itemFromStorage;
}

function onClickItem(e) {
  if (e.target.parentElement.classList.contains("remove-item")) {
    removeItem(e.target.parentElement.parentElement);
  } else {
    setItemToEdit(e.target);
  }
}

function checkIfItemExists(item) {
  const itemFromStorage = getItemsFromStorage();

  return itemFromStorage.includes(item);
}

function setItemToEdit(item) {
  isEditMode = true;
  itemList
    .querySelectorAll("li")
    .forEach((i) => i.classList.remove("edit-mode"));

  item.classList.add("edit-mode");
  formBtn.innerHTML = '<i class="fa-pen fa-solid"></i> Update Item';
  formBtn.style.backgroundColor = "#228B22";
  itemInput.value = item.textContent;
}
// Remove Item
function removeItem(item) {
  // Remove from DOM
  if (confirm("Are you sure?")) {
    item.remove();
  }

  //Remove from storage

  removeItemFromStorage(item);
}

function removeItemFromStorage(item) {
  let itemFromStorage = getItemsFromStorage();

  itemFromStorage = itemFromStorage.filter((i) => i !== item.textContent);

  localStorage.setItem("items", JSON.stringify(itemFromStorage));
}

// clear all items
function clearItems() {
  while (itemList.firstChild) {
    itemList.removeChild(itemList.firstChild);
  }

  localStorage.removeItem("items");

  checkUI();
}

function checkUI() {
  itemInput.value = "";
  const items = itemList.querySelectorAll("li");

  if (items.length === 0) {
    itemFilter.style.display = "none";
    clearBtn.style.display = "none";
  } else {
    itemFilter.style.display = "block";
    clearBtn.style.display = "block";
  }
  formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
  formBtn.style.backgroundColor = "#333";
  isEditMode = false;
}

function filterItems(e) {
  const items = itemList.querySelectorAll("li");
  items.forEach((item) => {
    // console.log(item.textContent);
    if (
      item.firstChild.textContent
        .toLowerCase()
        .includes(e.target.value.toLowerCase())
    ) {
      item.style.display = "flex";
    } else {
      item.style.display = "none";
    }
  });
}

//Iniitilize App

function init() {
  // Event Listeners
  itemForm.addEventListener("submit", addItem);
  itemList.addEventListener("click", onClickItem);
  clearBtn.addEventListener("click", clearItems);
  itemFilter.addEventListener("input", filterItems);
  document.addEventListener("DOMContentLoaded", displayItems);

  checkUI();
}

init();
