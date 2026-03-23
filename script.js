function showGame(game) {
  document.getElementById('home-screen').style.display = 'none';
  document.getElementById('rps-screen').style.display = 'none';
  document.getElementById('num-screen').style.display = 'none';
  document.getElementById('ttt-screen').style.display = 'none';
  document.getElementById(game + '-screen').style.display = 'block';
  if (game === 'num') numInit();
  if (game === 'ttt') tttInit();
}

function showHome() {
  rpsStopAuto();
  document.getElementById('home-screen').style.display = 'block';
  document.getElementById('rps-screen').style.display = 'none';
  document.getElementById('num-screen').style.display = 'none';
  document.getElementById('ttt-screen').style.display = 'none';
}

let rpsScore = JSON.parse(localStorage.getItem('rpsScore')) || { wins: 0, losses: 0, ties: 0 };
let rpsIsAuto = false;
let rpsIntervalID;

function rpsUpdateScore() {
  document.getElementById('rps-score').innerHTML =
    'Wins: ' + rpsScore.wins + ', Losses: ' + rpsScore.losses + ', Ties: ' + rpsScore.ties;
}

rpsUpdateScore();

function rpsPickMove() {
  const r = Math.random();
  if (r < 1 / 3) return 'Rock';
  else if (r < 2 / 3) return 'Paper';
  else return 'Scissors';
}

function rpsPlay(playerMove) {
  const computer = rpsPickMove();
  let result = '';

  if (playerMove === 'Rock') {
    if (computer === 'Rock') result = 'Tie';
    else if (computer === 'Paper') result = 'You Lose';
    else result = 'You Win';
  } else if (playerMove === 'Paper') {
    if (computer === 'Rock') result = 'You Win';
    else if (computer === 'Paper') result = 'Tie';
    else result = 'You Lose';
  } else if (playerMove === 'Scissors') {
    if (computer === 'Rock') result = 'You Lose';
    else if (computer === 'Paper') result = 'You Win';
    else result = 'Tie';
  }

  if (result === 'You Win') rpsScore.wins++;
  else if (result === 'You Lose') rpsScore.losses++;
  else rpsScore.ties++;

  localStorage.setItem('rpsScore', JSON.stringify(rpsScore));

  const moveEmoji = { Rock: '🪨', Paper: '📄', Scissors: '✂️' };
  document.getElementById('rps-outcome').innerHTML = result;
  document.getElementById('rps-moves').innerHTML =
    'You: ' + moveEmoji[playerMove] + '  VS  Computer: ' + moveEmoji[computer];
  rpsUpdateScore();
}

function rpsReset() {
  rpsScore.wins = 0;
  rpsScore.losses = 0;
  rpsScore.ties = 0;
  localStorage.removeItem('rpsScore');
  rpsUpdateScore();
}

function rpsAutoplay() {
  if (!rpsIsAuto) {
    rpsIntervalID = setInterval(function () {
      rpsPlay(rpsPickMove());
    }, 1000);
    rpsIsAuto = true;
    document.getElementById('rps-auto-btn').innerHTML = 'Stop Auto';
  } else {
    rpsStopAuto();
  }
}

function rpsStopAuto() {
  clearInterval(rpsIntervalID);
  rpsIsAuto = false;
  if (document.getElementById('rps-auto-btn')) {
    document.getElementById('rps-auto-btn').innerHTML = 'Auto Play';
  }
}

let randomNumber;
let numGuess = 1;
let numPlayGame = true;
let numNewGameP = null;

function numInit() {
  randomNumber = parseInt(Math.random() * 100 + 1);
  numGuess = 1;
  numPlayGame = true;
  document.getElementById('guessField').value = '';
  document.getElementById('guessField').removeAttribute('disabled');
  document.getElementById('subt').removeAttribute('disabled');
  document.getElementById('numGuesses').innerHTML = '';
  document.getElementById('numRemaining').innerHTML = '10';
  document.getElementById('numMessage').innerHTML = '';
  if (numNewGameP && numNewGameP.parentNode) {
    numNewGameP.parentNode.removeChild(numNewGameP);
    numNewGameP = null;
  }
}

function numSubmit() {
  if (!numPlayGame) return;
  const guess = parseInt(document.getElementById('guessField').value);
  if (isNaN(guess)) { alert('Enter a valid number'); return; }
  if (guess < 1) { alert('Enter a number more than 1'); return; }
  if (guess > 100) { alert('Enter a number less than 100'); return; }

  if (numGuess === 10) {
    document.getElementById('guessField').value = '';
    document.getElementById('numGuesses').innerHTML += guess + ', ';
    document.getElementById('numRemaining').innerHTML = '0';
    document.getElementById('numMessage').innerHTML = '<h2>Game Over. Number was ' + randomNumber + '</h2>';
    numEndGame();
  } else {
    document.getElementById('guessField').value = '';
    document.getElementById('numGuesses').innerHTML += guess + ', ';
    numGuess++;
    document.getElementById('numRemaining').innerHTML = (11 - numGuess);

    if (guess === randomNumber) {
      document.getElementById('numMessage').innerHTML = '<h2>You guessed it right 🎉</h2>';
      numEndGame();
    } else if (guess < randomNumber) {
      document.getElementById('numMessage').innerHTML = '<h2>Number is Too Low :(</h2>';
    } else {
      document.getElementById('numMessage').innerHTML = '<h2>Number is Too High :(</h2>';
    }
  }
}

function numEndGame() {
  document.getElementById('guessField').setAttribute('disabled', '');
  document.getElementById('subt').setAttribute('disabled', '');
  numPlayGame = false;
  numNewGameP = document.createElement('p');
  numNewGameP.classList.add('button');
  numNewGameP.innerHTML = '<button onclick="numInit()"><h4>Start New Game</h4></button>';
  document.querySelector('.resultParas').appendChild(numNewGameP);
}

let tttBoard = ['', '', '', '', '', '', '', '', ''];
let tttCurrentPlayer = 'X';
let tttGameOver = false;
let tttScoreData = { X: 0, O: 0, ties: 0 };

const tttWinCombos = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

function tttInit() {
  tttBoard = ['', '', '', '', '', '', '', '', ''];
  tttCurrentPlayer = 'X';
  tttGameOver = false;
  const cells = document.querySelectorAll('.ttt-cell');
  cells.forEach(function (cell) {
    cell.innerHTML = '';
    cell.className = 'ttt-cell';
  });
  document.getElementById('ttt-status').innerHTML = "Player X's turn";
  tttUpdateScore();
}

function tttClick(index) {
  if (tttGameOver) return;
  if (tttBoard[index] !== '') return;

  tttBoard[index] = tttCurrentPlayer;
  const cells = document.querySelectorAll('.ttt-cell');
  cells[index].innerHTML = tttCurrentPlayer;
  cells[index].classList.add(tttCurrentPlayer.toLowerCase());

  if (tttCheckWin()) {
    document.getElementById('ttt-status').innerHTML = 'Player ' + tttCurrentPlayer + ' Wins! 🎉';
    tttScoreData[tttCurrentPlayer]++;
    tttGameOver = true;
    tttUpdateScore();
    return;
  }

  if (tttBoard.indexOf('') === -1) {
    document.getElementById('ttt-status').innerHTML = "It's a Tie!";
    tttScoreData.ties++;
    tttGameOver = true;
    tttUpdateScore();
    return;
  }

  tttCurrentPlayer = tttCurrentPlayer === 'X' ? 'O' : 'X';
  document.getElementById('ttt-status').innerHTML = "Player " + tttCurrentPlayer + "'s turn";
}

function tttCheckWin() {
  for (let i = 0; i < tttWinCombos.length; i++) {
    const combo = tttWinCombos[i];
    if (
      tttBoard[combo[0]] !== '' &&
      tttBoard[combo[0]] === tttBoard[combo[1]] &&
      tttBoard[combo[1]] === tttBoard[combo[2]]
    ) {
      return true;
    }
  }
  return false;
}

function tttNewGame() {
  tttInit();
}

function tttResetScore() {
  tttScoreData = { X: 0, O: 0, ties: 0 };
  tttInit();
}

function tttUpdateScore() {
  document.getElementById('ttt-score').innerHTML =
    'X: ' + tttScoreData.X + ' | O: ' + tttScoreData.O + ' | Ties: ' + tttScoreData.ties;
}
