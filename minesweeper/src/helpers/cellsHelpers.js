import { getBombsAround } from "./bombs.js";
import { bombsCells } from "./bombs.js";
import { field, showWinScreen, showLoseScreen } from "../main.js";

export let opennedCells = 0;

export function setOpennedCells(count) {
  opennedCells = count;
}

export function recursOpen(cell) {
  const neighs = getBombsAround(cell.coords);
  const neighWithBombs = neighs.filter((neigh) => neigh === 1 || neigh?.isBomb);
  neighs
    .filter((neigh) => neigh)
    .forEach((neigh) => {
      if (!neigh.isBomb && !neigh.isOpen && neighWithBombs.length === 0) {
        neigh.open();
        recursOpen(neigh);
      }
    });
}

export function disableField() {
  field.map((cellsLine) => {
    cellsLine.map((cell) => {
      cell.disableCell();
    });
  });
}

export function saveState(clearState = false) {
  sessionStorage.setItem("saveField", JSON.stringify(!clearState && field));
  sessionStorage.setItem(
    "bombsCells",
    JSON.stringify(
      !clearState &&
        (JSON.parse(sessionStorage.getItem("bombsCells")) ||
          (bombsCells.length === 0 ? false : bombsCells))
    )
  );
}

export function loseGame() {
  (JSON.parse(sessionStorage.getItem("bombsCells")) || bombsCells).map(
    ({ y, x }) => {
      field[y][x].open(true);
    }
  );
  showLoseScreen();
  disableField();
  saveState(true);
}

export function checkFinishGame() {
  opennedCells++;
  saveState();
  if (
    field.length * field[0].length - opennedCells ===
    JSON.parse(sessionStorage.getItem("bombsCells")).length
  ) {
    showWinScreen();
    disableField();
    saveState(true);
  }
}
