function display(content) {
    output.innerText = content;
}

function operate(firstOperand, secondOperand, operator) {
    let result;

    switch (operator) {
        case "+":
            result = firstOperand + secondOperand;
            break;
        case "-":
            result = firstOperand - secondOperand;
            break;
        case "*":
            result = firstOperand * secondOperand;
            break;
        case "/":
            result = secondOperand === 0? DIVISION_BY_ZERO_ERROR : firstOperand / secondOperand;
            break;
        default:
            break;
    }

    display(result);
    currentNumber = 0;

}

function appendDigit(event, digit) {
    currentNumber = currentNumber * 10 + digit;
    display(currentNumber);
}

function defineOperator(event, symbol) {
    operator = symbol;
    firstOperand = currentNumber;
    currentNumber = 0;
    // highlighOperator(event.target);
}

function highlighOperator(element) {
    let operatorButtons = Array.from(document.querySelectorAll("button.operator"));
    for (button of operatorButtons) {
        button.style.backgroundColor = (element === button) ? 
                                        HIGHLIGHTED_BUTTON_COLOR : 
                                        DEFAULT_BUTTON_COLOR;
    }
}

function initializeEventListeners() {
    let clearButton = document.querySelector("#clear");
    clearButton.addEventListener("click", clearCalculator);

    for (let digit = 0; digit <= 9; digit++) {
        let numberButton = document.querySelector(`#digit-${digit}`);
        numberButton.addEventListener("click", (event) => appendDigit(event, digit));
    }

    let plusButton = document.querySelector("#plus");
    let minusButton = document.querySelector("#minus");
    let multiplyButton = document.querySelector("#multiply");
    let divideButton = document.querySelector("#divide");

    plusButton.addEventListener("click", (event) => defineOperator(event, "+") );
    minusButton.addEventListener("click", (event) => defineOperator(event, "-"));
    multiplyButton.addEventListener("click", (event) => defineOperator(event, "*"));
    divideButton.addEventListener("click", (event) => defineOperator(event, "/"));

    let equalsButton = document.querySelector("#equals");
    equalsButton.addEventListener("click", (event) => {
        secondOperand = currentNumber;
        operate(firstOperand, secondOperand, operator);
    });
    
}


function clearCalculator() {
    output.innerText = currentNumber = 0;
    /**
     * @TODO clear all operands / operator
     */
}


// Begin
const DEFAULT_BUTTON_COLOR = "rgb(255, 255, 255)";
const HIGHLIGHTED_BUTTON_COLOR = "rgb(255, 216, 194)";
const DIVISION_BY_ZERO_ERROR = "Error";
let firstOperand, secondOperand, operator;
let currentNumber = 0;
let output = document.querySelector("#output");


clearCalculator();
initializeEventListeners();