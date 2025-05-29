const ROCK = "rock", PAPER = "paper", SCISSORS = "scissors";
const SCORE_TO_WIN = 5;
let computerScore = 0, playerScore = 0, currentRound = 0;

function getComputerChoice() {
    let choice = Math.random();
    if (choice < 1/3) return ROCK;
    if (choice < 2/3) return PAPER;
    return SCISSORS;
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
        console.error("invalid humanChoice");
    }

    const resultBox = document.querySelector("#result-box");
    const roundLog = document.createElement("div");
    const computerScoreSpan = document.querySelector("#computer-score");
    const playerScoreSpan = document.querySelector("#player-score");
    let roundMessage, winningMessage;

    roundMessage =  `Round: ${currentRound}\n\n` + 
                    `You chose ${playerChoice.toUpperCase()}!\n` + 
                    `The computer chose ${computerChoice.toUpperCase()}!\n\n` + 
                    result;

    if (playerScore >= SCORE_TO_WIN) {
        winningMessage = `\n\nCongratulations! You won the game! (${playerScore}-${computerScore})`;
        roundMessage += winningMessage;
        playerScore = computerScore = currentRound = 0;
    }
    else if (computerScore >= SCORE_TO_WIN) { 
        winningMessage = `\n\nYou lost the game! (${playerScore}-${computerScore})`;
        roundMessage += winningMessage;
        playerScore = computerScore = currentRound = 0;
    }

    roundLog.innerText = roundMessage;
    roundLog.id = "round-log";

    resultBox.innerHTML = '';
    resultBox.appendChild(roundLog);

    playerScoreSpan.innerText = playerScore;
    computerScoreSpan.innerText = computerScore;
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
            event.target.style.backgroundColor = "rgb(72, 132, 134)";
        });
        btn.addEventListener("mouseleave", (event) => {
            event.target.style.backgroundColor = "rgb(95, 158, 160)";
        });
    }
}


// Begin
startGame();
