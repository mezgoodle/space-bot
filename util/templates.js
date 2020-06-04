'use strict';

const emojies = {
  'true': '✔️',
  'false': '❌'
};

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

const missionHTMLTemplate = mission => (
  `🚀<b>${mission.mission_name}</b>
    🆔Mission ID: ${mission.mission_id}
    👷Manufacturers: ${mission.manufacturers}
    📚Description: <b>${mission.description}</b>
    🔗Site: <a href="${mission.website}">link</a>
      `
);

module.exports = { rocketHTMLTemplate, launchHTMLTemplate, missionHTMLTemplate };
