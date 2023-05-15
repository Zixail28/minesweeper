import { generateBombs } from "./helpers/bombs.js";
import { Cell } from "./helpers/cell.js"
import "./style.css";

const app = document.createElement("div");
app.id = "app";
const fieldEl = document.createElement("div");
fieldEl.classList.add("field");
app.appendChild(fieldEl);
document.body.appendChild(app);

export let field = [];
const fieldArea = document.querySelector(".field");

function startGame(width, height, bombs) {
  console.log("start");
  createArea(width, height, bombs);
}

function createArea(width, height, bombs) {
  console.log("create");
  field = Array.from({ length: height }, () =>
    Array.from({ length: width }, () => 0)
  );

  generateBombs(field, bombs);
  console.log(field);
  
  field.map((lines, y) => {
    const lineCells = document.createElement("div");
    lineCells.classList.add("line-cells");
    fieldArea.append(lineCells);
    lines.map((_, x) => {
      const DOMCell = createCell({y, x}, Boolean(_));
      lineCells.appendChild(DOMCell);
    }); 
  });
}

export function createCell({y, x}, isBomb) {
  const cell = new Cell({ y, x }, Boolean(isBomb));
  field[y][x] = cell;
  return cell.createCellOnField();
}


startGame(30, 10  , 10);

