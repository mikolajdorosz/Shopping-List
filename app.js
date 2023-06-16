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

// DOM functions
const createBtn = (classes) => {
	const btn = document.createElement("div");
	btn.className = classes[0];
	const icon = document.createElement("i");
	icon.className = classes[1];
	btn.appendChild(icon);
	return btn;
};

const createEditField = (text) => {
	const field = document.createElement("input");
	field.type = "text";
	field.value = text;
	field.placeholder = "Edit item";
	field.className = "text-field";
	field.style.display = "none";
	field.style.paddingLeft = "10px";
	return field;
};

const listItemContentHandler = (number) => {
	let elements;
	Array.from(itemsList.children).forEach((item, index) => {
		const nameDiv = item.children[0];
		const editField = item.children[1];
		const confirmBtn = item.children[2];
		const confirmIcon = item.children[2].firstElementChild;
		const editBtn = item.children[3];
		const editIcon = item.children[3].firstElementChild;
		const removeBtn = item.children[4];
		const removeIcon = item.children[4].firstElementChild;
		if (index === number) {
			elements = [
				nameDiv, //     0
				editField, //   1
				confirmBtn, //  2
				confirmIcon, // 3
				editBtn, //     4
				editIcon, //    5
				removeBtn, //   6
				removeIcon, //  7
			];
		}
	});
	return elements;
};

const listItemIndex = (targetItem) => {
	for (let [index, i] of getItemsFromLS().entries()) {
		if (targetItem.matches("i") || targetItem.matches(".btn")) {
			if (
				i === targetItem.parentElement.parentElement.textContent ||
				i === targetItem.parentElement.textContent
			) {
				return index;
			}
		} else {
			return -1;
		}
	}
};

const capitalizeFunc = (text) => {
	return `${text.slice(0, 1).toUpperCase()}${text.slice(1).toLowerCase()}`;
};

const checkIfExists = (inputText) => {
	let exit = false;
	const fromLS = getItemsFromLS();

	fromLS.forEach((item) => {
		if (item.toLowerCase() === inputText.toLowerCase()) {
			exit = true;
		}
	});
	return exit;
};

const addItem = (text) => {
	const li = document.createElement("li");
	li.className = "item flex-container";
	const nameDiv = document.createElement("div");
	nameDiv.className = "item-name flex-container";
	const textNode = document.createTextNode(text);
	nameDiv.appendChild(textNode);
	const editField = createEditField(text);
	const removeButton = createBtn([
		"delete-btn btn flex-container",
		"fa-solid fa-xmark delete-icon",
	]);
	const editButton = createBtn([
		"edit-btn btn flex-container",
		"fa-solid fa-pen-to-square edit-icon",
	]);
	const confirmButton = createBtn([
		"confirm-btn btn flex-container",
		"fa-solid fa-check confirm-icon",
	]);

	li.appendChild(nameDiv);
	li.appendChild(editField);
	li.appendChild(confirmButton);
	li.appendChild(editButton);
	li.appendChild(removeButton);
	itemsList.appendChild(li);
};

const onAddItemEvent = (e) => {
	const inputText = capitalizeFunc(enterInput.value.trim());
	const exit = checkIfExists(inputText);
	if (exit) {
		enterInput.value = "";
		return;
	}

	if (inputText) {
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

const onListItemClickEvent = (e) => {
	const number = listItemIndex(e.target);
	if (number !== -1) {
		const listItemElements = listItemContentHandler(number);
		if (e.target === listItemElements[2] || e.target === listItemElements[3]) {
			confirmItem(listItemElements, number);
		} else if (
			e.target === listItemElements[4] ||
			e.target === listItemElements[5]
		) {
			editItem(listItemElements);
		} else if (
			e.target === listItemElements[6] ||
			e.target === listItemElements[7]
		) {
			removeItem(itemsList.children[number]);
		}
	}
};

const onListItemConfirmEvent = (e) => {
	if (e.keyCode === 13) {
		const number = listItemIndex(e.target.nextElementSibling);
		if (number !== -1) {
			const listItemElements = listItemContentHandler(number);
			confirmItem(listItemElements, number);
		}
	}
};

const removeItem = (item) => {
	item.remove();
	removeItemFromLS(item.textContent);
	checkUI();
};

const editItem = (itemElements) => {
	itemElements[1].style.display = "block";
	itemElements[1].value = capitalizeFunc(itemElements[1].value);
	itemElements[1].select();
	itemElements[0].style.display = "none";
	itemElements[4].style.display = "none";
	itemElements[6].style.display = "none";
	itemElements[2].style.display = "flex";
};

const confirmItem = (itemElements, number) => {
	itemElements[1].style.display = "none";
	itemElements[0].style.display = "flex";
	itemElements[4].style.display = "flex";
	itemElements[6].style.display = "flex";
	itemElements[2].style.display = "none";

	const inputText = itemElements[1].value.trim();
	const exit = checkIfExists(inputText);
	if (exit) {
		itemElements[1].value = itemElements[0].textContent;
		return;
	}
	if (inputText) {
		if (
			itemElements[1].value.toLowerCase() !==
			itemElements[0].textContent.toLowerCase()
		) {
			itemElements[0].textContent = capitalizeFunc(itemElements[1].value);
			updateItemInLS(number, itemElements[1].value);
		}
	} else {
		itemElements[1].value = itemElements[0].textContent;
	}
};

const onClearAllItemsEvent = () => {
	Array.from(itemsList.children).forEach((item) => item.remove());
	clearAllItemsFromLS();
	checkUI();
};

// Local storage functions
const setItemToLS = (item) => {
	let listItems = getItemsFromLS();
	listItems.push(item);
	localStorage.setItem("items", JSON.stringify(listItems));
};

const updateItemInLS = (number, item) => {
	let listItems = getItemsFromLS();
	listItems[number] = capitalizeFunc(item);
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

// Run app
const init = () => {
	loadItemsFromLS();
	checkUI();

	addBtn.addEventListener("click", onAddItemEvent);
	enterInput.addEventListener("keypress", onAddItemEvent);
	filterInput.addEventListener("input", onFilterItemsEvent);
	itemsList.addEventListener("click", onListItemClickEvent);
	itemsList.addEventListener("keypress", onListItemConfirmEvent);
	clearAllBtn.addEventListener("click", onClearAllItemsEvent);
};
init();
