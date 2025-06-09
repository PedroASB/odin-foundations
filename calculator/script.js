function displayOutput(content) {
    output.innerText = content;
}

function clearOutput() {
    output.innerText = "";
}

function displayHistory(content) {
    history.innerText = content;
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

function operate(firstOperand, secondOperand, operator) {
    return operations[operator](firstOperand, secondOperand);
}

function isNumber(item) {
    return typeof(item) === "number";
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
    else if (isOperator(stack.peek()) || stack.isEmpty()) {
        currentNumber = 0;
    }


    if (Number.isInteger(currentNumber)) {
        // currentNumber is an integer
        currentNumber = currentNumber * 10 + digit;
    }
    else {
        // currentNumber is a float number

        /**
         * @TODO handle float numbers
         */
    }

    stack.push(currentNumber);
    hasResultBuffer = false;
    clearHistory();
    displayOutput(currentNumber);
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

function handleBinaryOperator(event, operator) {
    if (stack.isEmpty()) return;

    if (isOperator(stack.peek())) {
        stack.pop();
        stack.push(operator);
        return;
    }

    clearHistory();
    stack.push(operator);
}

function handleEquals() {
    /**
     * @TODO check if there are [number operator number] in the stack
     */
    if (stack.size() < 3) {
        return;
    }

    let secondOperand = stack.pop();
    let operator = stack.pop();
    let firstOperand = stack.pop();

    let result = operate(firstOperand, secondOperand, operator);

    if (result === MATH_ERROR) {
        clearCalculator();
        displayHistory(`${firstOperand} ${operator} ${secondOperand}`);
        displayOutput(MATH_ERROR);
        return;
    }

    displayHistory(`${firstOperand} ${operator} ${secondOperand}`);
    displayOutput(result);
    
    stack.push(result);
    hasResultBuffer = true;
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

    clearButton.addEventListener("mousedown", clearCalculator);
    plusButton.addEventListener("mousedown", (event) => handleBinaryOperator(event, PLUS_OPERATOR));
    minusButton.addEventListener("mousedown", (event) => handleBinaryOperator(event, MINUS_OPERATOR));
    timesButton.addEventListener("mousedown", (event) => handleBinaryOperator(event, TIMES_OPERATOR));
    divideButton.addEventListener("mousedown", (event) => handleBinaryOperator(event, DIVIDE_OPERATOR));
    percentButton.addEventListener("mousedown", (event) => handleUnaryOperator(event, PERCENT_OPERATOR));
    plusMinusButton.addEventListener("mousedown", (event) => handleUnaryOperator(event, PLUS_MINUS_OPERATOR));
    equalsButton.addEventListener("mousedown", handleEquals);

    for (let digit = 0; digit <= 9; digit++) {
        let numberButton = document.querySelector(`#digit-${digit}`);
        numberButton.addEventListener("mousedown", (event) => appendDigit(event, digit));
    }

    clearCalculator();
}


// Global constants and variables
const MATH_ERROR = "Math Error";
const PLUS_OPERATOR = "\u002B";
const MINUS_OPERATOR = "\u2212";
const TIMES_OPERATOR = "\u00D7";
const DIVIDE_OPERATOR = "\u00F7";
const PERCENT_OPERATOR = "\u0025";
const PLUS_MINUS_OPERATOR = "\u00B1";
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