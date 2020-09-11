import Socket from "./socket";
import clipImage from "./white_circle.png";
import clipImageBig from "./white_circle_big.png";
import Drop from "./Drop";
import ImageManager from "./ImageManager";
import { config } from "./config";
import { emotes } from "./emotes";
import utils from "./utils";
import P5 from "p5";
import { Velocity, DropInstance, DropConfig, Strategies } from "./types";

const socket = new Socket(process.env.REACT_APP_MAINFRAME_WEBSOCKET, {
  reconnect: true,
});

socket.on("close", () => {
  console.log("closed");
});

function Sketch(p5: P5) {
  let drops: any[] = [];
  let dropQueue: DropInstance[] = [];

  const imageManager = new ImageManager(p5);
  let trailing = false;

  const strategies: Strategies = {
    dropRandomSizedPanthers: (dropConfig: DropConfig) => {
      rain(
        utils.getRandomSizedPantherEmotes(),
        dropConfig.emoteMultiplier,
        dropConfig.velocities
      );
    },
    dropSpecificSizedPanthers: (dropConfig: DropConfig) => {
      rain(
        utils.getPantherEmotes(dropConfig.size as string),
        dropConfig.emoteMultiplier,
        dropConfig.velocities
      );
    },
  };

  socket.on("sub", async (data: any) => {
    bigDropUser(data.data.logoUrl);
    rain(
      utils.getRandomSizedPantherEmotes(),
      config.drops["!rain"].emoteMultiplier,
      config.drops["!rain"].velocities
    );
  });

  socket.on("dropuser", async (data: any) => {
    dropUser(data.data.logoUrl);
  });

  socket.on("dropemotes", async (data: any) => {
    const dropConfig = config.drops[data.data.dropType];
    if (dropConfig) {
      data.data.emoteUrls.forEach(async (emoteUrl: string) => {
        const image = await imageManager.getImage(emoteUrl);
        queueDrop(image, dropConfig.velocities);
      });
    }
  });

  socket.on("weather", async (data: any) => {
    const dropConfig = config.drops[data.data.weatherEvent];
    if (dropConfig) {
      strategies[dropConfig.strategy](dropConfig);
    }
  });

  socket.on("raid", async (data: any) => {
    eventRain(data.data.raiderCount);
  });

  socket.on("cheer", async (data: any) => {
    const rawBits = parseInt(data.data.bitCount, 10);

    const dropBits =
      rawBits < config.maxVisibleDrops ? rawBits : config.maxVisibleDrops;

    eventRain(dropBits);
  });

  socket.on("specialuserjoin", async (data: any) => {
    specialUserEvent(data.data.username);
  });

  socket.on("settrailing", async (data: any) => {
    return (trailing = data.data.trailing);
  });

  const queueDrop = (image: P5.Image, velocity: Velocity) => {
    if (drops.length <= config.maxVisibleDrops) {
      drops.push(new Drop(p5, image, velocity));
    } else {
      dropQueue.push(new Drop(p5, image, velocity));
    }
  };

  const rain = async (
    emotes: string[],
    emoteMultiplier: number,
    velocity: Velocity
  ) => {
    const images = await Promise.all(
      emotes.map((url) => imageManager.getImage(url))
    );

    while (emoteMultiplier--) {
      images.map((image) => queueDrop(image, velocity));
    }
  };

  const eventRain = (emoteCount: number) => {
    const emotes = [];

    while (emoteCount--) {
      emotes.push(p5.random(utils.getRandomSizedPantherEmotes()));
    }

    rain(emotes as [], 1, config.drops["!rain"].velocities);
  };

  const specialUserEvent = (username: string) => {
    rain(
      utils.getSpecialUserEmotes(username),
      5,
      config.drops["!rain"].velocities
    );
  };

  const bigDropUser = async (imgUrl: string) => {
    const image = await imageManager.getImage(imgUrl);
    const clip = await imageManager.getImage(clipImageBig);

    image.mask(clip);
    queueDrop(image, config.drops["!drop"].velocities);
  };

  const dropUser = async (imgUrl: string) => {
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
          .getPantherEmotes(emotes.config.sizes[1])
          .map((url) => imageManager.getImage(url))
      );
      drops = Array.from({ length: 10 }).reduce((drops: any[]) => {
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
    drops = drops.filter((drop: any) => {
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

export { Sketch };
