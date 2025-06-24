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
    else if (currentNumber.toString().length < digitsLimit) {
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
    changeCalculatorStyle(MODERN_STYLE);
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
    else if (event.key === SHIFT_KEY) {
        handleUnaryOperator(event, PLUS_MINUS_OPERATOR);
    }
    else if (event.key === CTRL_KEY) {
        handleUnaryOperator(event, PERCENT_OPERATOR);
    }
}

function changeCalculatorStyle(style) {
    const calculator = document.querySelector("#calculator");
    const display = document.querySelector("#display");
    const calculatorButtons = Array.from(document.querySelectorAll("#calc-buttons button"));
    const history = document.querySelector("#history");
    const displayOutput = document.querySelector("#output");
    const firstRowButtons = Array.from(document.querySelectorAll("#row-1 button"));
    const operatorsButtons = Array.from(document.querySelectorAll("#calc-buttons button.operator, #calc-buttons button#equals"));

    switch (style) {
        case MODERN_STYLE:
            calculator.style.padding = "16px";
            calculator.style.borderRadius = "42px";
            calculator.style.border = "8px solid rgba(60, 60, 60, 0.25)";
            calculator.style.backgroundColor = "rgb(32, 32, 32)";
            display.style.backgroundColor = "rgb(32, 32, 32)";
            history.style.color = "rgb(190, 193, 196)";
            displayOutput.style.color = "rgb(255, 255, 255)";
            calculatorButtons.forEach((button) => {
                button.style.margin = "6px";
                button.style.width = "70px";
                button.style.height = "70px";
                button.style.borderRadius = "360px";
                button.style.backgroundColor = "rgb(63, 63, 63)";
                button.addEventListener("mouseenter", (event) => {
                    event.target.style.backgroundColor = "rgb(119, 119, 119)";
                });
                button.addEventListener("mouseleave", (event) => {
                    event.target.style.backgroundColor = "rgb(63, 63, 63)";
                });
            });
            firstRowButtons.forEach(button => {
                button.style.backgroundColor = "rgb(128, 128, 128)";
                button.addEventListener("mouseenter", (event) => {
                    event.target.style.backgroundColor = "rgb(167, 167, 167)";
                });
                button.addEventListener("mouseleave", (event) => {
                    event.target.style.backgroundColor = "rgb(128, 128, 128)";
                });
            });
            operatorsButtons.forEach(button => {
                button.style.backgroundColor = "rgb(255, 153, 0)";
                button.addEventListener("mouseenter", (event) => {
                    event.target.style.backgroundColor = "rgb(255, 189, 89)";
                });
                button.addEventListener("mouseleave", (event) => {
                    event.target.style.backgroundColor = "rgb(255, 153, 0)";
                });
            });
            break;

        case CLASSIC_STYLE:
            calculator.style.padding = "16px";
            calculator.style.borderRadius = "42px";
            calculator.style.border = "8px solid rgba(60, 60, 60, 0.25)";
            calculator.style.backgroundColor = "rgb(236, 227, 209)";
            display.style.backgroundColor = "rgb(15, 117, 86)";
            history.style.color = "rgb(190, 193, 196)";
            displayOutput.style.color = "rgb(255, 255, 255)";
            calculatorButtons.forEach((button) => {
                button.style.margin = "6px";
                button.style.width = "70px";
                button.style.height = "70px";
                button.style.borderRadius = "16px";
                button.style.backgroundColor = "rgb(87, 87, 87)";
                button.addEventListener("mouseenter", (event) => {
                    event.target.style.backgroundColor = "rgb(119, 119, 119)";
                });
                button.addEventListener("mouseleave", (event) => {
                    event.target.style.backgroundColor = "rgb(87, 87, 87)";
                });
            });
            firstRowButtons.forEach(button => {
                button.style.backgroundColor = "rgb(128, 128, 128)";
                button.addEventListener("mouseenter", (event) => {
                    event.target.style.backgroundColor = "rgb(167, 167, 167)";
                });
                button.addEventListener("mouseleave", (event) => {
                    event.target.style.backgroundColor = "rgb(128, 128, 128)";
                });
            });
            operatorsButtons.forEach(button => {
                button.style.backgroundColor = "rgb(255, 153, 0)";
                button.addEventListener("mouseenter", (event) => {
                    event.target.style.backgroundColor = "rgb(255, 189, 89)";
                });
                button.addEventListener("mouseleave", (event) => {
                    event.target.style.backgroundColor = "rgb(255, 153, 0)";
                });
            });
            break;

        case MINT_STYLE:
            calculator.style.padding = "4px";
            calculator.style.borderRadius = "16px";
            calculator.style.border = "8px solid rgba(132, 180, 125, 0.25)";
            calculator.style.backgroundColor = "rgb(178, 230, 185)";
            display.style.backgroundColor = "rgb(178, 230, 185)";
            history.style.color = "rgb(69, 139, 73)";
            displayOutput.style.color = "rgb(37, 73, 29)";
            calculatorButtons.forEach((button) => {
                button.style.margin = "1px";
                button.style.width = "78px";
                button.style.height = "78px";
                button.style.borderRadius = "2px";
                button.style.backgroundColor = "rgb(47, 158, 93)";
                button.addEventListener("mouseenter", (event) => {
                    event.target.style.backgroundColor = "rgb(85, 201, 133)";
                });
                button.addEventListener("mouseleave", (event) => {
                    event.target.style.backgroundColor = "rgb(47, 158, 93)";
                });
            });
            firstRowButtons.forEach(button => {
                button.style.backgroundColor = "rgb(4, 112, 49)";
                button.addEventListener("mouseenter", (event) => {
                    event.target.style.backgroundColor = "rgb(33, 165, 88)";
                });
                button.addEventListener("mouseleave", (event) => {
                    event.target.style.backgroundColor = "rgb(4, 112, 49)";
                });
            });
            operatorsButtons.forEach(button => {
                button.style.backgroundColor = "rgb(29, 204, 67)";
                button.addEventListener("mouseenter", (event) => {
                    event.target.style.backgroundColor = "rgb(116, 223, 139)";
                });
                button.addEventListener("mouseleave", (event) => {
                    event.target.style.backgroundColor = "rgb(29, 204, 67)";
                });
            });
            break;

    }
}

function handleStyleButton(event, style) {
    const styleButtons = Array.from(document.querySelectorAll("#style-buttons button"));
    styleButtons.forEach((button) => button.style.backgroundColor = "rgb(233, 233, 233)");
    event.target.style.backgroundColor = "rgb(168, 194, 218)";
    changeCalculatorStyle(style);
}

function initializeInteractions() {
    const modernButton = document.querySelector("#modern-btn");
    const classicButton = document.querySelector("#classic-btn");
    const mintButton = document.querySelector("#mint-btn");

    modernButton.addEventListener("click", (event) => handleStyleButton(event, MODERN_STYLE));
    classicButton.addEventListener("click", (event) => handleStyleButton(event, CLASSIC_STYLE));
    mintButton.addEventListener("click", (event) => handleStyleButton(event, MINT_STYLE));
}

// Global constants and variables
const EQUALS_KEY = "=";
const ENTER_KEY = "Enter";
const DOT_KEY = ".";
const BACKSPACE_KEY = "Backspace";
const DELETE_KEY = "Delete";
const SHIFT_KEY = "Shift";
const CTRL_KEY = "Control";
const MATH_ERROR = "Math Error";
const PLUS_OPERATOR = "\u002B";
const MINUS_OPERATOR = "\u2212";
const TIMES_OPERATOR = "\u00D7";
const DIVIDE_OPERATOR = "\u00F7";
const PERCENT_OPERATOR = "\u0025";
const PLUS_MINUS_OPERATOR = "\u00B1";
const maxNumber = 9_999_999_999_999;
const digitsLimit = 13;
const MODERN_STYLE = 1, CLASSIC_STYLE = 2, MINT_STYLE = 3;
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