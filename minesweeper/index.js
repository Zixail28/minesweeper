import { startGame } from "./src/main";

const {x, y} = JSON.parse(sessionStorage.getItem("fieldSizeSavedGame")) || {x: 5, y: 5}; // {x: number, y: number}

startGame(x, y, 1);