const ROCK = "rock", PAPER = "paper", SCISSORS = "scissors";
const SCORE_TO_WIN = 5;
let computerScore = 0, playerScore = 0, currentRound = 0;

function getComputerChoice() {
    let choice = Math.random();
    if (choice < 1/3) return ROCK;
    if (choice < 2/3) return PAPER;
    return SCISSORS;
}

function getRPSIcon(rps) {
    switch (rps) {
        case ROCK: return "✊";
        case PAPER: return "✋";
        case SCISSORS: return "✌️";
        default: return "";
    }
}

function checkWinning() {
    let winningMessage;

    if (playerScore >= SCORE_TO_WIN) {
        winningMessage = `\n\nCongratulations! You won the game! (${playerScore}-${computerScore})`;
        playerScore = computerScore = currentRound = 0;
        return winningMessage;
    }

    if (computerScore >= SCORE_TO_WIN) { 
        winningMessage = `\n\nYou lost the game! (${playerScore}-${computerScore})`;
        playerScore = computerScore = currentRound = 0;
        return winningMessage;
    }

    return false;
}

function updateResultBox(playerChoice, computerChoice, result) {
    const currentRoundSpan = document.querySelector("#current-round");
    const playerChoiceIcon = document.querySelector("#player-choice .icon");
    const computerChoiceIcon = document.querySelector("#computer-choice .icon");
    const resultMessage = document.querySelector("#result-msg");
    const computerScoreSpan = document.querySelector("#computer-score");
    const playerScoreSpan = document.querySelector("#player-score");

    currentRoundSpan.innerText = currentRound;
    playerChoiceIcon.innerText = getRPSIcon(playerChoice);
    playerChoiceIcon.classList.add(playerChoice); // assuming playerChoice is a string
    computerChoiceIcon.innerText = getRPSIcon(computerChoice);
    computerChoiceIcon.classList.add(computerChoice); // assuming computerChoice is a string
    resultMessage.innerText = result;
    playerScoreSpan.innerText = playerScore;
    computerScoreSpan.innerText = computerScore;

    let winningMessage = checkWinning();

    if (winningMessage) resultMessage.innerText += winningMessage;
}

function playRound(playerChoice, computerChoice) {
    let result;
    currentRound++;

    if (playerChoice === ROCK) {
        if (computerChoice === ROCK) {
            result = "It's a tie! Rock draws with rock!";
        }
        else if (computerChoice === PAPER) {
            result = "You lost! Paper beats rock!";
            computerScore++;
        }
        else if (computerChoice === SCISSORS) {
            result = "You won! Rock beats scissors!";
            playerScore++;
        }
        else {
            console.error("invalid computerChoice");
        }
    }
    else if (playerChoice === PAPER) {
        if (computerChoice === ROCK) {
            result = "You won! Paper beats rock!";
            playerScore++;
        }
        else if (computerChoice === PAPER) {
            result = "It's a tie! Paper draws with paper";
        }
        else if (computerChoice === SCISSORS) {
            result = "You lost! Scissors beats paper!";
            computerScore++;
        }
        else {
            console.error("invalid computerChoice");
        }
    }
    else if (playerChoice === SCISSORS) {
        if (computerChoice === ROCK) {
            result = "You lost! Rock beats scissors!";
            computerScore++;
        }
        else if (computerChoice === PAPER) {
            result = "You won! Scissors beats paper!";
            playerScore++;
        }
        else if (computerChoice === SCISSORS) {
            result = "It's a tie! Scissors draws with scissors";
        }
        else {
            console.error("invalid computerChoice");
        }
    }
    else {
        console.error("invalid playerChoice");
    }

    updateResultBox(playerChoice, computerChoice, result);
}

function startGame(event) {
    const rockButton = document.querySelector("#rock-btn");
    const paperButton = document.querySelector("#paper-btn");
    const scissorsButton = document.querySelector("#scissors-btn");
    const scoreToWin = document.querySelector("#score-to-win");

    rockButton.addEventListener("click", () => playRound(ROCK, getComputerChoice()));
    paperButton.addEventListener("click", () => playRound(PAPER, getComputerChoice()));
    scissorsButton.addEventListener("click", () => playRound(SCISSORS, getComputerChoice()));
    scoreToWin.innerText = SCORE_TO_WIN;

    const buttons = document.querySelectorAll("button");

    for (btn of buttons) {
        btn.addEventListener("mouseenter", (event) => {
            event.target.style.backgroundColor = "rgb(112, 192, 139)";
            event.target.style.borderColor = "rgba(57, 148, 87, 0.42)";
        });
        btn.addEventListener("mouseleave", (event) => {
            event.target.style.backgroundColor = "rgb(77, 180, 111)";
            event.target.style.borderColor = "rgba(39, 145, 74, 0.418)";
        });
    }
}


// Begin
startGame();
