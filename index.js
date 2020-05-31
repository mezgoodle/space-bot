'use strict';

const TelegramBot = require('node-telegram-bot-api');
const { Token } = require('./config');

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(Token, { polling: true });

bot.onText(/\/echo (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const resp = match[1];
  bot.sendMessage(chatId, resp);
});

bot.on('message', msg => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Received your message');
});
