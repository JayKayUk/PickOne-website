"use strict";

const itemDeleteButtonArray =
  document.getElementsByClassName("item-delete-button");
const addItemButton = document.getElementById("add-item-button");
const inputField = document.getElementById("input");
const compareContainer = document.getElementById("compare-container");
const itemListContainer = document.getElementById("item-list");
const compareButton = document.getElementById("compare-button");
const mainContainer = document.getElementById("main-container");
const choiceButtons = [...document.getElementsByClassName("choice-button")];
const coutnerElement = document.getElementById("counter");
const resultsContainer = document.getElementById("results-container");

const itemList = [];

inputField.value = "";

addItemButton.addEventListener("click", addItem);
document.addEventListener("keyup", (e) => {
  if (e.key === "Enter") addItem();
});

compareButton.addEventListener("click", compareInit);

function addItem() {
  if (inputField.value === "") return;
  const itemHtml = `
  <div class="item">
    <p class="item-name">${inputField.value}</p>
    <button class="item-delete-button">X</button>
  </div>`;
  itemList.push({ name: inputField.value, points: 0 });
  inputField.value = "";
  itemListContainer.insertAdjacentHTML("beforeend", itemHtml);
  itemDeleteButton_addListener();
}

function itemDeleteButton_addListener() {
  [...itemDeleteButtonArray].forEach((itemDeleteButton) => {
    itemDeleteButton.addEventListener("click", () => {
      const itemContainer = itemDeleteButton.parentElement;
      const itemName = itemDeleteButton.previousElementSibling.textContent;
      itemContainer.remove();
      delete itemList[itemName];
    });
  });
}

function compareInit() {
  showSection(compareContainer);
  const itemPairsArray = createItemPairsArray();
  const randomOrderArray = createRandomOrderArray(itemPairsArray);

  const choiceButton1 = document.getElementById("choice-one");
  const choiceButton2 = document.getElementById("choice-two");

  let counter = 0;

  setCounterElementText(counter + 1, randomOrderArray.length);

  setButtonText(
    choiceButton1,
    choiceButton2,
    itemPairsArray,
    randomOrderArray,
    counter
  );

  choiceButtons.forEach((choiceButton) => {
    choiceButton.addEventListener("click", setChosenStyles);
    choiceButton.addEventListener("click", () => {
      setTimeout(() => {
        setPoints.call(choiceButton, itemPairsArray, randomOrderArray, counter);
        counter++;
        if (counter >= randomOrderArray.length) {
          itemList.sort(compare);
          resultsInit();
          return;
        }
        setButtonText(
          choiceButton1,
          choiceButton2,
          itemPairsArray,
          randomOrderArray,
          counter
        );
        resetChosenStyles(choiceButton1, choiceButton2);
        setCounterElementText(counter + 1, randomOrderArray.length);
      }, 1000);
    });
  });
}

function createItemPairsArray() {
  const itemPairsArray = [];
  for (let i = 0; i < itemList.length; i++) {
    for (let j = i + 1; j < itemList.length; j++) {
      itemPairsArray.push([i, j]);
    }
  }
  return itemPairsArray;
}

function createRandomOrderArray(itemPairsArray) {
  const randomOrderArray = [];
  while (randomOrderArray.length !== itemPairsArray.length) {
    const randomNumber = Math.floor(Math.random() * itemPairsArray.length);
    if (checkIfNumberExist(randomNumber, randomOrderArray)) {
      continue;
    }
    randomOrderArray.push(randomNumber);
  }
  return randomOrderArray;
}

function checkIfNumberExist(number, array) {
  for (let i = 0; i < array.length; i++) {
    if (array[i] === number) return true;
  }
}

function setChosenStyles() {
  this.classList.add("chosen");
  this.nextElementSibling ? (this.nextElementSibling.disabled = true) : false;
  this.previousElementSibling
    ? (this.previousElementSibling.disabled = true)
    : false;
  this.disabled = true;
}

function resetChosenStyles(button1, button2) {
  button1.classList.remove("chosen");
  button2.classList.remove("chosen");
  button1.disabled = false;
  button2.disabled = false;
}

function setCounterElementText(current, total) {
  coutnerElement.textContent = `${current}/${total}`;
}

function setButtonText(
  button1,
  button2,
  itemPairsArray,
  randomOrderArray,
  counter
) {
  button1.textContent =
    itemList[itemPairsArray[randomOrderArray[counter]][0]].name;
  button2.textContent =
    itemList[itemPairsArray[randomOrderArray[counter]][1]].name;
}

function setPoints(itemPairsArray, randomOrderArray, counter) {
  itemList[
    itemPairsArray[randomOrderArray[counter]][this.dataset.buttonid]
  ].points += 1;
}

function compare(a, b) {
  if (a.points < b.points) {
    return 1;
  }
  if (a.points > b.points) {
    return -1;
  }
  return 0;
}

function resultsInit() {
  showSection(resultsContainer);
  let counter = 0;
  itemList.forEach((item) => {
    const resultElement = `<div class="result result-${
      (counter % 2) + 1
    }"><p class="result-number">${counter + 1}.</p><p class="result-name">${
      item.name
    }</p><p class="result-score">${item.points}</p></div>`;
    resultsContainer.insertAdjacentHTML("beforeend", resultElement);
    counter++;
  });
}

function showSection(element) {
  element.style.display = "flex";
  element.scrollIntoView({ alignToTop: true, behavior: "smooth" });
}
