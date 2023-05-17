import { Cell } from "./helpers/Cell.js";
import { resetOpennedCells } from "./helpers/cellsHelpers.js";
import { elementCreate } from "./helpers/elementCreate.js";
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
  textContent: "😀",
});
const remainingBombs = elementCreate({
  tagName: "div",
  classList: ["remaining-bombs", "menu__text"],
  textContent: `10`,
});

//app.appendChild();
const fieldDOM = elementCreate({ tagName: "div", classList: ["field"] });
const messageBox = elementCreate({
  tagName: "div",
  classList: ["message-box", "hidden"],
});
const messageBoxText = elementCreate({
  tagName: "div",
  classList: ["message-box__text"],
});

menu.append(stopwatch, resetBtn, remainingBombs);
wrapper.append(menu, fieldDOM);

messageBox.appendChild(messageBoxText);
fieldDOM.appendChild(messageBox);
app.appendChild(wrapper);
document.body.appendChild(app);

export function showWinScreen() {
  stopTimer();
  messageBox.classList.remove("hidden");
  messageBoxText.classList.add("win");
  messageBoxText.textContent = `Hooray! You found all mines in ${time} seconds and N moves!`;
}
export function showLoseScreen() {
  stopTimer();
  messageBox.classList.remove("hidden");
  messageBoxText.classList.add("lose");
  messageBoxText.textContent = `Game over. Try again`;
}

resetBtn.addEventListener("click", resetGame);


let time = 0;
let timer = null;

export function startTimer() {
  timer = setInterval(() => {
    time++;
    stopwatch.textContent = `00:${time}`;
  }, 1000);
}

function stopTimer() {
  clearInterval(timer);
  timer = null;
}

export let field = [];
export let bombsCount = 0;


function resetGame() {
  stopTimer();
  fieldDOM.innerHTML = "";
  sessionStorage.setItem("saveField", JSON.stringify(false));
  sessionStorage.setItem("bombsCells", JSON.stringify(false));
  time = 0;
  field = [];
  bombsCount = 0;
  resetOpennedCells();
  startGame(5, 5, 10);
}

export function startGame(width, height, bombs) {
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
    fieldDOM.appendChild(lineCells);
    lines.map((_, x) => {
      const DOMCell = createCell(
        { y, x },
        fieldSavedGame?.[y]?.[x].isBomb || false,
        fieldSavedGame?.[y]?.[x].isOpen || false
      );
      lineCells.appendChild(DOMCell);
    });
  });
}

export function createCell({ y, x }, isBomb, isOpen) {
  const cell = new Cell({ y, x }, Boolean(isBomb), Boolean(isOpen));
  field[y][x] = cell;
  return cell.createCellOnField();
}
