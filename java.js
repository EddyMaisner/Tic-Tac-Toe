const fields = [
  null, null, null,
  null, null, null,
  null, null, null,
];

let currentPlayer = "";
let gameEnded = false;
const winningCombinations = [
  // Horizontale Reihen
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  // Vertikale Reihen
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  // Diagonale Reihen
  [0, 4, 8],
  [2, 4, 6],
];

function init() {
  setStartingPlayer();
  createTable();
  updateCurrentPlayerDisplay();
}

function setStartingPlayer() {
  const random = Math.floor(Math.random() * 2);
  currentPlayer = random === 0 ? "cross" : "circle";
}

function createTable() {
  const table = document.getElementById("ticTacToeTable");
  for (let i = 0; i < 3; i++) {
    const row = document.createElement("tr");
    for (let j = 0; j < 3; j++) {
      const cell = createCell(i * 3 + j);
      row.appendChild(cell);
    }
    table.appendChild(row);
  }
}

function createCell(index) {
  const cell = document.createElement("td");
  cell.setAttribute("data-index", index);
  cell.addEventListener("click", () => onCellClick(index));

  const symbol = fields[index];
  if (symbol === "circle" || symbol === "cross") {
    cell.classList.add(symbol);
  }

  return cell;
}

function onCellClick(index) {
  if (gameEnded || fields[index] !== null) {
    return;
  }

  const cell = document.querySelector(`[data-index="${index}"]`);
  if (currentPlayer === "circle") {
    const animatedCircleHTML = generateAnimatedCircleSVG();
    cell.innerHTML = animatedCircleHTML;
    fields[index] = "circle";
    currentPlayer = "cross";
  } else if (currentPlayer === "cross") {
    const animatedCrossHTML = generateAnimatedCrossSVG();
    cell.innerHTML = animatedCrossHTML;
    fields[index] = "cross";
    currentPlayer = "circle";
  }

  const winner = checkWinner(); // Jetzt überprüfen wir den Gewinner nach dem aktuellen Zug
  if (winner) {
    gameEnded = true;
    const winnerDisplay = document.getElementById("winner-display");
    if (winner === "circle") {
      winnerDisplay.textContent = "Circle hat gewonnen!";
    } else if (winner === "cross") {
      winnerDisplay.textContent = "Cross hat gewonnen!";
    } else if (winner === "draw") {
      winnerDisplay.textContent = "Unentschieden!";
    }

    toggleRestartButton(true); // Zeige den Restart-Button an
  }

  updateCurrentPlayerDisplay();
}









function updateCurrentPlayerDisplay() {
  const currentPlayerDisplay = document.getElementById("currentPlayerDisplay");
  currentPlayerDisplay.innerText = `Aktueller Spieler: ${currentPlayer === "cross" ? "Cross" : "Circle"}`;
}

function checkWinner() {
  for (const combination of winningCombinations) {
    const [a, b, c] = combination;
    if (fields[a] && fields[a] === fields[b] && fields[a] === fields[c]) {
      highlightWinnerCombination(a, b, c);
      return fields[a];
    }
  }

  if (!fields.includes(null)) {
    return "draw";
  }

  return null;
}

function highlightWinnerCombination(a, b, c) {
  const cells = document.querySelectorAll(`[data-index="${a}"],[data-index="${b}"],[data-index="${c}"]`);
  for (const cell of cells) {
    cell.classList.add("winner");
  }
}

function generateAnimatedCircleSVG() {
  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("width", "70");
  svg.setAttribute("height", "70");

  const circle = document.createElementNS(svgNS, "circle");
  circle.setAttribute("cx", "35");
  circle.setAttribute("cy", "35");
  circle.setAttribute("r", "20");
  circle.setAttribute("fill", "transparent");
  circle.setAttribute("stroke", "#00b0ef");
  circle.setAttribute("stroke-width", "5");

  const animation = document.createElementNS(svgNS, "animate");
  animation.setAttribute("attributeName", "stroke-dasharray");
  animation.setAttribute("from", "0 188.5");
  animation.setAttribute("to", "188.5 0");
  animation.setAttribute("dur", "0.4s");
  animation.setAttribute("fill", "freeze");
  circle.appendChild(animation);

  svg.appendChild(circle);
  return svg.outerHTML;
}

function generateAnimatedCrossSVG() {
  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("width", "70");
  svg.setAttribute("height", "70");

  const line1 = document.createElementNS(svgNS, "line");
  line1.setAttribute("x1", "20");
  line1.setAttribute("y1", "20");
  line1.setAttribute("x2", "50");
  line1.setAttribute("y2", "50");
  line1.setAttribute("stroke", "rgb(241, 182, 5)"); 
  line1.setAttribute("stroke-width", "5");

  const line2 = document.createElementNS(svgNS, "line");
  line2.setAttribute("x1", "20");
  line2.setAttribute("y1", "50");
  line2.setAttribute("x2", "50");
  line2.setAttribute("y2", "20");
  line2.setAttribute("stroke", "rgb(241, 182, 5)"); 
  line2.setAttribute("stroke-width", "5");

  const animation1 = document.createElementNS(svgNS, "animate");
  animation1.setAttribute("attributeName", "opacity");
  animation1.setAttribute("from", "0");
  animation1.setAttribute("to", "1");
  animation1.setAttribute("dur", "0.4s");
  animation1.setAttribute("fill", "freeze");

  const animation2 = document.createElementNS(svgNS, "animate");
  animation2.setAttribute("attributeName", "opacity");
  animation2.setAttribute("from", "0");
  animation2.setAttribute("to", "1");
  animation2.setAttribute("dur", "0.4s");
  animation2.setAttribute("fill", "freeze");

  line1.appendChild(animation1);
  line2.appendChild(animation2);

  svg.appendChild(line1);
  svg.appendChild(line2);
  return svg.outerHTML;
}

function toggleRestartButton(show) {
  const restartButton = document.querySelector(".restart-button");
  restartButton.style.display = show ? "block" : "none";
}

function restart() {
  fields.fill(null);
  gameEnded = false;

  const winnerDisplay = document.getElementById("winner-display");
  winnerDisplay.textContent = "";

  toggleRestartButton(false); // Verstecke den Restart-Button

  // Rendere das Spielfeld erneut
  const table = document.getElementById("ticTacToeTable");
  table.querySelectorAll("td").forEach((cell) => {
    cell.classList.remove("circle", "cross", "winner");
    cell.innerHTML = "";
  });

  setStartingPlayer();
  updateCurrentPlayerDisplay();
}

