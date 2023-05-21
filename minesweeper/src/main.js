import { Cell } from "./helpers/Cell.js";
import { setOpennedCells } from "./helpers/cellsHelpers.js";
import { elementCreate } from "./helpers/elementCreate.js";
import { setBombCells } from "./helpers/bombs.js";
import "./style.css";

const app = elementCreate({ tagName: "div", id: "app" });
const wrapper = elementCreate({ tagName: "div", classList: ["wrapper"] });
const menu = elementCreate({ tagName: "div", classList: ["menu"] });

const stopwatch = elementCreate({
  tagName: "div",
  classList: ["stopwatch", "menu__text"],
  textContent: `00:00`,
});
const resetBtn = elementCreate({
  tagName: "div",
  classList: ["menu__btn"],
});

const menuText = elementCreate({
  tagName: "div",
  classList: ["menu__text"],
});
const clickCount = elementCreate({
  tagName: "div",
  classList: ["click-count"],
});
const remainingBombs = elementCreate({
  tagName: "div",
  classList: ["remaining-bombs"],
});

const optionBox = elementCreate({
  tagName: "div",
  classList: ["option-box"],
});

const modalBox = elementCreate({
  tagName: "div",
  classList: ["modal-box", "hidden"],
});
const modalBoxContant = elementCreate({
  tagName: "div",
  classList: ["modal-box__content"],
  textContent: "Settings",
});

const settingsBtn = elementCreate({
  tagName: "div",
  classList: ["settings-btn", "btn"],
  textContent: "Settings",
});

const lastResultBtn = elementCreate({
  tagName: "div",
  classList: ["last-results-btn", "btn"],
  textContent: "Results",
});

modalBox.append(modalBoxContant);
optionBox.append(modalBox, settingsBtn, lastResultBtn);

const fieldDOM = elementCreate({ tagName: "div", classList: ["field"] });

menuText.append(clickCount, remainingBombs);
menu.append(stopwatch, resetBtn, menuText);
wrapper.append(menu, fieldDOM);

app.append(optionBox, wrapper);
document.body.append(app);

settingsBtn.addEventListener("click", (e) => toggleModalBox(e, "settings"));
lastResultBtn.addEventListener("click", (e) => toggleModalBox(e, "results"));
modalBox.addEventListener("click", (e) => toggleModalBox(e));

const root = document.documentElement;
let { soundIsOn, theme } = JSON.parse(localStorage.getItem("settings")) || { soundIsOn: true, theme: "light"};
const settingOptions = [
  {
    name: "Sound",
    className: ["sound-setting-item"],
    options: [
      { text: "On", value: true, className: [soundIsOn ? "active" : ""], handle: setSound },
      { text: "Off", value: false, className: [!soundIsOn ? "active" : ""], handle: setSound },
    ],
  },
  {
    name: "Theme",
    className: ["theme-setting-item"],
    options: [
      { text: "Light", value: "light", className: [theme === "light" ? "active" : ""], handle: setTheme },
      { text: "Dark", value: "dark", className: [theme === "dark" ? "active" : ""], handle: setTheme },
    ],
  },
];


if (theme === "dark") {
  root.style.setProperty("--main-color", "#373737");
  }

function playSound(sound) {
  if (soundIsOn) {
    sound.play();
  }
}

function setSound(el, children) {
  if (el.getAttribute("value") === "true") {
    soundIsOn = true;
  }
  if (el.getAttribute("value") === "false") {
    soundIsOn = false;
  }
  toggleActiveOption(el, children, "Sound");
}

function setTheme(el, children) {
  if (el.getAttribute("value") === "dark") {
    root.style.setProperty("--main-color", "#373737");
    theme = "dark";
  }
  if (el.getAttribute("value") === "light") {
    console.log("theme", el, children);
    root.style.setProperty("--main-color", "#fff");
    theme = "light";
  }
  toggleActiveOption(el, children, "Theme");
}

function toggleActiveOption(el, children, settingName) {
  el.classList.add("active");

  settingOptions.filter((setting) => setting.name === settingName)[0].options.map((option) => {
    if (option.text === el.textContent) {
      option.className.push("active");
    } else {
      option.className.pop();
    }
  })
  for (let i = 1; i < children.length; i++) {
    if (el !== children[i]) {
      children[i].classList.remove("active");
    }
  }
  localStorage.setItem("settings", JSON.stringify({soundIsOn, theme}))
}

function createModalBoxItem(container, item) {
  const contentBoxItem = elementCreate({
    tagName: "div",
    classList: ["content-box-item", ...item.className || ""],
  });

  const setting = elementCreate({
    tagName: "div",
    className: "option-title",
    textContent: item.name,
  });

  item.options.forEach((optionItem) => {
    const option = elementCreate({
      tagName: "div",
      classList: ["option-item", ...optionItem.className || ""],
      value: optionItem.value,
      textContent: optionItem.text,
    });
    option.addEventListener("click", () => {
      optionItem.handle(option, contentBoxItem.children);
    });
    contentBoxItem.append(option);
  });

  contentBoxItem.prepend(setting);
  container.append(contentBoxItem);
}

function toggleModalBox(e, btn) {
  if (e.target.classList.contains("modal-box")) {
    modalBox.classList.add("hidden");
  } else {
    if (btn === "settings") {
      modalBoxContant.innerHTML = "";
      
      settingOptions.forEach((item) =>
        createModalBoxItem(modalBoxContant, item)
      );
    }
    if (btn === "results") {
      modalBoxContant.innerHTML = "";
      modalBoxContant.textContent = btn;
    }
    modalBox.classList.remove("hidden");
  }
}

const loseAudio = new Audio("/src/assets/sounds/lose.mp3");
const winAudio = new Audio("/src/assets/sounds/win.mp3");
const clickAudio = new Audio("/src/assets/sounds/click.mp3");
const tickAudio = new Audio("/src/assets/sounds/tick.mp3");

export function showWinScreen() {
  playSound(winAudio);
  showScreen(
    "win",
    `Hooray! You found all mines in ${time} seconds and ${clickCount.textContent} moves!`
  );
}
export function showLoseScreen() {
  playSound(loseAudio);
  showScreen("lose", `Game over. Try again`);
}

function showScreen(className, text) {
  stopTimer();
  const messageBox = elementCreate({
    tagName: "div",
    classList: ["message-box", "hidden"],
  });
  const messageBoxText = elementCreate({
    tagName: "div",
    classList: ["message-box__text"],
  });
  messageBox.append(messageBoxText);
  messageBox.classList.remove("hidden");
  messageBoxText.classList.add(className);
  messageBoxText.textContent = text;
  fieldDOM.prepend(messageBox);
}

resetBtn.addEventListener("click", resetGame);

let time = 0;
let timer = null;

export function startTimer() {
  timer = setInterval(() => {
    time++;
    stopwatch.textContent = getHumanReadableTime(time);
  }, 1000);
}

function stopTimer() {
  clearInterval(timer);
  timer = null;
}

export function incrementClickCount() {
  playSound(clickAudio);
  clickCount.textContent = +clickCount.textContent + 1;
}

export function setRemainingBombs(count) {
  playSound(tickAudio);
  remainingBombs.textContent = +remainingBombs.textContent + count;
}

export let field = [];
export let bombsCount = 0;

function getHumanReadableTime(seconds) {
  const minutes = Math.floor(seconds / 60).toString();
  const secs = (seconds - +minutes * 60).toString();
  const str = `${minutes.length === 1 ? `0${minutes}` : minutes}:${
    secs.length === 1 ? `0${secs}` : secs
  }`;
  return str;
}

function resetGame() {
  stopTimer();
  fieldDOM.innerHTML = "";
  sessionStorage.setItem("saveField", JSON.stringify(false));
  sessionStorage.setItem("bombsCells", JSON.stringify(false));
  time = 0;
  field = [];
  bombsCount = 0;
  setBombCells([]);
  clickCount.textContent = 0;
  remainingBombs.textContent = 0;
  stopwatch.textContent = getHumanReadableTime(time);
  setOpennedCells(0);
  startGame();
}

export function startGame(width = 10, height = 10, bombs = 1) {
  clickCount.textContent = 0;
  setRemainingBombs(bombs);
  createArea(width, height, bombs);
}

function createArea(width, height, bombs) {
  const fieldSavedGame = JSON.parse(sessionStorage.getItem("saveField"));
  field =
    fieldSavedGame ||
    Array.from({ length: height }, () =>
      Array.from({ length: width }, () => 0)
    );
  bombsCount = bombs;

  field.map((lines, y) => {
    const lineCells = elementCreate({
      tagName: "div",
      classList: ["line-cells"],
    });
    fieldDOM.append(lineCells);
    lines.map((_, x) => {
      const DOMCell = createCell(
        { y, x },
        fieldSavedGame?.[y]?.[x].isBomb || false,
        fieldSavedGame?.[y]?.[x].isOpen || false,
        fieldSavedGame?.[y]?.[x].isFlagged || false
      );
      lineCells.append(DOMCell);
    });
  });
}

export function createCell({ y, x }, isBomb, isOpen, isFlagged) {
  const cell = new Cell(
    { y, x },
    Boolean(isBomb),
    Boolean(isOpen),
    Boolean(isFlagged)
  );
  field[y][x] = cell;
  return cell.createCellOnField();
}