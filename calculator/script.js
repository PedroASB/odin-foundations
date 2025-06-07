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
    displayOutput(0);
    clearHistory();
    stack.clear();
    hasResultBuffer = false;
}

function operate(firstOperand, secondOperand, operator) {
    let result;

    /**
     * @TODO refactor this function
     */

    switch (operator) {
        case PLUS_OPERATOR:
            result = firstOperand + secondOperand;
            break;
        case MINUS_OPERATOR:
            result = firstOperand - secondOperand;
            break;
        case TIMES_OPERATOR:
            result = firstOperand * secondOperand;
            break;
        case DIVIDE_OPERATOR:
            result = secondOperand === 0? DIVISION_BY_ZERO_ERROR : firstOperand / secondOperand;
            break;
        default:
            return; // check this
    }

    return result;
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

    /**
     * @TODO refactor this
     */
    if (hasResultBuffer && isNumber(stack.peek())) {
        stack.pop();
        currentNumber = 0;
    } 
    else if (stack.isEmpty() || isOperator(stack.peek())) {
        currentNumber = 0;
    }
    else if (isNumber(stack.peek())) {
        currentNumber = stack.pop();
    }

    hasResultBuffer = false;


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
    displayOutput(currentNumber);
}

function handleOperator(event, operator) {

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

    /**
     * @TODO refactor this
     */
    if (result === DIVISION_BY_ZERO_ERROR) {
        clearCalculator();
        displayHistory(`${firstOperand} ${operator} ${secondOperand}`);
        displayOutput(result);
        return;
    }

    displayHistory(`${firstOperand} ${operator} ${secondOperand}`);
    displayOutput(result);
    
    stack.push(result);

    console.log("handleEquals: RESULT =", result);
    hasResultBuffer = true;
}

function initializeCalculator() {
    let clearButton = document.querySelector("#clear");
    let plusButton = document.querySelector("#plus");
    let minusButton = document.querySelector("#minus");
    let timesButton = document.querySelector("#times");
    let divideButton = document.querySelector("#divide");
    let equalsButton = document.querySelector("#equals");

    clearButton.addEventListener("mousedown", clearCalculator);
    plusButton.addEventListener("mousedown", (event) => handleOperator(event, PLUS_OPERATOR));
    minusButton.addEventListener("mousedown", (event) => handleOperator(event, MINUS_OPERATOR));
    timesButton.addEventListener("mousedown", (event) => handleOperator(event, TIMES_OPERATOR));
    divideButton.addEventListener("mousedown", (event) => handleOperator(event, DIVIDE_OPERATOR));
    equalsButton.addEventListener("mousedown", handleEquals);

    for (let digit = 0; digit <= 9; digit++) {
        let numberButton = document.querySelector(`#digit-${digit}`);
        numberButton.addEventListener("mousedown", (event) => appendDigit(event, digit));
    }

    clearCalculator();
}


// Global constants and variables
const DIVISION_BY_ZERO_ERROR = "Error";
const PLUS_OPERATOR = "+";
const MINUS_OPERATOR = "-";
const TIMES_OPERATOR = "*";
const DIVIDE_OPERATOR = "/";
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


// Begin
initializeCalculator();