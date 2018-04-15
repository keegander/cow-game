var playerName;
var activeGame;
var game = document.getElementById('game');
var gameData = {};
var sounds = {
  moo: new Howl({src: ['moo.mp3']}),
  gameOver: new Howl({src: ['game-over.mp3']})
};

function newGame() {
  game.innerHTML =
    '<h1>This is a game where you have a farm.</h1>' +
    '<p>You have to keep above 50 cows. If you stay below 50 cows for 3 rounds the game ends.</p>' +
    '<button onClick="showInstructions()">Start Game</button>';
}

function hostGame() {
  playerName = window.prompt('What is your name?');
  if (!playerName) return;
  activeGame = Math.random().toString(36).substring(6).toUpperCase();
  var gameRef = firebase.database().ref('games/' + activeGame);
  var initialPlayers = {};
  initialPlayers[playerName] = { name: playerName, cows: 60, strikes: 0, isHost: true };
  gameRef.set({
    players: initialPlayers,
    history: {},
    round: 0
  });
  document.querySelector('body').setAttribute('class', 'playing-game');
  gameRef.on('value', renderMultiplayerGame);
}

function joinGame() {
  playerName = window.prompt('What is your name?');
  activeGame = window.prompt('Enter the game code:');
  if (!playerName || !activeGame) return;
  var gameRef = firebase.database().ref('games/' + activeGame);
  document.querySelector('body').setAttribute('class', 'playing-game');
  gameRef.on('value', renderMultiplayerGame);
  firebase.database().ref('games/' + activeGame + '/players/' + playerName).update({ name: playerName, cows: 60, strikes: 0});
}

function showInstructions() {
  game.innerHTML =
    '<h1>How to Play</h1>' +
    '<p>This is a game were you have a farm You have to stay above 50 cows. You can go below 50 cows but if you stay below 50 cows for 3 turns your family starves that means game over. You can give cows too. This game is multiplayer.</p>' +
    '<button onClick="startGame()">AI game </button>'+
    '<button onClick="startMultiplayerGame()">Multiplayer game </button>';
}

function startGame() {
  activeGame = undefined;
  playerName = window.prompt('What is your name?');
  sounds.moo.play();
  var body = document.querySelector('body');
  body.setAttribute('class', 'playing-game');
  game.innerHTML = '';
  var initialPlayers = {};
  initialPlayers[playerName] = { name: playerName, cows: 60, strikes: 0, isHost: true };
  initialPlayers['Player 2'] = { name: 'Player 2', cows: 60, strikes: 0, isCpu: true };
  initialPlayers['Player 3'] = { name: 'Player 3', cows: 60, strikes: 0, isCpu: true };
  initialPlayers['Player 4'] = { name: 'Player 4', cows: 60, strikes: 0, isCpu: true };
  gameData = {
    players: initialPlayers,
    history: {},
    round: 1
  };
  renderGame();
}

function startMultiplayerGame() {
  game.innerHTML =
    '<h1>Multiplayer Game</h1>' +
    '<button onClick="showInstructions()">Back</button>' +
    '<button onClick="hostGame()">Host</button>' +
    '<button onClick="joinGame()">Join</button>';
}

function renderMultiplayerGame(snapshot) {
  if (!snapshot.val()) return;
  gameData = snapshot.val();
  if (gameData.gameOver) {
	return renderGameOver();
  }
  if (gameData.round > 0) {
	return renderGame();
  }
  return renderLobby();
}

function beginMultiplayerGame() {
  firebase.database().ref('games/' + activeGame).update({ round: 1 });
}

function renderLobby() {
	game.innerHTML =
	  '<h1>Game Code:' + activeGame + '</h1>' +
	  '<h3>Players:</h3>' +
	  Object.values(gameData.players).map(player => '<div>' + player.name + '</div>') +
	  (Object.values(gameData.players).length > 1 && gameData.players[playerName].isHost ? '<button onClick="beginMultiplayerGame()">Start Game</button>' : '<button disabled>Start Game</button');
}

function renderGame() {
  var maxCows = Object.values(gameData.players).reduce((max, player) => Math.max(player.cows, max), 0);
  var playerHtml = Object.values(gameData.players).map((player, count) => {
    var cowPercent = player.cows / maxCows;
    var playerNumber = count + 1;
    return `
      <div class="player player${playerNumber}">
        <div class="cow-count">${player.cows}</div>
        <div class="cow-bar">
          <div class="fill" style="transform: scaleY(${cowPercent})"></div>
        </div>
        <div class="player-name">
          ${player.name}
          <span class="strikes">Strikes: ${player.strikes}</span>
        </div>
      </div>
    `;
  });
  var playerButtonHtml = Object.values(gameData.players).map(player => {
    return `<button onClick="giveCows('${player.name}')">${player.name}</button>`
  });
  var historyHtml = Object.values(gameData.history || {}).map(h => `
    <div class="history-item">
      <span class="player">${h.player}:<span>
      <span class="action">${h.message}</span>
    </div>
  `);
  game.innerHTML = `<div class="players">${playerHtml.join('')}</div>`;
  game.innerHTML += '<div class="give-cows"><div class="label">give cows:</div>' +
    playerButtonHtml.join('') + '</div>';
  if (gameData.players[playerName].isHost) {
	game.innerHTML += `<button onClick="endRound()">End round</button> Round: ${gameData.round}`;
  }
  game.innerHTML += `<div class="history">${historyHtml.join('')}</div>`;
}

function giveCows(targetPlayerName, givingPlayerName = playerName, count = 1,) {
  if (targetPlayerName === givingPlayerName) return;
  console.log('givingCows', targetPlayerName, givingPlayerName);
  if(gameData.players[givingPlayerName].cows <= count) return;
  var givingPlayerCows = gameData.players[givingPlayerName].cows - count;
  var targetPlayerCows = gameData.players[targetPlayerName].cows + count;
  if (activeGame) {
    firebase.database().ref('games/' + activeGame + '/players/' + givingPlayerName).update({ cows: givingPlayerCows });
    firebase.database().ref('games/' + activeGame + '/players/' + targetPlayerName).update({ cows: targetPlayerCows });
  } else {
    gameData.players[givingPlayerName].cows = givingPlayerCows;
    gameData.players[targetPlayerName].cows = targetPlayerCows;
    renderGame();
  }
}

function aiTakeTurn(targetPlayerName) {
  console.log('ai ' + targetPlayerName + ' taking turn');
  var myCows = gameData.players[targetPlayerName].cows;
  if (myCows > 60) {
	console.log('ai has enough cows to give');
	var givingName = Object.values(gameData.players).reduce((a, b) => {
	    if (gameData.players[a]) {
		  return gameData.players[a].cows < b.cows ? a : b.name;
		}
	}, Object.values(gameData.players)[0].name);
    if (gameData.players[givingName].cows < 50) {
	  var cowsToGive = myCows - 53;
	  var cowsTheyNeed = 50 - gameData.players[givingName].cows;
	  var givingCows = Math.min(cowsTheyNeed, cowsToGive);
	  console.log('giving ' + givingCows + ' to player ' + givingName);
	  giveCows(givingName, targetPlayerName, givingCows);
	}
  }
}

function endGame() {
  if (activeGame) {
	firebase.database().ref('games/' + activeGame).update({ gameOver: true });
  } else {
	renderGameOver();
  }
}

function renderGameOver() {
  sounds.gameOver.play();
  game.innerHTML = '<div class="game-over"><div>GAME OVER!</div>' +
    '<button onclick="backToHome()" style="display: block; margin: 0 auto">back to home</button></div>';
}

function backToHome() {
  var body = document.querySelector('body');
  body.setAttribute('class', '');
  game.innerHTML = '';
  gameData = {};
  showInstructions();
}

function endRound() {
  Object.values(gameData.players).forEach(player => {
    if (player.isCpu) aiTakeTurn(player.name);
  });
  gameData.round += 1;
  Object.values(gameData.players).forEach(player => {
    if (player.cows < 50) {
      player.strikes += 1;
    } else {
      player.strikes = 0;
    }
  });
  var gameOver = Object.values(gameData.players).some(p => p.strikes >= 3);
  if (gameOver) return endGame();
  var cowOptions = [
    {
      message: 'It rained a lot. Your cows got a bunch of water +20.',
      cowChange: 20,
      chance:15
    }, {
      message: 'A delivery truck came with a bunch of hay +15.',
      cowChange: 15,
      chance:18
    },{
	  message: 'aliens decided to give you back some cows. +10',
      cowChange: 10 ,
      chance:19
    },{
      
      message: 'Your cows had some babies +5.',
      cowChange: 5,
      chance:26
    },{
      message: 'Your cows stayed healthy +0.',
      cowChange:0 ,
      chance:30
    },{
      message: 'Some of your cows starved to death -5.',
      cowChange:-5 ,
      chance:19
    },{
      message: 'Some of your cows got too thirsty -10.',
      cowChange:-10 ,
      chance:19
    },{
      message: 'The delivery truck was late -15.',
      cowChange:-15 ,
      chance: 17
    },{
      message: 'Some robbers stole some cows -20.',
      cowChange: -20,
      chance:10
    }
  ];
  var roundOutcomes = Object.values(gameData.players).map(player => {
    var choice = getChoice(cowOptions);
    choice.player = player.name;
    return choice;
  });
  roundOutcomes.forEach(r => {
    var cowCount = Math.max(gameData.players[r.player].cows + r.cowChange, 0);
    gameData.players[r.player].cows = cowCount;
    if (!gameData.history) gameData.history = {};
    gameData.history[r.player] = r;
  });
  renderGame();
  if (activeGame) {
	firebase.database().ref('games/' + activeGame).update(gameData);
  }
}

function getChoice(choices) {
  var totalChance = choices.reduce((sum, c) => sum + c.chance, 0);
  var choicesWithThreshold = choices.map((c, i) => {
    var lastThreshold = choices[i-1] ? choices[i-1].threshold : 0;
    c.threshold = lastThreshold + c.chance;
    return c;
  })
  var choiceNumber = Math.floor(Math.random()*totalChance);
  return choices.find(c => choiceNumber < c.threshold);
}
