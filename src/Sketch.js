/* eslint-disable no-param-reassign */

import tmi from 'tmi.js';
import clipImage from './white_circle.png';
import Drop from './Drop';
import ImageManager from './ImageManager';
import config from './config';
import UserManager from './UserManager';

const client = new tmi.Client({
	connection: {
		secure: true,
		reconnect: true
	},
	channels: [ config.broadcaster ]
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

  const queueDrop = (image, velocity1, velocity2) => {
    if (drops.length <= config.maxVisibleDrops) {
      drops.push(new Drop(p5, image, velocity1, velocity2));
    } else {
      dropQueue.push(new Drop(p5, image, velocity1, velocity2));
    }
  };

  const rain = async (emotes, imgMultiplier, velocity1, velocity2) => {
    const images = await Promise.all(emotes.map(url => imageManager.getImage(url)));

    while (imgMultiplier--) {
      images.map(image => queueDrop(image, velocity1, velocity2));
    }
  }

  const eventRain = (emoteCount) => {
    const emotes = []

    while (emoteCount--) {
      emotes.push(
        p5.random(getRandomSizedEmotes()))
    }

    rain(emotes, 1);
  }

  client.on("cheer", (channel, userstate, message) => {
    eventRain(userstate.bits);
  });

  client.on("raided", (channel, username, viewers) => {
    eventRain(viewers);
  });

  client.on("anongiftpaidupgrade", (channel, username, userstate) => {
    rain(getRandomSizedEmotes(), 20); 
  });

  client.on("giftpaidupgrade", (channel, username, sender, userstate) => {
    rain(getRandomSizedEmotes(), 20); 
  });

  client.on("resub", (channel, username, months, message, userstate, methods) => {
    rain(getRandomSizedEmotes(), 20); 
  });

  client.on("submysterygift", (channel, username, numbOfSubs, methods, userstate) => {
    rain(getRandomSizedEmotes(), 20); 
  });

  client.on("subgift", (channel, username, streakMonths, recipient, methods, userstate) => {
    rain(getRandomSizedEmotes(), 20);
  });

  client.on("subscription", (channel, username, method, message, userstate) => {
    rain(getRandomSizedEmotes(), 20);
  });

  client.on('message', async (channel, tags, message, self) => {
    if (tags.username === config.broadcaster) {
      if (message === '!start-trail') return trailing = true;
      else if (message === '!end-trail') return trailing = false;
      else if (message.match(/^!drop-timeout/)) {
        const timeout = Number(message.split(' ')[1]);
        if (!isNaN(timeout)) {
          config.dropTimeout = timeout * 1000;
        }
      }
    }
    if (message.startsWith('!blizzard')) {
      rain(getRandomSizedEmotes(), 30, 20, 30);
    }
    else if (message.startsWith('!hail')) {
      rain(getRandomSizedEmotes(), 15);
    }
    else if (message.startsWith('!rain')) {
      rain(config.weatherEmotes, 15);
    }
    else if (message.startsWith('!snow')) {
      rain(config.weatherEmotes, 10, 1, 2);
    }
    else if (message.startsWith('!shower')) {
      rain(config.weatherEmotes, 5);
    }
    else if (message.startsWith('!drop') || message.startsWith('!bigdrop')) {

      const imgSize = message.startsWith('!bigdrop') ? '3.0' : '2.0'

      if (tags.emotes) {
        const emoteIds = Object.keys(tags.emotes);
        // choose random emote if too many viewers decide to drop all the emotes
        // const emoteId = p5.random(emoteIds);

        emoteIds.forEach(async (emoteId) => {
          const imageUrl = `https://static-cdn.jtvnw.net/emoticons/v1/${emoteId}/${imgSize}`;
          const image = await imageManager.getImage(imageUrl);
          queueDrop(image);
        })
      } else if (message.match(/\bme\b/)) {
        const userId = tags['user-id'];
        const user = await userManager.getUser(userId);
        if (Date.now() - new Date(user.created_at) >= config.minAccountAge) {
          // TODO: make sure this sizing doesn't break...
          const imageUrl = user.logo.replace('300x300', '50x50');
          const image = await imageManager.getImage(imageUrl);
          const clip = await imageManager.getImage(clipImage);
          image.mask(clip);
          queueDrop(image);
        }
      }
    }
  });

  p5.setup = async () => {
    p5.frameRate(60);
    p5.createCanvas(p5.windowWidth, p5.windowHeight, p5.P2D);
    if (config.test) {
      // not added to queue for testing
      const images = await Promise.all(config.weatherEmotes.map(url => imageManager.getImage(url)));
      drops = Array.from({ length: 10 }).reduce((drops) => {
        return drops.concat(images.map(image => new Drop(p5, image)));
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

  const getRandomSizedEmotes = () => {
    const imageSizes = ['2.0', '3.0'];
      
    return [
      `https://static-cdn.jtvnw.net/emoticons/v1/303132133/${imageSizes[Math.round(Math.random())]}`,
      `https://static-cdn.jtvnw.net/emoticons/v1/303132137/${imageSizes[Math.round(Math.random())]}`,
      `https://static-cdn.jtvnw.net/emoticons/v1/302880696/${imageSizes[Math.round(Math.random())]}`,
      `https://static-cdn.jtvnw.net/emoticons/v1/302880702/${imageSizes[Math.round(Math.random())]}`,
      `https://static-cdn.jtvnw.net/emoticons/v1/302880692/${imageSizes[Math.round(Math.random())]}`,
    ]
  }
}