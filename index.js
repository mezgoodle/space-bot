'use strict';

const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const { Token } = require('./config');

const urls = {
  'rockets': 'https://api.spacexdata.com/v3/rockets',
  'launches': 'https://api.spacexdata.com/v3/launches',
};

const emojies = {
  'true': '✔️',
  'false': '❌'
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
  `
);

const getInfo = (url, rocket = null, launch = null, chatId, type = 'r') => {
  if (rocket) {
    axios.get(url + `/${rocket}`)
      .then(resp => bot.sendMessage(chatId, rocketHTMLTemplate(resp.data), { parse_mode: 'HTML' }))
      .catch(err => {
        bot.sendMessage(chatId, `Ooops...I could get weather information about ${rocket}`);
        console.log(err);
      });
  } else {
    axios.get(url)
      .then(resp => {
        for (const rocket of resp.data) {
          bot.sendMessage(chatId, rocketHTMLTemplate(rocket), { parse_mode: 'HTML' });
        }
      })
      .catch(err => {
        bot.sendMessage(chatId, 'Ooops...I could get weather information about rockets');
        console.log(err);
      });
  }
};

bot.onText(/\/rocket (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const rocket = match[1];
  if (rocket === undefined) {
    bot.sendMessage(chatId, 'Please provide rocket name');
    return;
  }
  getInfo(urls['rockets'], rocket.toLowerCase(), chatId);
});

bot.onText(/\/rockets/, msg => {
  const chatId = msg.chat.id;
  getInfo(urls['rockets'], null, chatId);
bot.onText(/\/launches/, msg => {
  const chatId = msg.chat.id;
  getInfo(urls['launches'], null, null, chatId, 'l');
});

bot.onText(/\/nextlaunch/, msg => {
  const chatId = msg.chat.id;
  getInfo(urls['launches'], null, 'next', chatId, 'l');
});
