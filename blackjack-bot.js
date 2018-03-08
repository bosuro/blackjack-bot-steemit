var mysql = require('mysql');
var request = require('request');
var steem = require('steem');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  masterpassword: "",
  database: "jackpotsteem"
});

var lastTransInt;

const username = "";
const masterpass = "";
const activekey = "";

const gameStart = "play blackjack";

con.connect(function(err) {
	if (err) throw err;
  console.log("Bot is now connected to the database.");
  lastTrans();
});

steem.api.setOptions({ url: 'https://api.steemit.com'});

setInterval(updateLastTrans, 5*1000); //setInterval

function lastTrans() {	
	con.query("SELECT * FROM info", function (err, result) {
		if (err) throw err;
    console.log(result);
	console.log();
	lastTransInt = result[0].value;
  });
}

function updateLastTrans() {
	request("https://uploadbeta.com/api/steemit/transfer-history/?id=" + username, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			var json = JSON.parse(body);
			console.log("New transaction list aquired.");
			var newTransInt = Object.keys(json).length;
			var transNew = newTransInt - lastTransInt;
			
			lastTransInt = newTransInt;

			con.query("UPDATE info SET value = " + lastTransInt + " WHERE name = 'lastTrans'", function (err, result) {
				if (err) throw err;
			});
	
			console.log("Transactions updated. " + transNew + " new transactions. \n");
			
			if(transNew > 0)
				console.log("Transactions now: " + lastTransInt + "\n"); 
			
			for(var i = 0; i<= transNew - 1; i++)
			{
				console.log(json[i].memo);
				if(!gameStart.localeCompare(json[i].memo)) {
					var trans = json[i].transaction.split(" ");
					var playerName = trans[4];
					var bet = parseFloat(trans[1]);
					var currency = trans[2];
					
					if(!currency.localeCompare("SBD"))
					{
						if(bet >= 0.001)
						{
							console.log("Found game with " + playerName + ". Bet: " + bet + " \n");
							
							var reward = parseFloat(bet).toFixed(3) * 2.0;
							var timestamnow = Date.now() / 1000;
							
							con.query("INSERT INTO games (player, bet, reward, stats, timestamp) VALUES ('" + playerName + "', '" + bet + "', '" + reward + "', '0', '" + timestamnow + "')", function (err, result) {
							if (err) throw err;
							playGame(result.insertId, playerName);
							});
							
						}
						else refundInvalidBet(playerName, bet, currency);
					}
					else refundInvalidBet(playerName, bet, currency);
				}
				else {
					var memo = json[i].memo.split(" ");
					if(!memo[0].localeCompare("hit"))
					{
						var trans = json[i].transaction.split(" ");
						var playerName = trans[4];
						hitGame(parseInt(memo[1]), playerName);
					}
					else if(!memo[0].localeCompare("stand"))
					{
						var trans = json[i].transaction.split(" ");
						var playerName = trans[4];
						endGame(parseInt(memo[1]), playerName);
					}
				}
			}
		}
	})
}

function hitCard(gameID, cards) {
	var cardNew = getRandomInt(2, 13);
	var valid = isValid(cardNew, 0, cards);
	if(valid >= 1 && valid != 10) {
		registerHitCard(gameID, cardNew, valid, cards);
	} else if (valid == 0) {
		hitCard(gameID, cards);
	} else if (valid == 10) {
		calculateGame(gameID, cards);
	}
}

function registerHitCard(gameID, cardNew, slot, cards) {
	con.query("UPDATE games SET player" + slot + " = " + cardNew + " WHERE id = " + gameID, function (err, result) {
		if (err) throw err;
	});
	con.query("SELECT * FROM games WHERE id = " + gameID, function (err, result) {
		if (err) throw err;
		var houseCards = [];
		var playerCards = [];
		var playerTotal = 0;
		var houseTotal = 0;
		var playerAces = 0;
		var houseAces = 0;
		houseCards.push(result[0].house1);
		houseCards.push(result[0].house2);
		houseCards.push(result[0].house3);
		houseCards.push(result[0].house4);
		houseCards.push(result[0].house5);
		playerCards.push(result[0].player1);
		playerCards.push(result[0].player2);
		playerCards.push(result[0].player3);
		playerCards.push(result[0].player4);
		playerCards.push(result[0].player5);
		for(i = 0; i<=4 ; i++) {
			if(playerCards[i] == 10)
				playerAces++;
			else if(playerCards[i] >= 11)
				playerTotal += 10;
			else
				playerTotal += playerCards[i];
			
			if(houseCards[i] == 10)
				houseAces++;
			else if(houseCards[i] >= 11)
				houseTotal += 10;
			else
				houseTotal += houseCards[i];
		}
		if(playerAces == 1)
		{
			if(playerTotal + 10 <= 21)
				playerTotal += 10;
			else
				playerTotal++;
		}
		if(playerAces == 2)
		{
			if(playerTotal + 20 <= 21)
				playerTotal += 20;
			else if(playerTotal + 11 <= 21)
				playerTotal += 11;
			else
				playerTotal += 2;
		}
		if(playerAces == 3)
		{
			if(playerTotal + 21 <= 21)
				playerTotal += 21;
			else if(playerTotal + 12 <=21)
				playerTotal += 12;
			else
				playerTotal += 3;
		}
		if(playerAces == 4)
		{
			if(playerTotal + 13 <= 21)
				playerTotal += 13;
			else
				playerTotal += 4;
		}
		if(houseAces == 1)
		{
			if(houseTotal + 10 <= 21)
				houseTotal += 10;
			else
				houseTotal++;
		}
		if(houseAces == 2)
		{
			if(houseTotal + 20 <= 21)
				houseTotal += 20;
			else if(houseTotal + 11 <= 21)
				houseTotal += 11;
			else
				houseTotal += 2;
		}
		if(houseAces == 3)
		{
			if(houseTotal + 21 <= 21)
				houseTotal += 21;
			else if(houseTotal + 12 <=21)
				houseTotal += 12;
			else
				houseTotal += 3;
		}
		if(houseAces == 4)
		{
			if(houseTotal + 13 <= 21)
				houseTotal += 13;
			else
				houseTotal += 4;
		}
		con.query("UPDATE games SET player" + slot + " = " + cardNew + ", houseTotal = " + houseTotal + ", playerTotal = " + playerTotal + " WHERE id = " + gameID, function (errr, rresult) {
		if (errr) throw errr;
			nextMoveAfterHit(gameID, houseTotal, playerTotal, cards, cardNew);
		});
	});
}

function nextMoveAfterHit(gameID, houseTotal, playerTotal, cards, cardNew) {
	if(playerTotal > 21) {
		loseGame(gameID, 2, houseTotal, playerTotal, cardNew);
	}
	else if(playerTotal == 21) {
		showHouse(gameID, houseTotal, playerTotal, cards);
	} else {
		cardHitNotification(gameID, houseTotal, playerTotal, cardNew);
	}
}

function cardHitNotification(gameID, houseTotal, playerTotal, cardNew) {
	var memoDraw = "You draw: " + cardNew + ". Your total: " + playerTotal;
	con.query("SELECT * FROM games WHERE id = " + gameID, function (err, result) {
		if (err) throw err;
		steem.broadcast.transfer(activekey, username, result[0].player, "0.001 SBD", memoDraw, function(err, result) {
			console.log(err, result);
		});
	});
}

function hitGame(gameID, playerName) {
	con.query("SELECT * FROM games WHERE id = " + gameID, function (err, result) {
		if (err) throw err;
		if (result[0] != null) {
			if(!playerName.localeCompare(result[0].player) && result[0].stats == 0) {
				var cards = [];
				cards.push(result[0].player1);
				cards.push(result[0].player2);
				cards.push(result[0].player3);
				cards.push(result[0].player4);
				cards.push(result[0].player5);
				cards.push(result[0].house1);
				cards.push(result[0].house2);
				cards.push(result[0].house3);
				cards.push(result[0].house4);
				cards.push(result[0].house5);
				hitCard(gameID, cards);
			}
			else {
				steem.broadcast.transfer(activekey, username, playerName, "0.001 SBD", "Sorry, but this is not your game or game ended.", function(err, result) {
					console.log(err, result);
				});
			}
		}
		else {
			steem.broadcast.transfer(activekey, username, playerName, "0.001 SBD", "Sorry, but this game does not exist.", function(err, result) {
				console.log(err, result);
			});
		}
	});
}

function endGame(gameID, playerName) {
	con.query("SELECT * FROM games WHERE id = " + gameID, function (err, result) {
		if (err) throw err;
		if (result[0] != null) {
			if(!playerName.localeCompare(result[0].player) && result[0].stats == 0) {
				var cards = [];
				cards.push(result[0].player1);
				cards.push(result[0].player2);
				cards.push(result[0].player3);
				cards.push(result[0].player4);
				cards.push(result[0].player5);
				cards.push(result[0].house1);
				cards.push(result[0].house2);
				cards.push(result[0].house3);
				cards.push(result[0].house4);
				cards.push(result[0].house5);
				showHouse(gameID, result[0].houseTotal, result[0].playerTotal, cards);
			}
			else {
				steem.broadcast.transfer(activekey, username, playerName, "0.001 SBD", "Sorry, but this is not your game or game ended.", function(err, result) {
					console.log(err, result);
				});
			}
		}
		else {
			steem.broadcast.transfer(activekey, username, playerName, "0.001 SBD", "Sorry, but this game does not exist.", function(err, result) {
				console.log(err, result);
			});
		}
	});
}

function showHouse(gameID, houseTotal, playerTotal, cards) {
	if(houseTotal >= 17)
	{
		if(playerTotal > houseTotal && playerTotal <= 21)
		{
			winGame(gameID, 0, houseTotal, playerTotal);
		}
		else if(playerTotal == houseTotal)
		{
			drawGame(gameID, houseTotal, playerTotal);
		}
		else if(playerTotal > 21 && houseTotal > 21)
		{
			drawGame(gameID, houseTotal, playerTotal);
		}
		else if(playerTotal > 21)
		{
			loseGame(gameID, 1, houseTotal, playerTotal);
		}
		else if(playerTotal < houseTotal && houseTotal <= 21)
		{
			loseGame(gameID, 0, houseTotal, playerTotal);
		}
		else if(houseTotal > 21)
		{
			winGame(gameID, 0, houseTotal, playerTotal);
		}
	} else {
		if(playerTotal > 21) {
			loseGame(gameID, 1, houseTotal, playerTotal);
		}
		else if(playerTotal < houseTotal) {
			loseGame(gameID, 0, houseTotal, playerTotal);
		}
		else {
			drawHouseStand(gameID, 1, cards);
		}
	}
}

function drawHouseStand(gameID, end, cards) {
	var houseNew = getRandomInt(2, 13);
	var valid = isValid(houseNew, 1, cards);
	if(valid >= 1 && valid != 10) {
		calculateOutcomeStand(gameID, houseNew, valid);
	} else if (valid == 0) {
		drawHouseStand(gameID, end, cards);
	} else if (valid == 10) {
		calculateGame(gameID, cards);
	}
}

function calculateGame(gameID, cards) {
	var houseCards = [];
	var playerCards = [];
	houseCards.push(cards[5]);
	houseCards.push(cards[6]);
	houseCards.push(cards[7]);
	houseCards.push(cards[8]);
	houseCards.push(cards[9]);
	playerCards.push(cards[0]);
	playerCards.push(cards[1]);
	playerCards.push(cards[2]);
	playerCards.push(cards[3]);
	playerCards.push(cards[4]);
	for(i = 0; i<=4 ; i++) {
		if(playerCards[i] == 10)
			playerAces++;
		else if(playerCards[i] >= 11)
			playerTotal += 10;
		else
			playerTotal += playerCards[i];
		
		if(houseCards[i] == 10)
			houseAces++;
		else if(houseCards[i] >= 11)
			houseTotal += 10;
		else
			houseTotal += houseCards[i];
	}
	if(playerAces == 1)
	{
		if(playerTotal + 10 <= 21)
			playerTotal += 10;
		else
			playerTotal++;
	}
	if(playerAces == 2)
	{
		if(playerTotal + 20 <= 21)
			playerTotal += 20;
		else if(playerTotal + 11 <= 21)
			playerTotal += 11;
		else
			playerTotal += 2;
	}
	if(playerAces == 3)
	{
		if(playerTotal + 21 <= 21)
			playerTotal += 21;
		else if(playerTotal + 12 <=21)
			playerTotal += 12;
		else
			playerTotal += 3;
	}
	if(playerAces == 4)
	{
		if(playerTotal + 13 <= 21)
			playerTotal += 13;
		else
			playerTotal += 4;
	}
	if(houseAces == 1)
	{
		if(houseTotal + 10 <= 21)
			houseTotal += 10;
		else
			houseTotal++;
	}
	if(houseAces == 2)
	{
		if(houseTotal + 20 <= 21)
			houseTotal += 20;
		else if(houseTotal + 11 <= 21)
			houseTotal += 11;
		else
			houseTotal += 2;
	}
	if(houseAces == 3)
	{
		if(houseTotal + 21 <= 21)
			houseTotal += 21;
		else if(houseTotal + 12 <=21)
			houseTotal += 12;
		else
			houseTotal += 3;
	}
	if(houseAces == 4)
	{
		if(houseTotal + 13 <= 21)
			houseTotal += 13;
		else
			houseTotal += 4;
	}
	
	if(playerTotal > houseTotal) {
		winGame(gameID, 0, houseTotal, playerTotal);
	}
	else {
		loseGame(gameID, 0, houseTotal, playerTotal);
	}
}

function calculateOutcomeStand(gameID, houseNew, valid, cards) {
	con.query("UPDATE games SET house" + valid + " = " + houseNew + " WHERE id = " + gameID, function (err, result) {
		if (err) throw err;
	});
	con.query("SELECT * FROM games WHERE id = " + gameID, function (err, result) {
		if (err) throw err;
		var houseCards = [];
		var playerCards = [];
		var playerTotal = 0;
		var houseTotal = 0;
		var playerAces = 0;
		var houseAces = 0;
		houseCards.push(result[0].house1);
		houseCards.push(result[0].house2);
		houseCards.push(result[0].house3);
		houseCards.push(result[0].house4);
		houseCards.push(result[0].house5);
		playerCards.push(result[0].player1);
		playerCards.push(result[0].player2);
		playerCards.push(result[0].player3);
		playerCards.push(result[0].player4);
		playerCards.push(result[0].player5);
		for(i = 0; i<=4 ; i++) {
			if(playerCards[i] == 10)
				playerAces++;
			else if(playerCards[i] >= 11)
				playerTotal += 10;
			else
				playerTotal += playerCards[i];
			
			if(houseCards[i] == 10)
				houseAces++;
			else if(houseCards[i] >= 11)
				houseTotal += 10;
			else
				houseTotal += houseCards[i];
		}
		if(playerAces == 1)
		{
			if(playerTotal + 10 <= 21)
				playerTotal += 10;
			else
				playerTotal++;
		}
		if(playerAces == 2)
		{
			if(playerTotal + 20 <= 21)
				playerTotal += 20;
			else if(playerTotal + 11 <= 21)
				playerTotal += 11;
			else
				playerTotal += 2;
		}
		if(playerAces == 3)
		{
			if(playerTotal + 21 <= 21)
				playerTotal += 21;
			else if(playerTotal + 12 <=21)
				playerTotal += 12;
			else
				playerTotal += 3;
		}
		if(playerAces == 4)
		{
			if(playerTotal + 13 <= 21)
				playerTotal += 13;
			else
				playerTotal += 4;
		}
		if(houseAces == 1)
		{
			if(houseTotal + 10 <= 21)
				houseTotal += 10;
			else
				houseTotal++;
		}
		if(houseAces == 2)
		{
			if(houseTotal + 20 <= 21)
				houseTotal += 20;
			else if(houseTotal + 11 <= 21)
				houseTotal += 11;
			else
				houseTotal += 2;
		}
		if(houseAces == 3)
		{
			if(houseTotal + 21 <= 21)
				houseTotal += 21;
			else if(houseTotal + 12 <=21)
				houseTotal += 12;
			else
				houseTotal += 3;
		}
		if(houseAces == 4)
		{
			if(houseTotal + 13 <= 21)
				houseTotal += 13;
			else
				houseTotal += 4;
		}
		steem.broadcast.transfer(activekey, username, result[0].player, "0.001 SBD", "House draw: " + houseNew + ". House total: " + houseTotal, function(err, result) {
				console.log(err, result);
				showHouse(gameID, houseTotal, playerTotal, cards);
			});
	});
}

function isValid(card, ph, cards) {
	var cardnumbers = 0;
	for(var i = 0; i<10; i++)
	{
		if(cards[i] == card) {
			cardnumbers++;
		}
	}
	if(cardnumbers >= 4) {
		return 0;
	}
	else {
		if(ph == 0) {
			var lastCard;
			var i=0;
			lastCard = cards[i];
			i++;
			while(i<=4 && lastCard != 0) {
				lastCard = cards[i];
				i++;
			}
			if(lastCard == 0) {
				return i;
			}
			else {
				return 10;
			}
		} else if (ph == 1) {
			var lastCard;
			var i=0;
			lastCard = cards[i + 5];
			i++;
			while(i<=4 && lastCard != 0) {
				lastCard = cards[i + 5];
				i++;
			}
			if(lastCard == 0) {
				return i;
			}
			else {
				return 10;
			}
		}
	}
}

function refundInvalidBet (playerName, bet, currency) {
	var amount = parseFloat(bet).toFixed(3) + " " + currency;
	var memoRefund = "You need to send over 0.01 SBD!";
	
	steem.broadcast.transfer(activekey, username, playerName, amount, memoRefund, function(err, result) {
		console.log(err, result);
	});
	
	console.log("Refund to " + playerName + " " + bet + " " + currency);
}

function playGame(gameID, playerName) {
	var player1 = getRandomInt(2, 13);
	var player2 = getRandomInt(2, 13);
	var house1 = getRandomInt(2, 13);
	var house2 = getRandomInt(2, 13);
	var playerTotal = 0;
	var houseTotal = 0;
	
	if(player1 >= 11)
		playerTotal += 10;
	else if(player1 == 10)
		playerTotal += 11;
	else 
		playerTotal += player1;
	
	if(player2 >= 11)
		playerTotal += 10;
	else if(player2 == 10)
		playerTotal += 11;
	else 
		playerTotal += player2;
	
	if(house1 >= 11)
		houseTotal += 10;
	else if(house1 == 10)
		houseTotal += 11;
	else 
		houseTotal += house1;
	
	if(house2 >= 11)
		houseTotal += 10;
	else if(house2 == 10)
		houseTotal += 11;
	else 
		houseTotal += house2;
	
	con.query("UPDATE games SET playerTotal = " + playerTotal + ", houseTotal = " + houseTotal + ", player1 = " + player1 + ", player2 = " + player2 + ", house1 = " + house1 +", house2 = " + house2 + " WHERE id = " + gameID, function (err, result) {
	if (err) throw err;
	});
	
	if(playerTotal < 21)
	{
		var memoPlay = "You draw: " + player1 + ", " + player2 + " (" + playerTotal + "). House draw: " + house1 + ". Send 0.001 SBD with memo hit " + gameID + " or stand " + gameID;
		steem.broadcast.transfer(activekey, username, playerName, "0.001 SBD", memoPlay, function(err, result) {
			console.log(err, result);
		});
	}
	else 
		winGame(gameID, 1, 0, 0);
	
	console.log(player1 + " " + player2 + " (" + playerTotal + ")");
}

function winGame(gameID, to, house, playerTotal) {
	var memoWin = "You won! Game number " + gameID + " is now closed. House had: " + house + ". You had: " + playerTotal;
	if(to == 1)
		memoWin = "BLACKJACK! Game number " + gameID + " is now closed.";
	
	con.query("SELECT * FROM games WHERE id = " + gameID, function (err, result) {
		if (err) throw err;
		var won = result[0].reward + " SBD";
		steem.broadcast.transfer(activekey, username, result[0].player, won, memoWin, function(err, result) {
			console.log(err, result);
		});
	});
	
	con.query("UPDATE games SET stats = 1 WHERE id = " + gameID, function (err, result) {
		if (err) throw err;
	});
}

function loseGame(gameID, loseby, house, you, cardd = 0) {
	var memoLose = "You lost! Game number " + gameID + " is now closed. You had: " + you + ". House had: " + house;
	if(loseby == 1)
		memoLose = "You lost! Game number " + gameID + " is now closed. You had: " + you + ". House had: " + house;
	if(loseby == 2)
		memoLose = "You drew: " + cardd + ". You lost! Game number " + gameID + " is now closed. You had: " + you + ". House had: " + house;
	
	con.query("SELECT * FROM games WHERE id = " + gameID, function (err, result) {
		if (err) throw err;
		steem.broadcast.transfer(activekey, username, result[0].player, "0.001 SBD", memoLose, function(err, result) {
			console.log(err, result);
		});
	});
	
	con.query("UPDATE games SET stats = 2 WHERE id = " + gameID, function (err, result) {
		if (err) throw err;
	});
}

function drawGame(gameID, house, player) {
	var memoDraw = "Game number " + gameID + " ends in a draw. Nobody won. House had: " + house + ". You had: " + player;
	
	con.query("SELECT * FROM games WHERE id = " + gameID, function (err, result) {
		if (err) throw err;
		var back = result[0].bet + " SBD";
		steem.broadcast.transfer(activekey, username, result[0].player, back, memoDraw, function(err, result) {
			console.log(err, result);
		});
	});
	
	con.query("UPDATE games SET stats = 3 WHERE id = " + gameID, function (err, result) {
		if (err) throw err;
	});
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}