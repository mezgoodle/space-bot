'use strict';

const axios = require('axios');
require('dotenv').config();
const Token = process.env.TELEGRAM_TOKEN;
const ChatId = process.env.CHAT_ID;

const fetchAPISPace = variant => axios
  .get(`https://api.spacexdata.com/v3/${variant}`)
  .then(response => response.data)
  .catch(err => console.log(err));

const fetchAPITelegram = (method, data) => axios
  .get(`https://api.telegram.org/bot${Token}/${method}?chat_id=${ChatId}&${data}`)
  .then(response => response.data)
  .catch(err => console.log(err));


module.exports = { fetchAPISPace, fetchAPITelegram };
