function formatNumber(number) {
    if (Math.abs(number) > maxNumber) { 
        return Number(number).toExponential(3);
    }

    let integerPart, fractionalPart, formatedNumber;

    [integerPart, fractionalPart] = number.toString().split('.');
    formatedNumber = numberFormatter.format(integerPart);

    if (number.toString().includes('.')) {
        formatedNumber += '.';
    }

    if (fractionalPart) {
        formatedNumber += fractionalPart;
    }

    return formatedNumber;
}

function displayOutput(content) {
    if (isNumber(content)) content = formatNumber(content);
    let contentSize = content.toString().length;
    output.style.fontSize = contentSize > 10 ?
                            `${520 * (1 / contentSize)}px` :
                            "52px";
    output.innerText = content;
}

function displayHistory(firstOperand, operator, secondOperand) {
    let content = `${formatNumber(firstOperand)} ${operator} ${formatNumber(secondOperand)}`;
    let contentSize = content.toString().length;
    history.style.fontSize = contentSize > 22 ?
                             `${528 * (1 / contentSize)}px` :
                             "24px";
    history.innerText = content;
}

function clearOutput() {
    output.innerText = "";
}

function clearHistory() {
    history.innerText = "";
}

function clearCalculator() {
    clearHistory();
    displayOutput(0);
    stack.clear();
    stack.push(0);
    hasResultBuffer = false;
}

function operate(firstOperand, operator, secondOperand) {
    let result = operations[operator](Number(firstOperand), Number(secondOperand));
    result = result.toString();

    if (result === MATH_ERROR) {
        clearCalculator();
        displayHistory(firstOperand, operator, secondOperand);
        displayOutput(MATH_ERROR);
        return;
    }

    displayHistory(firstOperand, operator, secondOperand);
    displayOutput(result);
    
    stack.push(result);
    hasResultBuffer = true;
}

function isNumber(item) {
    return !Number.isNaN(Number(item));
}

function isOperator(item) {
    switch (item) {
        case PLUS_OPERATOR: 
        case MINUS_OPERATOR: 
        case TIMES_OPERATOR: 
        case DIVIDE_OPERATOR:
            return true;
        default:
            return false;
    }
}

function appendDigit(event, digit) {
    let currentNumber;

    if (isNumber(stack.peek())) {
        currentNumber = stack.pop();
        if (hasResultBuffer) currentNumber = 0;
    }
    else if (stack.isEmpty() || isOperator(stack.peek())) {
        currentNumber = 0;
    }

    if (currentNumber === 0) {
        currentNumber = `${digit}`;
    }
    else if (currentNumber.length < digitsLimit) {
        currentNumber = currentNumber + `${digit}`;
    }

    stack.push(currentNumber);
    clearHistory();
    displayOutput(currentNumber);
    hasResultBuffer = false;
}

function handleUnaryOperator(event, operator) {
    if (stack.isEmpty() || !isNumber(stack.peek())) return;
    currentNumber = stack.pop();

    switch (operator) {
        case PERCENT_OPERATOR:
            currentNumber /= 100;
            break;
        case PLUS_MINUS_OPERATOR:
            currentNumber = -currentNumber;
            break;
    }

    stack.push(currentNumber);
    clearHistory();
    displayOutput(currentNumber);
}

function handleBinaryOperator(event, currentOperator) {
    if (stack.isEmpty()) return;

    if (isOperator(stack.peek())) {
        stack.pop();
        stack.push(currentOperator);
        return;
    }

    if (stack.size() >= 3 && 
        isNumber(stack.peek(0)) &&
        isOperator(stack.peek(1)) &&
        isNumber(stack.peek(2))) {
        
        let secondOperand = stack.pop();
        let previousOperator = stack.pop();
        let firstOperand = stack.pop();

        operate(firstOperand, previousOperator, secondOperand);
        stack.push(currentOperator);
        return;
    }

    clearHistory();
    stack.push(currentOperator);
}

function handleEquals() {
    if (stack.size() < 3 || 
        !isNumber(stack.peek(0)) || 
        !isOperator(stack.peek(1)) || 
        !isNumber(stack.peek(2))) {
        return;
    }

    let secondOperand = stack.pop();
    let operator = stack.pop();
    let firstOperand = stack.pop();

    operate(firstOperand, operator, secondOperand);
}

function handleDot() {
    if (stack.isEmpty() || 
        !isNumber(stack.peek()) || 
        stack.peek().toString().includes('.')) {
        return;
    }

    currentNumber = stack.pop();
    currentNumber += '.';
    stack.push(currentNumber);
    clearHistory();
    displayOutput(currentNumber);
    hasResultBuffer = false;
}

function handleDelete() {
    if (stack.isEmpty()) return;

    if (isOperator(stack.peek())) {
        stack.pop();
        return;
    }

    if (isNumber(stack.peek())) {
        currentNumber = stack.pop();
        currentNumber = currentNumber.toString().slice(0, -1);
        if (currentNumber === '') currentNumber = 0;
        stack.push(currentNumber);
        clearHistory();
        displayOutput(currentNumber);
        hasResultBuffer = false;
    }
}

function initializeCalculator() {
    history = document.querySelector("#history");
    output = document.querySelector("#output");
    let clearButton = document.querySelector("#clear");
    let plusButton = document.querySelector("#plus");
    let minusButton = document.querySelector("#minus");
    let timesButton = document.querySelector("#times");
    let divideButton = document.querySelector("#divide");
    let percentButton = document.querySelector("#percent");
    let plusMinusButton = document.querySelector("#plus-minus");
    let equalsButton = document.querySelector("#equals");
    let dotButton  = document.querySelector("#dot");
    let deleteButton = document.querySelector("#delete");

    clearButton.addEventListener("mousedown", clearCalculator);
    plusButton.addEventListener("mousedown", (event) => handleBinaryOperator(event, PLUS_OPERATOR));
    minusButton.addEventListener("mousedown", (event) => handleBinaryOperator(event, MINUS_OPERATOR));
    timesButton.addEventListener("mousedown", (event) => handleBinaryOperator(event, TIMES_OPERATOR));
    divideButton.addEventListener("mousedown", (event) => handleBinaryOperator(event, DIVIDE_OPERATOR));
    percentButton.addEventListener("mousedown", (event) => handleUnaryOperator(event, PERCENT_OPERATOR));
    plusMinusButton.addEventListener("mousedown", (event) => handleUnaryOperator(event, PLUS_MINUS_OPERATOR));
    equalsButton.addEventListener("mousedown", handleEquals);
    dotButton.addEventListener("mousedown", handleDot);
    deleteButton.addEventListener("mousedown", handleDelete);

    for (let digit = 0; digit <= 9; digit++) {
        let numberButton = document.querySelector(`#digit-${digit}`);
        numberButton.addEventListener("mousedown", (event) => appendDigit(event, digit));
    }

    document.addEventListener("keydown", handleKeyDown);

    clearCalculator();
}

function isNumberKey(key) {
    return Number.isInteger(parseInt(key));
}

function isResultKey(key) {
    return key === EQUALS_KEY || key === ENTER_KEY;
}

function isBinaryOperatorKey(key) {
    switch (key) {
        case "+":
            return PLUS_OPERATOR;
        case "-":
            return MINUS_OPERATOR;
        case "*":
            return TIMES_OPERATOR;
        case "/":
            return DIVIDE_OPERATOR;
    }
    return false;
}

function handleKeyDown(event) {
    let operator;
    if (isNumberKey(event.key)) {
        appendDigit(event, parseInt(event.key));
    }
    else if (operator = isBinaryOperatorKey(event.key)) {
        handleBinaryOperator(event, operator);
    }
    else if (isResultKey(event.key)) {
        handleEquals();
    }
    else if (event.key === DOT_KEY) {
        handleDot();
    }
    else if (event.key === DELETE_KEY) {
        clearCalculator();
    }
    else if (event.key === BACKSPACE_KEY) {
        handleDelete();
    }
}

function changeCalculatorStyle(event, style) {
    const calculatorBackground = document.querySelector("#calculator");
    const calculatorDisplay = document.querySelector("#display");
    const calculatorButtons = Array.from(document.querySelectorAll("#calc-buttons button"));

    switch (style) {
        case MODERN_STYLE:
            calculatorBackground.style.backgroundColor = "rgb(32, 32, 32)";
            calculatorDisplay.style.backgroundColor = "rgb(32, 32, 32)";
            
            calculatorButtons.forEach((button) => {
                button.style.borderRadius = "360px";
            });
            event.target.style.backgroundColor = "rgb(168, 194, 218)";
            event.target.nextElementSibling.style.backgroundColor = "rgb(233, 233, 233)";
            break;

        case CLASSIC_STYLE:
            calculatorBackground.style.backgroundColor = "rgb(236, 227, 209)";
            calculatorDisplay.style.backgroundColor = "rgb(15, 117, 86)";
            calculatorButtons.forEach((button) => {
                button.style.borderRadius = "16px";
            });
            event.target.style.backgroundColor = "rgb(168, 194, 218)";
            event.target.previousElementSibling.style.backgroundColor = "rgb(233, 233, 233)";
            break;
    }
}

function initializeInteractions() {
    const modernButton = document.querySelector("#modern-btn");
    const classicButton = document.querySelector("#classic-btn");

    modernButton.addEventListener("click", (event) => changeCalculatorStyle(event, MODERN_STYLE));
    classicButton.addEventListener("click", (event) => changeCalculatorStyle(event, CLASSIC_STYLE));
}


// Global constants and variables
const EQUALS_KEY = "=";
const ENTER_KEY = "Enter";
const DOT_KEY = ".";
const BACKSPACE_KEY = "Backspace";
const DELETE_KEY = "Delete";
const MATH_ERROR = "Math Error";
const PLUS_OPERATOR = "\u002B";
const MINUS_OPERATOR = "\u2212";
const TIMES_OPERATOR = "\u00D7";
const DIVIDE_OPERATOR = "\u00F7";
const PERCENT_OPERATOR = "\u0025";
const PLUS_MINUS_OPERATOR = "\u00B1";
const maxNumber = 9_999_999_999_999;
const digitsLimit = 13;
const MODERN_STYLE = 1, CLASSIC_STYLE = 2;
const numberFormatter = Intl.NumberFormat("en-US");
let history, output, hasResultBuffer;
let stack = {
    content: [],
    push(...items) {
        this.content.push(...items);
    },
    pop() {
        return this.content.pop();
    },
    size() {
        return this.content.length;
    },
    peek(index=0) {
        if (this.isEmpty() || index < 0 || index > this.size() - 1) return null;
        return this.content[this.size() - 1 - index];
    },
    isEmpty() {
        return this.size() === 0;
    },
    clear() {
        this.content = [];
    }
};
let operations = {
    [PLUS_OPERATOR]: (firstOperand, secondOperand) => firstOperand + secondOperand,
    [MINUS_OPERATOR]: (firstOperand, secondOperand) => firstOperand - secondOperand,
    [TIMES_OPERATOR]: (firstOperand, secondOperand) => firstOperand * secondOperand,
    [DIVIDE_OPERATOR]: (firstOperand, secondOperand) => secondOperand === 0 ? 
                                                        MATH_ERROR :
                                                        firstOperand / secondOperand
}


// Begin
initializeCalculator();
initializeInteractions();