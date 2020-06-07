# Space bot

Hi! This is the bot in Telegram for showing *information* from **SpaceX API**. Built on Node.js.

>[link](https://t.me/spacex_mezgoodle_bot) to bot

# Table of contents
  * [Motivation](#motivation)
  * [Build status](#build-status)
  * [Code style](#code-style)
  * [Screenshots](#screenshots)
  * [Tech framework used](#tech-framework-used)
  * [Dependencies](#dependencies)
  * [Features](#features)
  * [Code Example](#code-example)
  * [Installation](#installation)
  * [API Reference](#api-reference)
  * [Tests](#tests)
  * [Deploy](#deploy)
  * [Contribute](#contribute)
  * [Contact](#contact)
  * [License](#license)

## Motivation

After another rocket launch [SpaceX](https://www.spacex.com/), I decided to look for the [API](https://en.wikipedia.org/wiki/Application_programming_interface). At the same time, I found a video on [YouTube](https://www.youtube.com/) showing how to use **SpaceX API** along with [GraphQL](https://graphql.org/). Since I am interested in developing [Telegram](https://telegram.org/) bots, I decided to make another one. :smiley:

## Build status

[![Build Status](https://travis-ci.com/mezgoodle/space-bot.svg?branch=master)](https://travis-ci.com/mezgoodle/space-bot)

## Code style

[![Codacy Badge](https://app.codacy.com/project/badge/Grade/08a26f3bd7e64d4597c2f016a3d45eb6)](https://www.codacy.com/manual/mezgoodle/space-bot?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=mezgoodle/space-bot&amp;utm_campaign=Badge_Grade)

## Screenshots

![Screenshot 1](https://github.com/mezgoodle/images/blob/master/space-bot1.png)

![Screenshot 2](https://github.com/mezgoodle/images/blob/master/space-bot2.png)

![Screenshot 3](https://github.com/mezgoodle/images/blob/master/space-bot3.png)

![Screenshot 4](https://github.com/mezgoodle/images/blob/master/space-bot4.png)

![Screenshot 5](https://github.com/mezgoodle/images/blob/master/space-bot5.png)

![Screenshot 6](https://github.com/mezgoodle/images/blob/master/space-bot5.png)

## Tech framework used

**Built with**
 - [Node.js](https://nodejs.org/uk/)
 - [node-telegram-bot-api](https://github.com/yagop/node-telegram-bot-api)
 - [axios](https://www.npmjs.com/package/axios)
 
 ## Dependencies
 
 ![David](https://img.shields.io/david/mezgoodle/space-bot)
 
 > You can see all dependencies in `package.json` [here](https://github.com/mezgoodle/space-bot/network/dependencies)

## Features

- /rocket **id** - get information about rocket.

- /rockets - get information about all rockets.

- /launches - get information about next 4 launches.

- /missions - get information about missions.

- /nextlaunch - get information about next launch.

- /launchpads - get information about launchpads.

- /launchpad **site id** - get information about launchpad.

## Code Example

 - Main function

```js
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
```

- Convert timestamp function

```js
// Convert time and date from timstamp to string
const convertTime = timestamp => {
  const date = new Date(timestamp * 1000);
  const hours = date.getHours();
  const minutes = '0' + date.getMinutes();
  const seconds = '0' + date.getSeconds();
  const formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
  return formattedTime;
};

const convertDate = timestamp => {
  const date = new Date(timestamp * 1000);
  const month = months[date.getMonth()];
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  const output = month + ' ' + day + ',' + year;
  return output;
};
```

## Installation

1. Clone this repository

```bash
git clone https://github.com/mezgoodle/space-bot.git
```

2. Use the package manager [npm](http://www.npmjs.com/) to install dependencies.

```bash
npm install
```

3. Rename `.env_sample` to `.env` and fill the variables like:

```bash
TELEGRAM_TOKEN = "<YOUR_TELEGRAM_TOKEN>"
CHAT_ID = "<YOUR_CHAT_ID_FOR_TESTS>"
```

4. Type in terminal:

```bash
npm start
```

## API Reference

Here I am using two main API services:
 - [Telegram Bot API](https://core.telegram.org/bots/api)
 - [SpaceX API](https://docs.spacexdata.com/?version=latest)

## Tests

I do unit testing with [jest](https://jestjs.io/). Data of tests is in [data.json](https://github.com/mezgoodle/space-bot/blob/master/test/data.json).

Run tests by typing command in terminal like:

```bash
npm test
```

I give you the [link](https://travis-ci.com/github/mezgoodle/space-bot) to Travis CI, where you can see all my tests.

## Deploy

I use direct connection for deploying to [Heroku](https://www.heroku.com/). 

## Contribute

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## Contact

If you have questions write me here: 
  *   [Telegram](https://t.me/sylvenis)
  *   [Gmail](mailto:mezgoodle@gmail.com)
  *   [Facebook](https://www.facebook.com/profile.php?id=100005721694357)

## License

![GitHub](https://img.shields.io/github/license/mezgoodle/space-bot)

MIT © [mezgoodle](https://github.com/mezgoodle)