const gameBoard = (function () {
    const board = Array(3).fill(" ").map(() => Array(3).fill(" "));
    const ROW_INDICES = [[[0,0],[0,1],[0,2]],[[1,0],[1,1],[1,2]],[[2,0],[2,1],[2,2]]];
    const COLUMN_INDICES = [[[0,0],[1,0],[2,0]],[[0,1],[1,1],[2,1]],[[0,2],[1,2],[2,2]]];
    const DIAGONAL_INDICES = [[[0,0],[1,1],[2,2]],[[0,2],[1,1],[2,0]]];
  
    const playRound = (player, row, column) => {
      if (board[row][column] !== " ") {
        console.log("Cell is already occupied");
        return;
      }
      board[row][column] = player.getSymbol();
    };
  
    const generateBoard = () => {
      console.table(board);
    };
  
    const clearBoard = () => {
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          board[i][j] = ' ';
        }
      }
      console.table(board);
    };
  
    const isBoardFilled = () => {
        const filled = board.every(row => row.every(column => column !== " "));
        const tie = !winRound();
        return { filled, tie };
      };

    const isLineFilled = (line) => {
      const cells = line.map(index => board[index[0]][index[1]]);
      return cells.every(cell => cell === cells[0] && cell !== " ");
    };
  
    const isWinningLine = (lineIndices) => lineIndices.some(line => isLineFilled(line));
  
    const winRound = () => {
      const indices = [ROW_INDICES, COLUMN_INDICES, DIAGONAL_INDICES];
      const types = ['Row', 'Column', 'Diagonal'];
  
      for (let i = 0; i < indices.length; i++) {
        if (isWinningLine(indices[i])) {
          console.log(`${types[i]} is filled`);
          return true;
        }
      }
  
      return false;
    };
  
    return { playRound, isBoardFilled, clearBoard, winRound, generateBoard };
  })();

function createPlayer(name){
    let myName = name;
    let myScore = 0;
    let mySymbol;
    const setSymbol = (symbol) => mySymbol = symbol;
    const getSymbol = () => mySymbol;
    const win = () => myScore++;
    const resetScore = () => myScore = 0;
    const getScore = () => myScore;
    const getName = () => myName;

    return {setSymbol, getSymbol, win, getScore, getName, resetScore};
}

const displayController = (function() {
    const gameContainer = document.querySelector('.game-container');
    const playerInformation = document.querySelector('.player-information');
    let currentPlayer;

    const setCurrentPlayer = (player) => {
        currentPlayer = player;
      };
    // Display components
    const createGameBoxes = ( function(){
        for (let i = 0; i < 9; i++) {
            const gameBox = document.createElement('div');
            gameBox.classList.add('game-box');
            gameBox.id = i;
            gameContainer.appendChild(gameBox);
          }
    })();
    const clearDisplay = () => {
        const gameBoxes = document.querySelectorAll('.game-box');
        gameBoxes.forEach((box) => {
          box.textContent = '';
        });
      };
    const updateDisplay = (boxNumber, symbol) => {
        const box = document.getElementById(boxNumber);
        box.textContent = symbol;
    };
    const scoreDisplay = (players) => {
        playerInformation.textContent = `Player1: ${players[0].getScore()} | Player2: ${players[1].getScore()}`
    };
    // Helper functions
    const getCoordinates = (boxNumber) => {
      const row = Math.floor(boxNumber / 3);
      const col = boxNumber % 3;
      return [row, col];
    };
  
    const getBoxNumber = (row, col) => {
      return row * 3 + col;
    };
  
    return {setCurrentPlayer, updateDisplay, scoreDisplay, clearDisplay, getCoordinates};
  })();
  
  const playGame = (function() {
    const player1 = createPlayer('player1');
    const player2 = createPlayer('player2');
  
    player1.setSymbol("x");
    player2.setSymbol("o");
    const players = [player1, player2];
  
    displayController.scoreDisplay(players);
    displayController.setCurrentPlayer(player1);

    let currentPlayer = player1;
    const gameContainer = document.querySelector('.game-container');
    gameContainer.addEventListener('click', (e) => {

        const target = e.target;
        let [row, column] = displayController.getCoordinates(target.id);
        gameBoard.playRound(currentPlayer, row, column);
        displayController.updateDisplay(target.id, currentPlayer.getSymbol());

        if (gameBoard.winRound()) {
            console.log(`${currentPlayer.getName()} is the winner!`);
            currentPlayer.win();
            displayController.scoreDisplay(players);
            gameBoard.clearBoard();
            displayController.clearDisplay();

        }else if(gameBoard.isBoardFilled().filled){
            if(gameBoard.isBoardFilled().tie){
                 console.log("It's a tie");
            }
            console.log("Game over!");
            gameBoard.clearBoard();
            displayController.clearDisplay();
        }
        currentPlayer = currentPlayer === player1 ? player2 : player1;
        displayController.setCurrentPlayer(currentPlayer);
    })
  })();