'use strict';

const data = require('./data.json');
const { fetchAPITelegram, fetchAPISPace } = require('./util');

describe.each(data.api_telegram)('Testing Telegram API:', (name, method, data, expected) => {
  test(name, () => {
    fetchAPITelegram(method, data).then(data => {
      expect(data.ok).toEqual(expected);
    });
  });
});

describe.each(data.api_space)('Testing Space API:', (name, variant, element, expected) => {
  test(name, () => {
    fetchAPISPace(variant).then(data => {
      expect(data[0][element]).toEqual(expected);
    });
  });
});
