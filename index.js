'use strict';

const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const { Token } = require('./util/config');
const {
  rocketHTMLTemplate,
  launchHTMLTemplate,
  missionHTMLTemplate,
  launchPadHTMLTemplate
} = require('./util/templates');

const type = {
  'r': { 'url': 'https://api.spacexdata.com/v3/rockets', 'template': rocketHTMLTemplate },
  'lp': { 'url': 'https://api.spacexdata.com/v3/launchpads', 'template': launchPadHTMLTemplate },
  'm': { 'url': 'https://api.spacexdata.com/v3/missions', 'template': missionHTMLTemplate },
  'l': { 'url': 'https://api.spacexdata.com/v3/launches/upcoming?limit=4', 'next': 'https://api.spacexdata.com/v3/launches', 'template': launchHTMLTemplate },
};

// Create a bot that uses 'polling' to fetch new updates.
const bot = new TelegramBot(Token, { polling: true });

const clearData = element => {
  for (const key in element)
    if (Object.prototype.hasOwnProperty.call(element, key))
      if (element[key] === null)
        element[key] = 'empty';
  return element;
};

const getInfo = (url, rocket = null, launch = null, launchpad = null, chatId, request = 'r') => {
  if (rocket) {
    axios.get(url + `/${rocket}`)
      .then(resp => {
        resp.data = clearData(resp.data);
        bot.sendMessage(chatId, rocketHTMLTemplate(resp.data), { parse_mode: 'HTML' });
      })
      .catch(err => {
        bot.sendMessage(chatId, `Ooops...I could get information about ${rocket}`);
        console.log(err);
      });
  } else if (launch) {
    axios.get(url + `/${launch}`)
      .then(resp => {
        resp.data = clearData(resp.data);
        bot.sendMessage(chatId, launchHTMLTemplate(resp.data), { parse_mode: 'HTML' });
      })
      .catch(err => {
        bot.sendMessage(chatId, `Ooops...I could get information about ${launch}`);
        console.log(err);
      });
  } else if (launchpad) {
    axios.get(url + `/${launchpad}`)
      .then(resp => {
        resp.data = clearData(resp.data);
        bot.sendMessage(chatId, launchPadHTMLTemplate(resp.data), { parse_mode: 'HTML' });
        bot.sendLocation(chatId, resp.data.location.latitude, resp.data.location.longitude);
      })
      .catch(err => {
        bot.sendMessage(chatId, `Ooops...I could get information about ${launchpad}`);
        console.log(err);
      });
  } else {
    axios.get(type[request]['url'])
      .then(resp => {
        for (let el of resp.data) {
          el = clearData(el);
          bot.sendMessage(chatId, type[request]['template'](el), { parse_mode: 'HTML' });
        }
      })
      .catch(err => {
        bot.sendMessage(chatId, 'Ooops...I couldn\'t get information');
        console.log(err);
      });
  }
};

bot.onText(/\/rocket (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const request = 'r';
  const rocket = match[1];
  if (rocket === undefined) {
    bot.sendMessage(chatId, 'Please provide rocket name');
    return;
  }
  getInfo(type[request]['url'], rocket.toLowerCase(), null, null, chatId, request);
});

bot.onText(/\/rockets/, msg => {
  const chatId = msg.chat.id;
  const request = 'r';
  getInfo(type[request]['url'], null, null, null, chatId, request);
});

bot.onText(/\/launches/, msg => {
  const chatId = msg.chat.id;
  const request = 'l';
  getInfo(type[request]['url'], null, null, null, chatId, request);
});

bot.onText(/\/nextlaunch/, msg => {
  const chatId = msg.chat.id;
  const request = 'l';
  getInfo(type[request]['next'], null, 'next', null, chatId, request);
});

bot.onText(/\/missions/, msg => {
  const chatId = msg.chat.id;
  const request = 'm';
  getInfo(type[request]['url'], null, null, null, chatId, request);
});

bot.onText(/\/launchpads/, msg => {
  const chatId = msg.chat.id;
  const request = 'lp';
  getInfo(type[request]['url'], null, null, null, chatId, request);
});

bot.onText(/\/launchpad (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const request = 'lp';
  const launchpad = match[1];
  if (launchpad === undefined) {
    bot.sendMessage(chatId, 'Please provide rocket name');
    return;
  }
  getInfo(type[request]['url'], null, null, launchpad.toLowerCase(), chatId, request);
});


// Listener (handler) for telegram's /start event
bot.onText(/\/start/, msg => {
  const chatId = msg.chat.id;
  bot.sendMessage(
    chatId,
    `Welcome at <b>Space Bot</b>, thank you for using this bot
Type /help for looking for available commands
    `, { parse_mode: 'HTML' }
  );
});

// Listener (handler) for telegram's /help event
bot.onText(/\/help/, msg => {
  const chatId = msg.chat.id;
  const response = `
Hi!
Here you can see commands that you can type for this bot:
/rocket <b>id</b> - get information about rocket.
/rockets - get information about all rockets.
/launches - get information about next 4 launches.
/missions - get information about missions.
/nextlaunch - get information about next launch.
/help - look for available commands.
    `;
  bot.sendMessage(chatId, response, { parse_mode: 'HTML' });
});

// Listen for errors
bot.on('polling_error', err => console.log(err));

console.log('Bot is working...');
