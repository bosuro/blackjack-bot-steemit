# Steemit Blackjack Bot
This Blackjack Bot is working on the Steemit Blockchain.

# Installing This Bot
```
$ git clone https://github.com/andreistalker/blackjack-bot-steemit.git
$ cd blackjack-bot-steemit
$ npm install mysql
$ npm install request
$ nmp install steem
```
Import the database from jackpoststeem.sql

# Configuring This Bot
Update the database info on line 5.
Update account info on lines 14-18.
Update Bet min on line 70.

# How to use?
Send 0.001 SBD (or the min choosen by you) to the bot with memo "play blackjack".
Then you will recive a transaction from the bot with a memo of what you draw and what house draw.
You can stand or hit a card.
