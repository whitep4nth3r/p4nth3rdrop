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

  const queueDrop = (image, velocity) => {
    if (drops.length <= config.maxVisibleDrops) {
      drops.push(new Drop(p5, image, velocity));
    } else {
      dropQueue.push(new Drop(p5, image, velocity));
    }
  };

  const rain = async (emotes, imgMultiplier, velocity) => {
    const images = await Promise.all(emotes.map(url => imageManager.getImage(url)));

    while (imgMultiplier--) {
      images.map(image => queueDrop(image, velocity));
    }
  }

  const eventRain = (emoteCount) => {
    const emotes = []

    while (emoteCount--) {
      emotes.push(
        p5.random(utils.getRandomSizedPantherEmotes()))
    }

    rain(emotes, 1, config.dropVelocities.default);
  }

  const specialUserEvent = (username) => {
    rain(utils.getSpecialUserEmotes(username), 1, config.dropVelocities.default);
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
    rain(utils.getRandomSizedPantherEmotes(), 20, config.dropVelocities.default); 
  });

  client.on("giftpaidupgrade", async (channel, username, sender, userstate) => {
    const userId = userstate.user_id;
    const user = await userManager.getUser(userId);
    dropUser(user, true)
    rain(utils.getRandomSizedPantherEmotes(), 20, config.dropVelocities.default); 
  });

  client.on("resub", async (channel, username, months, message, userstate, methods) => {
    const userId = userstate.user_id;
    const user = await userManager.getUser(userId);
    dropUser(user, true)
    rain(utils.getRandomSizedPantherEmotes(), 20, config.dropVelocities.default); 
  });

  client.on("submysterygift", async (channel, username, numbOfSubs, methods, userstate) => {
    const userId = userstate.user_id;
    const user = await userManager.getUser(userId);
    dropUser(user, true)
    rain(utils.getRandomSizedPantherEmotes(), 20, config.dropVelocities.default); 
  });

  client.on("subgift", async (channel, username, streakMonths, recipient, methods, userstate) => {
    const userId = userstate.user_id;
    const user = await userManager.getUser(userId);
    dropUser(user, true)
    rain(utils.getRandomSizedPantherEmotes(), 20, config.dropVelocities.default);
  });

  client.on("subscription", async (channel, username, method, message, userstate) => {
    const userId = userstate.user_id;
    const user = await userManager.getUser(userId);
    dropUser(user, true)
    rain(utils.getRandomSizedPantherEmotes(), 20, config.dropVelocities.default);
  });

  client.on('message', async (channel, tags, message, self) => {
    if (tags.username === config.broadcaster) {
      if (message === config.chatCommands.startTrail) return trailing = true;
      else if (message === config.chatCommands.endTrail) return trailing = false;
      else if (message.match(/^!drop-timeout/)) {
        const timeout = Number(message.split(' ')[1]);
        if (!isNaN(timeout)) {
          config.dropTimeout = timeout * 1000;
        }
      }
    }

    if (message.startsWith(config.chatCommands.blizzard)) {
      rain(utils.getRandomSizedPantherEmotes(), 30, config.dropVelocities.blizzard);
    }

    else if (message.startsWith(config.chatCommands.hail)) {
      rain(utils.getRandomSizedPantherEmotes(), 15, config.dropVelocities.default);
    }

    else if (message.startsWith(config.chatCommands.rain)) {
      console.log('rain command');
      rain(utils.getPantherEmotes(emotes.sizes[1]), 15, config.dropVelocities.default);
    }

    else if (message.startsWith(config.chatCommands.snow)) {
      rain(utils.getPantherEmotes(emotes.sizes[0]), 10, config.dropVelocities.snow);
    }

    else if (message.startsWith(config.chatCommands.shower)) {
      rain(utils.getPantherEmotes(emotes.sizes[1]), 5, config.dropVelocities.default);
    }

    else if (message.startsWith(config.chatCommands.drop) || message.startsWith('!bigdrop')) {

      const imgSize = message.startsWith(config.chatCommands.bigDrop) ? emotes.sizes[2] : emotes.sizes[1]

      if (tags.emotes) {
        const emoteIds = Object.keys(tags.emotes);
        // const emoteId = p5.random(emoteIds);
        emoteIds.forEach(async (emoteId) => {
          const imageUrl = `${emotes.baseUrl}${emoteId}/${imgSize}`;
          const image = await imageManager.getImage(imageUrl);
          queueDrop(image);
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
    queueDrop(image, config.dropVelocities.user);
  }


  p5.setup = async () => {
    p5.frameRate(60);
    p5.createCanvas(p5.windowWidth, p5.windowHeight, p5.P2D);
   
    if (config.test) {
      // specialUserEvent('thatn00b__');

      // not added to queue for testing
      const images = await Promise.all(utils.getPantherEmotes(emotes.sizes[1]).map(url => imageManager.getImage(url)));
      drops = Array.from({ length: 10 }).reduce((drops) => {
        return drops.concat(images.map(image => new Drop(p5, image, config.dropVelocities.default)));
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