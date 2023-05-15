import { startGame } from "./src/main";

const {x, y} = JSON.parse(localStorage.getItem("fieldSizeSavedGame")) || {x: 30, y: 10}; // {x: number, y: number}

startGame(x, y, 10);