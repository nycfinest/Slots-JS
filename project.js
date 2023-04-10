// 1. Deposit some money.
// 2. Determine number of lines to bet on.
// 3. Collect a bet amount.
// 4. Spin the slot machine
// 5. Check if the user won.
// 6. Give the user their winning or take their bet.
// 7. Play again or handle situation where user has no money left.

const prompt = require("prompt-sync")(); 


const ROWS = 3;
const COLS = 3;

const SYMBOLS_COUNT = {
    "A": 2,
    "B": 4,
    "C": 6,
    "D": 8
}

const SYMBOL_VALUES = {
    "A": 5,
    "B": 4,
    "C": 3,
    "D": 2
}

// Ask user for valid deposit.
const deposit = () => {
while (true) {
    const depositAmount = prompt("Enter a deposit amount: ")
    const numberDepositAmount = parseFloat(depositAmount);

    if (isNaN(numberDepositAmount) || numberDepositAmount <= 0) {
        console.log("Invalid deposit amount, try again.");
        } else {
            return numberDepositAmount;
        }
    }  
};

// Get number of lines/rows user wants to bet on.
const getNumberOfLines = () => {
    while (true) {
        const lines = prompt("Enter the number of lines to bet on (1-3): ")
        const numberOfLines = parseFloat(lines);
    
        if (isNaN(numberOfLines) || numberOfLines <= 0 || numberOfLines > 3) {
            console.log("Invalid number of lines, try again.");
            } else {
                return numberOfLines;
            }
        }  
};

// Get the bet, valid bet amount based on balance and lines they are betting on.
const getBet = (balance, lines) => {
    while (true) {
        const bet = prompt("Enter the bet per line: ")
        const numberBet = parseFloat(bet);
    
        if (isNaN(numberBet) || numberBet <= 0 || numberBet > balance / lines) {
            console.log("Invalid bet, try again.");
            } else {
                return numberBet;
            }
        }
};

// Spin the slot machine.
const spin = () => { // Generate all possible symbols in each reel.
    const symbols = [];
    for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
         for (let i = 0; i < count; i++) {
            symbols.push(symbol);
        };
    } // Generate array of all available symbols.

    const reels = [[], [], []]; // Temporary array with all reels.
    for (let i = 0; i < COLS; i++) {
        reels.push([]);
        const reelSymbols = [...symbols]; 
        for (let j = 0; j < ROWS; j++) {
           const randomIndex = Math.floor(Math.random() * reelSymbols.length); // Randomly gen one of symbols.
           const selectedSymbol = reelSymbols[randomIndex];
           reels[i].push(selectedSymbol);
           reelSymbols.splice(randomIndex, 1); 
        }
    }

    return reels;
};

// Helper function, convert all cols into all rows - easier to check if user won + print.
const transpose = (reels) => {
    const rows = [];

    for (let i = 0; i < ROWS; i++) {
        rows.push([]);
        for (let j = 0; j < COLS; j++) {
            rows[i].push(reels[j][i]); // going through every col, acccessing row and element i
        }
    }
    return rows;
}
// Helps print rows in better formatting.
const printRows = (rows) => {
    for (const row of rows) {
        let rowString = "";
        for (const [i, symbol] of row.entries()) {
            rowString += symbol
            if (i != row.length - 1) {
                rowString += " | ";
            }
        }
        console.log(rowString);
    }
};

// Determining all of the winnings the user won from all rows of the slot machine.
const getWinnings = (rows, bet, lines) => {
    let winnings = 0;

    for (let row = 0; row < lines; row++) {
        const symbols = rows[row];
        let allSame = true;

        for (const symbol of symbols) {
            if (symbol != symbols[0]) {
                allSame = false;
                break;
            }
        }

        if (allSame) {
            winnings += bet * SYMBOL_VALUES[symbols[0]];
        }
    }
    return winnings;
};

// Continue to play the game till user runs out of money or choose not to play.
const game = () => {

  let balance = deposit();

  while (true) {
    console.log("You have a balance of $" + balance);
    const numberOfLines = getNumberOfLines();
    const bet = getBet(balance, numberOfLines);
    balance -= bet * numberOfLines;
    const reels = spin();
    const rows = transpose(reels);
    printRows(rows);
    const winnings = getWinnings(rows, bet, numberOfLines);
    balance += winnings;
        console.log("You won, $" + winnings.toString());
    if (balance <= 0) {
        console.log("You ran out of money!");
        break;
    }

    const playAgain = prompt("Do you want ot play again (y/n)? ");

    if (playAgain != "y") break;
  }   
};

game();