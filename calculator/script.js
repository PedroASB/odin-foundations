function displayOutput(content) {
    document.querySelector("#output").innerText = content;
}

function clearOutput() {
    document.querySelector("#output").innerText = "";
}

function displayHistory(content) {
    document.querySelector("#history").innerText = content;
}

function clearHistory() {
    document.querySelector("#history").innerText = "";
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
    displayOutput(currentNumber);
}

function handleBinaryOperator(event, operator) {
    if (stack.isEmpty()) return;

    if (isOperator(stack.peek())) {
        stack.pop();
        stack.push(operator);
        return;
    }

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
const PLUS_OPERATOR = "+";
const MINUS_OPERATOR = "-";
const TIMES_OPERATOR = "*";
const DIVIDE_OPERATOR = "/";
const PERCENT_OPERATOR = "%";
const PLUS_MINUS_OPERATOR = "+-";
let hasResultBuffer;
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