import { Cell } from "./helpers/Cell.js";
import { setOpennedCells } from "./helpers/cellsHelpers.js";
import { elementCreate } from "./helpers/elementCreate.js";
import { setBombCells } from "./helpers/bombs.js";
import loseSound from "./assets/sounds/lose.mp3";
import tickSound from "./assets/sounds/tick.mp3";
import winSound from "./assets/sounds/win.mp3";
import clickSound from "./assets/sounds/click.mp3";
import "./style.css";

const app = elementCreate({ tagName: "div", id: "app" });
const wrapper = elementCreate({ tagName: "div", classList: ["wrapper"] });
const menu = elementCreate({ tagName: "div", classList: ["menu"] });


const savedTime = JSON.parse(sessionStorage.getItem("timer"));

const stopwatch = elementCreate({
  tagName: "div",
  classList: ["stopwatch", "menu__text"],
  textContent: savedTime ? getHumanReadableTime(savedTime) : getHumanReadableTime(0),
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

const gameModes = elementCreate({
  tagName: "div",
  classList: ["game-modes"],
});

const gameModeEasy = elementCreate({
  tagName: "span",
  classList: ["game-mode", "easy-mode"],
  textContent: "EASY",
});

const gameModeMedium = elementCreate({
  tagName: "span",
  classList: ["game-mode", "medium-mode"],
  textContent: "MEDIUM",
});

const gameModeHard = elementCreate({
  tagName: "span",
  classList: ["game-mode", "hard-mode"],
  textContent: "HARD",
});

gameModes.append(gameModeEasy, gameModeMedium, gameModeHard);

gameModes.addEventListener("click", changeGameMode);

let mode = JSON.parse(sessionStorage.getItem("mode")) || "easy-mode";

const modeSettings = {
  "easy-mode": [10, 10, 10],
  "medium-mode": [15, 15, 40],
  "hard-mode": [25, 25, 99],
};

function changeGameMode(e) {
  if (e.target.classList.contains("easy-mode")) {
    mode = "easy-mode";
  }
  if (e.target.classList.contains("medium-mode")) {
    mode = "medium-mode";
  }
  if (e.target.classList.contains("hard-mode")) {
    mode = "hard-mode";
  }
  sessionStorage.setItem("mode", JSON.stringify(mode));
  resetGame();
}

const fieldDOM = elementCreate({ tagName: "div", classList: ["field"] });

menuText.append(clickCount, remainingBombs);
menu.append(stopwatch, resetBtn, menuText);
wrapper.append(menu, fieldDOM);

app.append(optionBox, gameModes, wrapper);
document.body.append(app);

settingsBtn.addEventListener("click", (e) => toggleModalBox(e, "settings"));
lastResultBtn.addEventListener("click", (e) => toggleModalBox(e, "results"));
modalBox.addEventListener("click", (e) => toggleModalBox(e));

const root = document.documentElement;
let { soundIsOn, theme } = JSON.parse(localStorage.getItem("settings")) || {
  soundIsOn: true,
  theme: "light",
};
const settingOptions = [
  {
    name: "Sound",
    className: ["sound-setting-item"],
    options: [
      {
        text: "On",
        value: true,
        className: [soundIsOn ? "active" : ""],
        handle: setSound,
      },
      {
        text: "Off",
        value: false,
        className: [!soundIsOn ? "active" : ""],
        handle: setSound,
      },
    ],
  },
  {
    name: "Theme",
    className: ["theme-setting-item"],
    options: [
      {
        text: "Light",
        value: "light",
        className: [theme === "light" ? "active" : ""],
        handle: setTheme,
      },
      {
        text: "Dark",
        value: "dark",
        className: [theme === "dark" ? "active" : ""],
        handle: setTheme,
      },
    ],
  },
];

let resultOptions = getLastResults();

function getLastResults() {
  return JSON.parse(localStorage.getItem("last-results"))?.queue.map(
    (option) => {
      return {
        name: option.mode,
        className: ["last-results-item"],
        options: [
          {
            text: getHumanReadableTime(option.time),
            value: option.time,
            className: [],
          },
          {
            text: option.clicks,
            value: option.clicks,
            className: [],
          },
        ],
      };
    }
  );
}

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

  settingOptions
    .filter((setting) => setting.name === settingName)[0]
    .options.map((option) => {
      if (option.text === el.textContent) {
        option.className.push("active");
      } else {
        option.className.pop();
      }
    });
  for (let i = 1; i < children.length; i++) {
    if (el !== children[i]) {
      children[i].classList.remove("active");
    }
  }
  localStorage.setItem("settings", JSON.stringify({ soundIsOn, theme }));
}

function createModalBoxItem(container, item) {
  const contentBoxItem = elementCreate({
    tagName: "div",
    classList: ["content-box-item", ...(item.className || "")],
  });

  const setting = elementCreate({
    tagName: "div",
    className: "option-title",
    textContent: item.name,
  });

  item.options.forEach((optionItem) => {
    const option = elementCreate({
      tagName: "div",
      classList: ["option-item", ...(optionItem.className || "")],
      value: optionItem.value,
      textContent: optionItem.text,
    });
    optionItem.handle &&
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
      //TODO
      modalBoxContant.innerHTML = "";

      resultOptions.forEach((item) =>
        createModalBoxItem(modalBoxContant, item)
      );
    }
    modalBox.classList.remove("hidden");
  }
}

const loseAudio = new Audio(loseSound);
const winAudio = new Audio(winSound);
const clickAudio = new Audio(clickSound);
const tickAudio = new Audio(tickSound);

export function showWinScreen() {
  playSound(winAudio);
  saveResultInStorage({ mode, time, clicks: clickCount.textContent });
  showScreen(
    "win",
    `Hooray! You found all mines in ${time} seconds and ${clickCount.textContent} moves!`
  );
}
export function showLoseScreen() {
  playSound(loseAudio);
  showScreen("lose", `Game over. Try again`);
}

class Queue {
  constructor(arr, maxSize) {
    this.maxSize = maxSize;
    this.queue = arr || [];
  }

  add(elem) {
    this.queue.unshift(elem);
    if (this.maxSize < this.queue.length) return this.queue.pop();
  }

  getQueue() {
    return this.queue;
  }
}

function saveResultInStorage(data) {
  const { maxSize, queue } = JSON.parse(
    localStorage.getItem("last-results")
  ) || { maxSize: 3, queue: [] };
  const queueInts = new Queue(queue, maxSize);
  queueInts.add(data);
  localStorage.setItem("last-results", JSON.stringify(queueInts));
  resultOptions = getLastResults();
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
  
  sessionStorage.setItem("count-clicks", JSON.stringify(0));
  sessionStorage.setItem("timer", JSON.stringify(0));
}

resetBtn.addEventListener("click", () => resetGame());

let time = savedTime || 0;
let timer = null;

savedTime && startTimer();

export function startTimer() {
  timer = setInterval(() => {
    time++;
    stopwatch.textContent = getHumanReadableTime(time);
    sessionStorage.setItem("timer", JSON.stringify(time));
  }, 1000);
}

function stopTimer() {
  clearInterval(timer);
  timer = null;
}

export function incrementClickCount() {
  playSound(clickAudio);
  const clicks = +clickCount.textContent + 1;
  clickCount.textContent = clicks;
  sessionStorage.setItem("count-clicks", JSON.stringify(clicks));
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
  sessionStorage.setItem("count-clicks", JSON.stringify(0));
  sessionStorage.setItem("timer", JSON.stringify(0));
  time = 0;
  field = [];
  bombsCount = 0;
  setBombCells([]);
  clickCount.textContent = 0;
  remainingBombs.textContent = 0;
  stopwatch.textContent = getHumanReadableTime(time);
  setOpennedCells(0);
  startGame(...modeSettings[mode]);
}

export function startGame() {
  const [width, height, bombs] = modeSettings[mode];
  clickCount.textContent = JSON.parse(sessionStorage.getItem("count-clicks")) || 0;
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
