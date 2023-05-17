import { Cell } from "./helpers/Cell.js"
import "./style.css";

const app = document.createElement("div");
app.id = "app";
const fieldEl = document.createElement("div");
fieldEl.classList.add("field");
app.appendChild(fieldEl);
document.body.appendChild(app);

export let field = [];
export let bombsCount = 0;

const fieldArea = document.querySelector(".field");

export function startGame(width, height, bombs) {
  createArea(width, height, bombs);
}

function createArea(width, height, bombs) {
  const fieldSavedGame = JSON.parse(sessionStorage.getItem("saveField"));
  field = fieldSavedGame || Array.from({ length: height }, () =>
    Array.from({ length: width }, () => 0)
  );
  bombsCount = bombs;
  
  if(!fieldSavedGame) {
    field.map((lines, y) => {
      const lineCells = document.createElement("div");
      lineCells.classList.add("line-cells");
      fieldArea.append(lineCells);
      lines.map((_, x) => {
        const DOMCell = createCell({y, x}, false, false);
        lineCells.appendChild(DOMCell);
      }); 
    });
  } else {
    field.map((lines, y) => {
      const lineCells = document.createElement("div");
      lineCells.classList.add("line-cells");
      fieldArea.append(lineCells);
      lines.map((_, x) => {
        const DOMCell = createCell({y, x}, fieldSavedGame[y][x].isBomb, fieldSavedGame[y][x].isOpen);
        lineCells.appendChild(DOMCell);
      }); 
    });
  }
}

export function createCell({y, x}, isBomb, isOpen) {
  const cell = new Cell({ y, x }, Boolean(isBomb), Boolean(isOpen));
  field[y][x] = cell;
  return cell.createCellOnField();
}