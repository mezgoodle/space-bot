'use strict';

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

module.exports = { convertTime, convertDate };
