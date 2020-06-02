'use strict';

const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const { Token } = require('./config');

const emojies = {
  'true': '✔️',
  'false': '❌'
};

// Template for rocket response
const rocketHTMLTemplate = rocket => (
  `🚀<b>${rocket.rocket_name}</b>
   🆔Rocket ID: ${rocket.rocket_id}
    Active: ${emojies[rocket.active]}
   🔥First flight: <b>${rocket.first_flight}</b>
   🏠Country: <b>${rocket.country}</b>
   📚Description: <b>${rocket.description}</b>
   🔗Wikipedia: <a href="${rocket.wikipedia}">link</a>
  `
);

// Template for launch response
const launchHTMLTemplate = launch => (
  `🚀<b>${launch.mission_name}</b>
   🆔Rocket name: ${launch.rocket.rocket_name}
    Upcoming: ${emojies[launch.upcoming]}
   🔥Launch date: <b>${launch.launch_date_local}</b>
   🕓Last date update: <b>${launch.last_date_update}</b>
   📚Details: <b>${launch.details}</b>
   🔗Site: <a href="${launch.links.reddit_launch}">link</a>
  `
);

const type = {
  'r': { 'url': 'https://api.spacexdata.com/v3/rockets', 'template': rocketHTMLTemplate },
  'l': { 'url': 'https://api.spacexdata.com/v3/launches', 'template': launchHTMLTemplate },
};

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

const getInfo = (url, rocket = null, launch = null, chatId, request = 'r') => {
  if (rocket) {
    axios.get(url + `/${rocket}`)
      .then(resp => bot.sendMessage(chatId, rocketHTMLTemplate(resp.data), { parse_mode: 'HTML' }))
      .catch(err => {
        bot.sendMessage(chatId, `Ooops...I could get information about ${rocket}`);
        console.log(err);
      });
  } else if (launch) {
    axios.get(url + `/${launch}`)
      .then(resp => bot.sendMessage(chatId, launchHTMLTemplate(resp.data), { parse_mode: 'HTML' }))
      .catch(err => {
        bot.sendMessage(chatId, `Ooops...I could get information about ${launch}`);
        console.log(err);
      });
  } else {
    axios.get(type[request]['url'])
      .then(resp => {
        for (const el of resp.data) {
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
  getInfo(type[request]['url'], rocket.toLowerCase(), null, chatId, request);
});

bot.onText(/\/rockets/, msg => {
  const chatId = msg.chat.id;
  const request = 'r';
  getInfo(type[request]['url'], null, null, chatId, request);
});

bot.onText(/\/launches/, msg => {
  const chatId = msg.chat.id;
  const request = 'l';
  getInfo(type[request]['url'], null, null, chatId, request);
});

bot.onText(/\/nextlaunch/, msg => {
  const chatId = msg.chat.id;
  const request = 'l';
  getInfo(type[request]['url'], null, 'next', chatId, request);
});
