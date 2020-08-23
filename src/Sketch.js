/* eslint-disable no-param-reassign */

import tmi from 'tmi.js';
import clipImage from './white_circle.png';
import clipImageBig from './white_circle_big.png';
import Drop from './Drop';
import ImageManager from './ImageManager';
import config from './config';
import emotes from './emotes';
import utils from './utils';
import UserManager from './UserManager';

const client = new tmi.Client({
	connection: {
		secure: true,
		reconnect: true
	},
	channels: [ config.broadcaster.username ]
});

client.connect();				

/**
 * @param {import('p5')} p5
 */
export default function Sketch(p5) {
  let drops = [];
  let dropQueue = [];
  const imageManager = new ImageManager(p5);
  const userManager = new UserManager();
  let trailing = false;

  const queueDrop = (image, velocity) => {
    if (drops.length <= config.maxVisibleDrops) {
      drops.push(new Drop(p5, image, velocity));
    } else {
      dropQueue.push(new Drop(p5, image, velocity));
    }
  };

  const rain = async (emotes, emoteMultiplier, velocity) => {
    const images = await Promise.all(emotes.map(url => imageManager.getImage(url)));

    while (emoteMultiplier--) {
      images.map(image => queueDrop(image, velocity));
    }
  }

  const eventRain = (emoteCount) => {
    const emotes = []

    while (emoteCount--) {
      emotes.push(
        p5.random(utils.getRandomSizedPantherEmotes()))
    }

    rain(emotes, 1, config.drops.rain.velocities);
  }

  const specialUserEvent = (username) => {
    rain(utils.getSpecialUserEmotes(username), 1, config.drops.rain.velocities);
  }

  client.on("join", (channel, username, self) => {
    if (config.specialUsers.includes(username)) {
      specialUserEvent(username);
    }
  });

  client.on("cheer", (channel, userstate, message) => {
    eventRain(userstate.bits);
  });

  client.on("raided", (channel, username, viewers) => {
    eventRain(viewers);
  });

  client.on("anongiftpaidupgrade", async (channel, username, userstate) => {
    const userId = userstate.user_id;
    const user = await userManager.getUser(userId);
    dropUser(user, true)
    rain(utils.getRandomSizedPantherEmotes(), config.drops.rain.emoteMultiplier, config.drops.rain.velocities); 
  });

  client.on("giftpaidupgrade", async (channel, username, sender, userstate) => {
    const userId = userstate.user_id;
    const user = await userManager.getUser(userId);
    dropUser(user, true)
    rain(utils.getRandomSizedPantherEmotes(), config.drops.rain.emoteMultiplier, config.drops.rain.velocities); 
  });

  client.on("resub", async (channel, username, months, message, userstate, methods) => {
    const userId = userstate.user_id;
    const user = await userManager.getUser(userId);
    dropUser(user, true)
    rain(utils.getRandomSizedPantherEmotes(), 
      config.drops.rain.emoteMultiplier, 
      config.drops.rain.velocities); 
  });

  client.on("submysterygift", async (channel, username, numbOfSubs, methods, userstate) => {
    const userId = userstate.user_id;
    const user = await userManager.getUser(userId);
    dropUser(user, true)
    rain(utils.getRandomSizedPantherEmotes(), 
      config.drops.rain.emoteMultiplier, 
      config.drops.rain.velocities); 
  });

  client.on("subgift", async (channel, username, streakMonths, recipient, methods, userstate) => {
    const userId = userstate.user_id;
    const user = await userManager.getUser(userId);
    dropUser(user, true)
    rain(utils.getRandomSizedPantherEmotes(), 
      config.drops.rain.emoteMultiplier, 
      config.drops.rain.velocities);
  });

  client.on("subscription", async (channel, username, method, message, userstate) => {
    const userId = userstate.user_id;
    const user = await userManager.getUser(userId);
    dropUser(user, true)
    rain(utils.getRandomSizedPantherEmotes(), 
      config.drops.rain.emoteMultiplier, 
      config.drops.rain.velocities);
  });

  client.on('message', async (channel, tags, message, self) => {
    if (tags.username === config.broadcaster.username) {
      if (message === config.broadcaster.commands.startTrail) return trailing = true;
      else if (message === config.broadcaster.commands.endTrail) return trailing = false;
      else if (message.match(/^!drop-timeout/)) {
        const timeout = Number(message.split(' ')[1]);
        if (!isNaN(timeout)) {
          config.dropTimeout = timeout * 1000;
        }
      }
    }

    if (message.startsWith(config.drops.blizzard.command)) {
      rain(utils.getRandomSizedPantherEmotes(), 
      config.drops.blizzard.emoteMultiplier, 
      config.drops.blizzard.velocities);
    }

    else if (message.startsWith(config.drops.hail.command)) {
      rain(utils.getRandomSizedPantherEmotes(), 
      config.drops.hail.emoteMultiplier, 
      config.drops.hail.velocities);
    }

    else if (message.startsWith(config.drops.rain.command)) {
      rain(utils.getPantherEmotes(emotes.sizes[1]), 
      config.drops.rain.emoteMultiplier, config.drops.rain.velocities);
    }

    else if (message.startsWith(config.drops.snow.command)) {
      rain(utils.getPantherEmotes(emotes.sizes[0]), 
      config.drops.snow.emoteMultiplier, 
      config.drops.snow.velocities);
    }

    else if (message.startsWith(config.drops.shower.command)) {
      rain(utils.getPantherEmotes(emotes.sizes[1]), 
      config.drops.shower.emoteMultiplier, 
      config.drops.shower.velocities);
    }

    else if (message.startsWith(config.drops.drop.command) 
    || message.startsWith(config.drops.bigDrop.command)) {

      const imgSize = message.startsWith(config.drops.bigDrop.command) ? emotes.sizes[2] : emotes.sizes[1]

      if (tags.emotes) {
        const emoteIds = Object.keys(tags.emotes);
        // const emoteId = p5.random(emoteIds);
        emoteIds.forEach(async (emoteId) => {
          const imageUrl = `${emotes.baseUrl}${emoteId}/${imgSize}`;
          const image = await imageManager.getImage(imageUrl);
          queueDrop(image, config.drops.drop.velocities);
        })
      } else if (message.match(/\bme\b/)) {
          const userId = tags['user-id'];
          const user = await userManager.getUser(userId);

          if (Date.now() - new Date(user.created_at) >= config.minAccountAge) {
            dropUser(user)
          }
      }
    }
  });


  const dropUser = async (user, big = false) => {
    // TODO: make sure this sizing doesn't break...
    const _image = big ? user.logo : user.logo.replace('300x300', '50x50');
    const _clipImage = big ? clipImageBig : clipImage;

    const image = await imageManager.getImage(_image);
    const clip = await imageManager.getImage(_clipImage);

    image.mask(clip);
    queueDrop(image, config.drops.user.velocities);
  }


  p5.setup = async () => {
    p5.frameRate(60);
    p5.createCanvas(p5.windowWidth, p5.windowHeight, p5.P2D);
   
    if (config.test) {
      // specialUserEvent('thatn00b__');

      // not added to queue for testing
      const images = await Promise.all(utils.getPantherEmotes(emotes.sizes[1]).map(url => imageManager.getImage(url)));
      drops = Array.from({ length: 10 }).reduce((drops) => {
        return drops.concat(images.map(image => new Drop(p5, image, config.drops.rain.velocities)));
      }, []);
    }
  };
  
  p5.draw = () => {
    if (!trailing) p5.clear();
    const now = Date.now();
    drops = drops.filter((drop) => {
      drop.update();
      return !drop.draw(now);
    });
    if (drops.length <= config.maxVisibleDrops) {
      const end = config.maxVisibleDrops - drops.length;
      drops = drops.concat(dropQueue.slice(0, end))
      dropQueue = dropQueue.slice(end);
    }
  };
}