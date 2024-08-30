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
  
    const isBoardFilled = () => board.every(row => row.every(column => column !== " "));
  
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
    const getScore = () => myScore;
    const getName = () => myName;

    return {setSymbol, getSymbol, win, getScore, getName};
}

const displayController = ( function (){
    const gameContainer = document.querySelector('.game-container');
    const playerInformation = document.querySelector('.player-information');
    for(let i=0; i<9; i++){
        const gameBox = document.createElement('div');
        gameBox.setAttribute('id', `${i}`)
        gameBox.classList.add('game-box');
        gameContainer.appendChild(gameBox);
    }
    const getCoordinates = (boxNumber) => {
        const row = Math.floor(boxNumber / 3);
        const col = boxNumber % 3;
        return [row, col];
    };
    const getBoxNumber = (row, col) => {
        return row * 3 + col;
    };
    const onClick = (player) => {
        gameContainer.addEventListener('click',(e) => {
        let target = e.target;
        let [row, column] = getCoordinates(target.id);
        gameBoard.playRound(player, row, column);
    })};
    const updateDisplay = () => {
        
    }

      return {onClick};
})();

const playGame = ( function() {
    const player1 = createPlayer(prompt("Enter First Player name: "));
    const player2 = createPlayer(prompt("Enter Second Player name: "));
    
    player1.setSymbol("x");
    player2.setSymbol("o");
    const players = [player1, player2];

    while(!gameBoard.isBoardFilled()){
        for(const player of players) {
            let [x, y] = prompt(`${player} enter (x,y) location: `).split(' ');
            gameBoard.playRound(player, x, y);
            gameBoard.generateBoard();
            if(gameBoard.winRound()){
                console.log(`${player.getName()} wins`)
                gameBoard.clearBoard();
                return;
            }
        }
    }
    if(gameBoard.isFilled() && !gameBoard.winRound()){
        console.log('Tie!');
    }

})();

