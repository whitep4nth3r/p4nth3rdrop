import Socket from "./socket";
import tmi from "tmi.js";
import clipImage from "./white_circle.png";
import clipImageBig from "./white_circle_big.png";
import Drop from "./Drop";
import ImageManager from "./ImageManager";
import config from "./config";
import emotes from "./emotes";
import utils from "./utils";

const socket = new Socket(process.env.REACT_APP_MAINFRAME_WEBSOCKET, {
  reconnect: true,
});

socket.on("close", () => {
  console.log("closed");
});

// soon this will be deprecated
const client = new tmi.Client({
  connection: {
    secure: true,
    reconnect: true,
  },
  channels: [config.broadcaster.username],
});

client.connect();

/**
 * @param {import('p5')} p5
 */
export default function Sketch(p5) {
  let drops = [];
  let dropQueue = [];
  const imageManager = new ImageManager(p5);
  let trailing = false;

  const strategies = {
    dropRandomSizedPanthers: (dropConfig) => {
      rain(
        utils.getRandomSizedPantherEmotes(),
        dropConfig.emoteMultiplier,
        dropConfig.velocities
      );
    },
    dropSpecificSizedPanthers: (dropConfig) => {
      rain(
        utils.getPantherEmotes(dropConfig.size),
        dropConfig.emoteMultiplier,
        dropConfig.velocities
      );
    },
  };

  socket.on("sub", async (data) => {
    bigDropUser(data.data.logoUrl);
    rain(
      utils.getRandomSizedPantherEmotes(),
      config.drops["!rain"].emoteMultiplier,
      config.drops["!rain"].velocities
    );
  });

  socket.on("dropuser", async (data) => {
    dropUser(data.data.logoUrl);
  });

  socket.on("dropemotes", async (data) => {
    const dropConfig = config.drops[data.data.dropType];
    if (dropConfig) {
      data.data.emoteUrls.forEach(async (emoteUrl) => {
        const image = await imageManager.getImage(emoteUrl);
        queueDrop(image, dropConfig.velocities);
      });
    }
  });

  socket.on("weather", async (data) => {
    const dropConfig = config.drops[data.data.weatherEvent];
    if (dropConfig) {
      strategies[dropConfig.strategy](dropConfig, data.data.weatherEvent);
    }
  });

  socket.on("raid", async (data) => {
    eventRain(data.data.raiderCount);
  });

  socket.on("cheer", async (data) => {
    const rawBits = parseInt(data.data.bitCount, 10);

    const dropBits =
      rawBits < config.maxVisibleDrops ? rawBits : config.maxVisibleDrops;

    eventRain(dropBits);
  });

  socket.on("specialuserrain", async (data) => {
    specialUserEvent(data.data.username);
  });

  const queueDrop = (image, velocity) => {
    if (drops.length <= config.maxVisibleDrops) {
      drops.push(new Drop(p5, image, velocity));
    } else {
      dropQueue.push(new Drop(p5, image, velocity));
    }
  };

  const rain = async (emotes, emoteMultiplier, velocity) => {
    const images = await Promise.all(
      emotes.map((url) => imageManager.getImage(url))
    );

    while (emoteMultiplier--) {
      images.map((image) => queueDrop(image, velocity));
    }
  };

  const eventRain = (emoteCount) => {
    const emotes = [];

    while (emoteCount--) {
      emotes.push(p5.random(utils.getRandomSizedPantherEmotes()));
    }

    rain(emotes, 1, config.drops["!rain"].velocities);
  };

  const specialUserEvent = (username) => {
    rain(
      utils.getSpecialUserEmotes(username),
      5,
      config.drops["!rain"].velocities
    );
  };

  client.on("message", async (channel, tags, message, self) => {
    if (tags.username === config.broadcaster.username) {
      if (message === config.broadcaster.commands.startTrail)
        return (trailing = true);
      else if (message === config.broadcaster.commands.endTrail)
        return (trailing = false);
      else if (message.match(/^!drop-timeout/)) {
        const timeout = Number(message.split(" ")[1]);
        if (!isNaN(timeout)) {
          config.dropTimeout = timeout * 1000;
        }
      }
    }
  });

  const bigDropUser = async (imgUrl) => {
    const image = await imageManager.getImage(imgUrl);
    const clip = await imageManager.getImage(clipImageBig);

    image.mask(clip);
    queueDrop(image, config.drops["!drop"].velocities);
  };

  const dropUser = async (imgUrl) => {
    const _image = imgUrl.replace("300x300", "50x50");
    const image = await imageManager.getImage(_image);
    const clip = await imageManager.getImage(clipImage);

    image.mask(clip);
    queueDrop(image, config.drops["!drop"].velocities);
  };

  p5.setup = async () => {
    p5.frameRate(60);
    p5.createCanvas(p5.windowWidth, p5.windowHeight, p5.P2D);

    if (config.test) {
      // not added to queue for testing
      const images = await Promise.all(
        utils
          .getPantherEmotes(emotes.sizes[1])
          .map((url) => imageManager.getImage(url))
      );
      drops = Array.from({ length: 10 }).reduce((drops) => {
        return drops.concat(
          images.map(
            (image) => new Drop(p5, image, config.drops["!rain"].velocities)
          )
        );
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
      drops = drops.concat(dropQueue.slice(0, end));
      dropQueue = dropQueue.slice(end);
    }
  };
}
