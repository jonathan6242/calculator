const numberButtons = document.querySelectorAll('.btn__number');
const operatorButtons = document.querySelectorAll('.btn__operator');
const calculatorPrevious = document.querySelector('.calculator__previous');
const calculatorCurrent = document.querySelector('.calculator__current');
const decimalButton = document.getElementById('decimal');
const equalsButton = document.getElementById('equals');

let firstNumber;
let operator;
let secondNumber;
let previousDisplay = [];
let currentDisplay = "";

function operate(a, operator, b) {
  let result;
  switch(operator) {
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
  }
  if(!Number.isInteger(+result)) {
    result = (Math.round(Number.parseFloat(result) * 1000) / 1000);
  }
  if(result >= (10 ** 10)) {
    result = result.toExponential(3);
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
  if(b === 0) {
    return "invalid";
  }
  else {
    return a / b;
  }
}

function updateCurrentUI() {
  calculatorCurrent.innerHTML = currentDisplay;
}

function updatePreviousUI() {
  calculatorPrevious.innerHTML = previousDisplay.join(" ");
}

function clearAll() {
  previousDisplay = [];
  currentDisplay = "";
  calculatorPrevious.innerHTML = "&nbsp;";
  calculatorCurrent.innerHTML = 0;
}

function clearOne() {
  if(currentDisplay.length <= 1) return;
  currentDisplay = currentDisplay.slice(0, -1);
  updateCurrentUI();
}


// Event listeners
equalsButton.addEventListener('click', () => {
  // Error handling
  if(currentDisplay === "") return;
  if(operate(...previousDisplay, +currentDisplay) === "invalid") {
    calculatorCurrent.innerHTML = "Dumbass"
    currentDisplay = "";
    return;
  }
  if(previousDisplay.length === 3) {
    previousDisplay[0] = +currentDisplay;
  }
  if(previousDisplay.length === 2) {
    previousDisplay.push(+currentDisplay);
  }
  currentDisplay = operate(...previousDisplay);
  updateCurrentUI();
  updatePreviousUI();
})

// Number buttons
for(const button of numberButtons) {
  button.addEventListener('click', (e) => {
    if(+e.target.innerHTML >= (10 ** 10)) return;
    currentDisplay += e.target.innerHTML;
    updateCurrentUI();
  })
}

// Operator buttons
for(const button of operatorButtons) {
  button.addEventListener('click', (e) => {
    if(previousDisplay.length === 2) {
      if(operate(...previousDisplay, +currentDisplay) === "invalid") {
        calculatorCurrent.innerHTML = "Dumbass"
        currentDisplay = "";
        return;
      }
      // Calculate result
      previousDisplay.push(+currentDisplay);
      currentDisplay = operate(...previousDisplay);
    }
    // Clear previous display
    previousDisplay = [];

    // Add new result and operator to previous display
    previousDisplay.push(+currentDisplay);
    previousDisplay.push(e.target.innerHTML);

    updateCurrentUI();
    updatePreviousUI();

    currentDisplay = "";
  })
}

// Decimal button
decimalButton.addEventListener('click', () => {
  if(currentDisplay.includes(".")) return;
  if(currentDisplay === "") currentDisplay += "0";
  currentDisplay += ".";
  updateCurrentUI();
})