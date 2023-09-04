const numberButtons = document.querySelectorAll(".btn__number");
const operatorButtons = document.querySelectorAll(".btn__operator");
const calculatorPrevious = document.querySelector(".calculator__previous");
const calculatorCurrent = document.querySelector(".calculator__current");
const decimalButton = document.getElementById("decimal");
const equalsButton = document.getElementById("equals");

let firstNumber;
let operator;
let secondNumber;
let previousDisplay = [];
let currentValue = 0;
let currentDisplay = "";

function operate(a, operator, b) {
  let result;
  switch (operator) {
    case "+":
      result = add(a, b);
      break;
    case "-":
      result = subtract(a, b);
      break;
    case "×":
      result = multiply(a, b);
      break;
    case "÷":
      result = divide(a, b);
      break;
    case "%":
      result = percent(a);
      break;
  }

  if (result !== "invalid") {
    if (!Number.isInteger(+result)) {
      result = Math.round(Number.parseFloat(result) * 100000) / 100000;
    }
    if (result >= 10 ** 10) {
      result = result.toExponential(5);
    }
  }

  return result;
}

function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

function multiply(a, b) {
  return a * b;
}

function divide(a, b) {
  if (b === 0) {
    return "invalid";
  } else {
    return a / b;
  }
}

function percent(a) {
  return a * 0.01;
}

function updateCurrentUI() {
  calculatorCurrent.innerHTML = currentDisplay || "0";
}

function updatePreviousUI() {
  calculatorPrevious.innerHTML = previousDisplay.join(" ");
  if (previousDisplay.length === 0) calculatorPrevious.innerHTML = "&nbsp;";
}

function clearAll() {
  previousDisplay = [];
  currentDisplay = "";
  currentValue = +currentDisplay;
  calculatorPrevious.innerHTML = "&nbsp;";
  calculatorCurrent.innerHTML = 0;
}

function clearOne() {
  if (currentDisplay.length < 1) return;
  if (currentDisplay.length === 1) {
    currentDisplay = "";
  } else {
    currentDisplay = currentDisplay.slice(0, -1);
  }
  currentValue = +currentDisplay;
  updateCurrentUI();
}

function handleEquals() {
  // Percentage
  if (previousDisplay.includes("%")) {
    handlePercent();
    return;
  }
  // Error handling
  if (operate(...previousDisplay, currentValue) === "invalid") {
    calculatorCurrent.innerHTML = "Dumbass";
    currentDisplay = "";
    currentValue = 0;
    return;
  }
  if (previousDisplay.length <= 1) return;
  if (previousDisplay.length === 3) {
    if (currentDisplay === "") {
      previousDisplay[0] = currentValue;
    } else {
      previousDisplay = [];
      updatePreviousUI();
      return;
    }
  }
  if (previousDisplay.length === 2) {
    previousDisplay.push(currentValue);
  }
  currentValue = operate(...previousDisplay);
  currentDisplay = currentValue;
  updateCurrentUI();
  updatePreviousUI();

  currentDisplay = "";
}

function handleNumber(number) {
  if (+number >= 10 ** 10) return;
  // Only allow one zero before decimal
  if (number === "0" && currentDisplay === "0") {
    return;
  }
  if (currentDisplay && currentDisplay.split(".")[1]?.length >= 5) {
    console.log("test");
    return;
  }
  currentDisplay += number;
  currentValue = +currentDisplay;
  updateCurrentUI();
  updatePreviousUI();
}

function handleOperator(operator) {
  console.log(currentValue);
  console.log(currentDisplay);
  console.log(previousDisplay);
  if (previousDisplay.length === 2) {
    if (
      operator === "÷" &&
      operate(...previousDisplay, currentValue) === "invalid"
    ) {
      calculatorCurrent.innerHTML = "Dumbass";
      console.log("test");
      currentDisplay = "";
      return;
    }
    // Calculate result
    previousDisplay.push(currentValue);
    currentDisplay = operate(...previousDisplay);
  }
  // Clear previous display
  previousDisplay = [];

  // Add new result and operator to previous display
  previousDisplay.push(currentValue);
  previousDisplay.push(operator);
  currentDisplay = currentValue;

  updateCurrentUI();
  updatePreviousUI();

  currentDisplay = "";
}

function handleDecimal() {
  if (currentDisplay.includes(".")) return;
  if (currentDisplay === "") currentDisplay += "0";
  currentDisplay += ".";
  updateCurrentUI();
}

function handlePercent() {
  if(previousDisplay.length === 2 && !previousDisplay.includes("%")) {
    // Calculate result
    previousDisplay.push(currentValue);
    currentDisplay = operate(...previousDisplay);
    currentValue = currentDisplay;
  }

  previousDisplay = [];
  previousDisplay.push(currentValue);
  previousDisplay.push("%");
  currentDisplay = operate(...previousDisplay);
  currentValue = currentDisplay;

  updateCurrentUI();
  updatePreviousUI();

  currentDisplay = "";
}

// Event listeners
equalsButton.addEventListener("click", handleEquals);

// Number buttons
for (const button of numberButtons) {
  button.addEventListener("click", (e) => {
    handleNumber(e.target.innerHTML);
  });
}

// Operator buttons
for (const button of operatorButtons) {
  button.addEventListener("click", (e) => {
    handleOperator(e.target.innerHTML);
  });
}

// Decimal button
decimalButton.addEventListener("click", handleDecimal);

// Keyboard support
document.onkeydown = (e) => {
  // Numbers
  if (+e.key || e.key === "0") {
    handleNumber(e.key);
  }
  switch (e.key) {
    case "+":
    case "-":
      e.preventDefault();
      handleOperator(e.key);
      break;
    case "*":
      e.preventDefault();
      handleOperator("×");
      break;
    case "/":
      e.preventDefault();
      handleOperator("÷");
      break;
    case "=":
    case "Enter":
      e.preventDefault();
      handleEquals();
      break;
    case ".":
      e.preventDefault();
      handleDecimal();
      break;
    case "%":
      e.preventDefault();
      handlePercent();
      break;
    case "c":
    case "Backspace":
      e.preventDefault();
      clearOne();
      break;
    case "Escape":
      e.preventDefault();
      clearAll();
      break;
  }
};
