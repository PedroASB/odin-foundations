let computerScore = 0, humanScore = 0

function getComputerChoice() {
    let choice = Math.random()
    if (choice < 1/3) return "rock"
    if (choice < 2/3) return "paper"
    return "scissors"
}

function getHumanChoice(promptMessage="") {
    let choice = window.prompt(promptMessage).trim().toLowerCase()
    switch (choice) {
        case "1":
        case "rock":
            return "rock"
        case "2":
        case "paper":
            return "paper"
        case "3":
        case "scissors":
            return "scissors"
        default: // invalid choice
            return -1
    }
}

function playRound(humanChoice, computerChoice) {
    let roundMessage = "ROCK PAPER SCISSORS\n\n" + 
                        `You chose ${humanChoice.toUpperCase()}!\n` + 
                        `The computer chose ${computerChoice.toUpperCase()}!\n\n`

    if (humanChoice === "rock") {
        if (computerChoice === "rock") {
            roundMessage += "It's a tie! Rock draws with rock!"
        }
        else if (computerChoice === "paper") {
            roundMessage += "You lost! Paper beats rock!"
            computerScore++
        }
        else if (computerChoice === "scissors") {
            roundMessage += "You won! Rock beats scissors!"
            humanScore++
        }
        else {
            console.error("invalid computerChoice")
        }
    }
    else if (humanChoice === "paper") {
        if (computerChoice === "rock") {
            roundMessage += "You won! Paper beats rock!"
            humanScore++
        }
        else if (computerChoice === "paper") {
            roundMessage += "It's a tie! Paper draws with paper"
        }
        else if (computerChoice === "scissors") {
            roundMessage += "You lost! Scissors beats paper!"
            computerScore++
        }
        else console.error("invalid computerChoice")
    }
    else if (humanChoice === "scissors") {
        if (computerChoice === "rock") {
            roundMessage += "You lost! Rock beats scissors!"
            computerScore++
        }
        else if (computerChoice === "paper") {
            roundMessage += "You won! Scissors beats paper!"
            humanScore++
        }
        else if (computerChoice === "scissors") {
            roundMessage += "It's a tie! Scissors draws with scissors"
        }
        else {
            console.error("invalid computerChoice")
        }
    }
    else {
        console.error("invalid humanChoice")
    }

    window.alert(roundMessage)
}

function playGame(nRounds, promptMessage) {
    while (nRounds--) {
        let humanChoice = getHumanChoice(promptMessage)
        let computerChoice = getComputerChoice()
        playRound(humanChoice, computerChoice)
    }
    let finalMessage = "ROCK PAPER SCISSORS\n\n" + 
                        "Final Score\n\n" + 
                        `Your score: ${humanScore}\n` + 
                        `Computer's score: ${computerScore}\n\n`
    if (humanScore > computerScore) 
        finalMessage += "Congratulations! You won the game!"
    else if (humanScore < computerScore)
        finalMessage += "You lost the game!"
    else
        finalMessage += "It's a tie!"
    window.alert(finalMessage)
}


// begin
let promptMessage = "ROCK PAPER SCISSORS\n\n" + 
                    "Make your choice!\n" + 
                    "1 - Rock\n" + 
                    "2 - Paper\n" + 
                    "3 - Scissors\n"
let nRounds = Number.parseInt(
    window.prompt("ROCK PAPER SCISSORS\n\nHow many rounds do you want to play?")
)
playGame(nRounds, promptMessage)
