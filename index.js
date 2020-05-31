'use strict';

const TelegramBot = require('node-telegram-bot-api');
const { Token } = require('./config');

// Create a bot that uses 'polling' to fetch new updates.
// It`s for development
const bot = new TelegramBot(Token, { polling: true });
// Create a bot that uses 'webhook' to get new updates.
//It`s for production ========
// const options = {
//     webHook: {
//       port: process.env.PORT
//     }
//   };
//   const url = process.env.APP_URL || 'https://weather-bot-mezgoodle.herokuapp.com:443';
//   const bot = new TelegramBot(Token, options);
//   bot.setWebHook(`${url}/bot${Token}`);
// =============

bot.onText(/\/echo (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const resp = match[1];
  bot.sendMessage(chatId, resp);
});

bot.on('message', msg => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Received your message');
});
