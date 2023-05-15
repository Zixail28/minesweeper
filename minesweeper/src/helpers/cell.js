import { getBombsAround, bombsCells } from "./bombs.js";
import { field } from "../main.js";

export class Cell {
  constructor(coords, isBomb) {
    this.coords = coords;
    this.isBomb = isBomb;
    this.isOpen = false;

    this.clickHandler = this.handleCellClick.bind(this);
    this.contextmenuHandler = (e) => {
      e.preventDefault();
      const text = e.target.textContent;
      e.target.textContent = !this.isOpen ? (!text ? "🚩" : "") : text;
    };
  }

  setCellContent() {
    const neighs = getBombsAround(this.coords);
    this.setDOMValue(neighs.filter((neigh) => neigh?.isBomb).length);
  }

  setClass(action) {
    switch (action.type) {
      case "add":
        this.cell.classList.add(action.payload)
        break;
      case "remove": 
        this.cell.classList.remove(action.payload)
        break;
      case "toggle":
        this.cell.classList.toggle(action.payload)
        break;
    }
  }

  open(isBomb = false) {
    this.cell.classList.add("open");
    this.isOpen = true;
    this.setCellContent();
    if (!isBomb) recursOpen(this);
  }

  handleCellClick() {
    this.isBomb ? loseGame() : this.open();
  }

  setDOMValue(value) {
    if (this.cell.classList.contains("open")) {
      if (this.isBomb) return (this.cell.textContent = "💣");
      this.cell.textContent = value || "";
      this.cell.classList.add(`value-${value}`);
    }
  }

  disableCell() {
    this.cell.removeEventListener("click", this.clickHandler);
    this.cell.removeEventListener("contextmenu", this.contextmenuHandler);
    this.setClass({type: "add", payload: "disabled"})
  }

  createCellOnField() {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    this.cell = cell;
    this.cell.addEventListener("click", this.clickHandler);
    this.cell.addEventListener("contextmenu", this.contextmenuHandler);
    this.setCellContent();
    return cell;
  }
}

function recursOpen(cell) {
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

function loseGame() {
  bombsCells.map(({ y, x }) => {
    field[y][x].open(true);
  });
  field.map((cellsLine) => {
    cellsLine.map((cell) => {
      cell.disableCell();
    });
  });
}
