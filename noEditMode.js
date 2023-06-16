// Static HTML elements
const enterInput = document.querySelector("#enter-item-text-field");
const addBtn = document.querySelector("#add-item-btn");
const itemsContainer = document.querySelector("#all-items-block");
const filterInput = document.querySelector("#filter-item-text-field");
const itemsList = document.querySelector("#cart-items");
const clearAllBtn = document.querySelector("#clear-all-btn");

// UI functions
const checkUI = () => {
	if (Array.from(itemsList.children).length === 0) {
		displayUI("none");
	} else {
		displayUI("block");
	}
};

const displayUI = (value) => {
	filterInput.style.display = value;
	itemsList.style.display = value;
	clearAllBtn.style.display = value;
};

// Add items functions -DOM
const addItem = (text) => {
	const li = document.createElement("li");
	li.className = "item flex-container";
	const nameDiv = document.createElement("div");
	nameDiv.className = "item-name flex-container";
	const textNode = document.createTextNode(text);
	nameDiv.appendChild(textNode);

	const removeButton = document.createElement("div");
	removeButton.className = "delete-btn btn flex-container";
	const icon = document.createElement("i");
	icon.className = "fa-solid fa-xmark delete-icon";
	removeButton.appendChild(icon);

	li.appendChild(nameDiv);
	li.appendChild(removeButton);
	itemsList.appendChild(li);
};

const onAddItemEvent = (e) => {
	const inputText = `${enterInput.value
		.slice(0, 1)
		.toUpperCase()}${enterInput.value.slice(1).toLowerCase()}`;

	if (enterInput.value) {
		if (e.type === "click") {
			addItem(inputText);
			setItemToLS(inputText);
			enterInput.value = "";
		} else if (e.type === "keypress" && e.keyCode === 13) {
			addItem(inputText);
			setItemToLS(inputText);
			enterInput.value = "";
		}
	}
	checkUI();
};

// Remove items functions -DOM
const onRemoveItemEvent = (e) => {
	if (e.target.matches(".delete-btn")) {
		e.target.parentElement.remove();
		removeItemFromLS(e.target.parentElement.textContent);
	} else if (e.target.matches(".delete-icon")) {
		e.target.parentElement.parentElement.remove();
		removeItemFromLS(e.target.parentElement.parentElement.textContent);
	}
	checkUI();
};

const onClearAllItemsEvent = () => {
	Array.from(itemsList.children).forEach((item) => item.remove());
	clearAllItemsFromLS();
	checkUI();
};

// Filter items functions
const onFilterItemsEvent = () => {
	const inputText = filterInput.value.toLowerCase().trim();

	Array.from(itemsList.children).forEach((item) => {
		const itemText = item.textContent.toLowerCase().trim();

		if (!itemText.includes(inputText)) {
			item.style.display = "none";
			item.children[0].style.fontWeight = "600";
		} else {
			item.style.display = "flex";
			item.children[0].style.fontWeight = "700";
		}
		if (!inputText) {
			item.children[0].style.fontWeight = "600";
		}
	});
};

// Local storage functions
const setItemToLS = (item) => {
	let listItems = getItemsFromLS();
	listItems.push(item);
	localStorage.setItem("items", JSON.stringify(listItems));
};

const getItemsFromLS = () => {
	let listItems = JSON.parse(localStorage.getItem("items"));
	if (listItems === null) {
		listItems = [];
	}
	return listItems;
};

const removeItemFromLS = (item) => {
	let listItems = getItemsFromLS();
	listItems = listItems.filter((i) => i !== item);
	localStorage.setItem("items", JSON.stringify(listItems));
};

const clearAllItemsFromLS = () => localStorage.clear();

const loadItemsFromLS = () => {
	let listItems = getItemsFromLS();
	listItems.forEach((item) => addItem(item));
};

// Run app function
const init = () => {
	loadItemsFromLS();
	checkUI();

	addBtn.addEventListener("click", onAddItemEvent);
	enterInput.addEventListener("keypress", onAddItemEvent);
	itemsList.addEventListener("click", onRemoveItemEvent);
	clearAllBtn.addEventListener("click", onClearAllItemsEvent);
	filterInput.addEventListener("input", onFilterItemsEvent);
};

init();
