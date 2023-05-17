import { getBombsAround, generateBombs } from "./bombs.js";
import { checkFinishGame, loseGame, recursOpen, opennedCells } from "./cellsHelpers"
import { elementCreate } from "./elementCreate.js";
import { field, bombsCount, startTimer } from "../main.js";


export class Cell {
  constructor(coords, isBomb, isOpen) {
    this.coords = coords;
    this.isBomb = isBomb;
    this.isOpen = isOpen;

    this.clickHandler = this.handleCellClick.bind(this);
    this.contextmenuHandler = (e) => {
      e.preventDefault();
      const text = e.target.textContent;
      e.target.textContent = !this.isOpen ? (!text ? "🚩" : "") : text;
    };
  }

  setBomb() {
    this.isBomb = true;
  }

  setCellContent() {
    const neighs = getBombsAround(this.coords);
    this.setDOMValue(neighs.filter((neigh) => neigh?.isBomb).length);
  }

  setClass(action) {
    switch (action.type) {
      case "add":
        this.cell.classList.add(action.payload);
        break;
      case "remove":
        this.cell.classList.remove(action.payload);
        break;
      case "toggle":
        this.cell.classList.toggle(action.payload);
        break;
    }
  }

  open(notUseRecurs = false) {
    if(opennedCells === 0 && !JSON.parse(sessionStorage.getItem("bombsCells"))) {
      startTimer();
      generateBombs(field, bombsCount, this)
    }
    this.cell.classList.add("open");
    this.isOpen = true;
    this.setCellContent();
    if (!this.isBomb) checkFinishGame();
    if (!notUseRecurs) recursOpen(this);
  }

  handleCellClick() {
    if (this.isBomb) {
      loseGame();
    } else {
      this.open();
    }
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
    this.setClass({ type: "add", payload: "disabled" });
  }

  createCellOnField() {
    this.cell = elementCreate({tagName: "div", classList: ["cell"]});
    if (this.isOpen) this.open();
    this.cell.addEventListener("click", this.clickHandler);
    this.cell.addEventListener("contextmenu", this.contextmenuHandler);
    this.setCellContent();
    return this.cell;
  }
}