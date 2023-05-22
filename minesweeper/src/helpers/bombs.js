import { field } from "../main";

export let bombsCells = [];

export function setBombCells(arr) {
  bombsCells = [...arr];
}

export function generateBombs(field, bombs, firstOpenCell) {
  bombsCells = [];
  let i = bombs;
  while (i !== 0) {
    const y = randomFromRange(0, field.length - 1);
    const x = randomFromRange(0, field[0].length - 1);
    if (!field[y][x].isBomb && field[y][x] !== firstOpenCell) {
      bombsCells.push({ y, x });
      field[y][x].setBomb();
      i--;
    }
  }
}

export function getBombsAround({ y, x }) {
  const neigh = [
    field[y - 1]?.[x],
    field[y - 1]?.[x + 1],
    field[y]?.[x + 1],
    field[y + 1]?.[x + 1],
    field[y + 1]?.[x],
    field[y + 1]?.[x - 1],
    field[y]?.[x - 1],
    field[y - 1]?.[x - 1],
  ];
  return neigh;
}

function randomFromRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
