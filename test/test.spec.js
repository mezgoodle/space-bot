'use strict';

const data = require('./data.json');
const { fetchAPITelegram, fetchAPISPace } = require('./util');
const {convertTime} = require('../util/converter');

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

describe.each(data.convert_time)('Converting time from timestamp:', (timestamp, expected) => {
  test('from timestamp to string', () => {
    expect(convertTime(timestamp)).toBe(expected);
  });
});