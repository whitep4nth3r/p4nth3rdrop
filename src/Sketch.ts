import Socket from "./socket";
import clipImage from "./assets/white_circle.png";
import clipImageBig from "./assets/white_circle_big.png";
import Drop from "./Drop";
import ImageManager from "./ImageManager";
import { config } from "./config";
import utils from "./utils";
import P5 from "p5";
import {
  Velocity,
  DropInstance,
  DropConfig,
  Strategies,
  Fields,
  SocketEvent,
  MainframeEvents,
  ImageDrops,
} from "./types";
import { Expect, Validator } from "@ryannhg/safe-json";
import { Problem } from "@ryannhg/safe-json/dist/problem";

const socketEvent = <T>(fields: Fields<T>): Validator<{ data: T }> => {
  return Expect.object({
    data: Expect.object(fields),
  });
};

const attempt = <T>(
  validator: Validator<T>,
  data: unknown,
  onPass: (value: T) => void
) =>
  validator.run(data, {
    onPass,
    onFail: (error) => console.error(Problem.toString(error)),
  });

const Sketch = (p5: P5, mainFrameUri: string) => {
  const socket = new Socket(mainFrameUri, {
    reconnect: true,
  });

  let drops: DropInstance[] = [];
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

  socket.on(MainframeEvents.sub, async (data) => {
    type SubEvent = SocketEvent<{ logoUrl: string }>;

    const validator: Validator<SubEvent> = socketEvent({
      logoUrl: Expect.string,
    });

    attempt(validator, data, (event) => {
      bigDropUser(event.data.logoUrl);
      rain(
        utils.getRandomSizedPantherEmotes(),
        config.drops["!sub"].emoteMultiplier,
        config.drops["!sub"].velocities
      );
    });
  });

  socket.on(MainframeEvents.merch, (data) => {
    dropImages(ImageDrops.Merch);
  });

  socket.on(MainframeEvents.follow, (data) => {
    eventRain(15);
  });

  socket.on(MainframeEvents.startgiveaway, (data) => {
    eventRain(10);
  });

  socket.on(MainframeEvents.endgiveaway, (data) => {
    eventRain(10);
  });

  socket.on(MainframeEvents.drawgiveaway, (data) => {
    eventRain(10);
  });

  socket.on(MainframeEvents.announcegiveaway, (data) => {
    eventRain(10);
  });

  socket.on(MainframeEvents.teammemberjoin, async (data) => {
    type DropUserEvent = SocketEvent<{ logoUrl: string }>;

    const validator: Validator<DropUserEvent> = socketEvent({
      logoUrl: Expect.string,
    });

    attempt(validator, data, (event) => {
      bigDropUser(event.data.logoUrl);
      eventRain(5);
    });
  });

  socket.on(MainframeEvents.yeetuser, async (data) => {
    type YeetUserEvent = SocketEvent<{ logoUrl: string }>;

    const validator: Validator<YeetUserEvent> = socketEvent({
      logoUrl: Expect.string,
    });

    attempt(validator, data, (event) => {
      yeetUser(event.data.logoUrl);
    });
  });

  socket.on(MainframeEvents.imagedrop, async (data) => {
    type ImageDropEvent = SocketEvent<{ type: string }>;

    const validator: Validator<ImageDropEvent> = socketEvent({
      type: Expect.string,
    });

    attempt(validator, data, (event) => {
      dropImages(event.data.type);
    });
  });

  socket.on(MainframeEvents.dropuser, async (data) => {
    type DropUserEvent = SocketEvent<{ logoUrl: string }>;

    const validator: Validator<DropUserEvent> = socketEvent({
      logoUrl: Expect.string,
    });

    attempt(validator, data, (event) => {
      dropUser(event.data.logoUrl);
    });
  });

  socket.on(MainframeEvents.dropemotes, async (data) => {
    type DropEmotesEvent = SocketEvent<{
      dropType: string;
      emoteUrls: string[];
    }>;

    const validator: Validator<DropEmotesEvent> = socketEvent({
      dropType: Expect.string,
      emoteUrls: Expect.array(Expect.string),
    });

    attempt(validator, data, (event) => {
      const dropConfig = config.drops[event.data.dropType];
      if (dropConfig) {
        event.data.emoteUrls.forEach(async (emoteUrl: string) => {
          const image = await imageManager.getImage(emoteUrl);
          queueDrop(image, dropConfig.velocities, false);
        });
      }
    });
  });

  socket.on(MainframeEvents.weather, async (data) => {
    type WeatherEvent = SocketEvent<{ weatherEvent: string }>;

    const validator: Validator<WeatherEvent> = socketEvent({
      weatherEvent: Expect.string,
    });

    attempt(validator, data, (event) => {
      const dropConfig = config.drops[event.data.weatherEvent];
      if (dropConfig) {
        strategies[dropConfig.strategy](dropConfig);
      }
    });
  });

  socket.on(MainframeEvents.raid, async (data) => {
    type RaidEvent = SocketEvent<{ raiderCount: number }>;

    const validator: Validator<RaidEvent> = socketEvent({
      raiderCount: Expect.number,
    });

    attempt(validator, data, (event) => {
      eventRain(event.data.raiderCount);
    });
  });

  socket.on(MainframeEvents.cheer, async (data) => {
    type CheerEvent = SocketEvent<{ bitCount: string }>;

    const validator: Validator<CheerEvent> = socketEvent({
      bitCount: Expect.string,
    });

    attempt(validator, data, (event) => {
      const rawBits = parseInt(event.data.bitCount, 10);

      const dropBits =
        rawBits < config.maxVisibleDrops ? rawBits : config.maxVisibleDrops;

      eventRain(dropBits);
    });
  });

  socket.on(MainframeEvents.specialuserjoin, async (data) => {
    type SpecialUserJoinEvent = SocketEvent<{ username: string }>;

    const validator: Validator<SpecialUserJoinEvent> = socketEvent({
      username: Expect.string,
    });

    attempt(validator, data, (event) => {
      eventRain(10);
      // specialUserEvent(event.data.username);
    });
  });

  socket.on(MainframeEvents.settrailing, async (data) => {
    type SetTrailingEvent = SocketEvent<{ trailing: boolean }>;

    const validator: Validator<SetTrailingEvent> = socketEvent({
      trailing: Expect.boolean,
    });

    attempt(validator, data, (event) => {
      return (trailing = event.data.trailing);
    });
  });

  const queueDrop = (
    image: P5.Image,
    velocity: Velocity,
    fixedPosition: boolean
  ) => {
    if (drops.length <= config.maxVisibleDrops) {
      drops.push(new Drop(p5, image, velocity, fixedPosition));
    } else {
      dropQueue.push(new Drop(p5, image, velocity, fixedPosition));
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
      images.map((image) => queueDrop(image, velocity, false));
    }
  };

  const eventRain = (emoteCount: number) => {
    const emotes = [];

    while (emoteCount--) {
      emotes.push(p5.random(utils.getRandomSizedPantherEmotes()));
    }

    rain(emotes, 1, config.drops["!rain"].velocities);
  };

  const specialUserEvent = (username: string) => {
    rain(
      utils.getSpecialUserEmotes(username),
      5,
      config.drops["!specialUser"].velocities
    );
  };

  const bigDropUser = async (imgUrl: string) => {
    const image = await imageManager.getImage(imgUrl);
    const clip = await imageManager.getImage(clipImageBig);

    image.mask(clip);
    queueDrop(image, config.drops["!drop"].velocities, false);
  };

  const dropUser = async (imgUrl: string) => {
    const _image = imgUrl.replace("300x300", "50x50");
    const image = await imageManager.getImage(_image);
    const clip = await imageManager.getImage(clipImage);

    image.mask(clip);
    queueDrop(image, config.drops["!drop"].velocities, false);
  };

  const dropImages = async (type: string) => {
    switch (type) {
      case ImageDrops.TheClaw:
        const moth = "./drop_images/moth.png";
        const moth_sm = "./drop_images/moth_sm.png";
        const moth_xs = "./drop_images/moth_xs.png";
        rain([moth, moth_sm, moth_xs], 9, config.drops["!partner"].velocities);
        break;
      case ImageDrops.Battlesnake:
        const snake1 = "./drop_images/snakes/ConstructionSnake1.png";
        const snake2 = "./drop_images/snakes/ConstructionSnake2.png";
        const snake3 = "./drop_images/snakes/DragonSnake.png";
        const snake4 = "./drop_images/snakes/HelmetSnake.png";
        const snake5 = "./drop_images/snakes/KingSnake.png";
        const snake6 = "./drop_images/snakes/SmartSnake.png";
        const snake7 = "./drop_images/snakes/SpaceSnake.png";
        const snake8 = "./drop_images/snakes/TeaSnake1.png";
        const snake9 = "./drop_images/snakes/TeaSnake2.png";
        const snake10 = "./drop_images/snakes/VRSnake.png";
        const wordmark = "./drop_images/snakes/wordmark.png";
        const wordmark2 = "./drop_images/snakes/wordmark_white.png";
        rain(
          [
            snake1,
            snake2,
            snake3,
            snake4,
            snake5,
            snake6,
            snake7,
            snake8,
            snake9,
            snake10,
            wordmark,
            wordmark2,
          ],
          5,
          config.drops["!partner"].velocities
        );
        break;
      case ImageDrops.Merch:
        const merch2 = "./drop_images/merch2.png";
        const merch3 = "./drop_images/merch3.png";
        const merch5 = "./drop_images/merch5.png";
        const merch6 = "./drop_images/merch6.png";
        const merch7 = "./drop_images/merch7.png";
        const merch8 = "./drop_images/merch8.png";
        const merch9 = "./drop_images/merch9.png";
        rain(
          [merch2, merch3, merch5, merch6, merch7, merch8, merch9],
          config.drops["!merch"].emoteMultiplier,
          config.drops["!merch"].velocities
        );
        break;
      case ImageDrops.Spooky:
        const date = new Date();
        const month = date.getMonth();

        if (month === 9) {
          const pumpkin_l = "./drop_images/pumpkin_l.png";
          const pumpkin_s = "./drop_images/pumpkin_s.png";
          const zombie_l = "./drop_images/zombie_l.png";
          const zombie_s = "./drop_images/zombie_s.png";
          const vampire_l = "./drop_images/vampire_l.png";
          const vampire_s = "./drop_images/vampire_s.png";
          rain(
            [pumpkin_l, pumpkin_s, zombie_l, zombie_s, vampire_l, vampire_s],
            config.drops["!partner"].emoteMultiplier,
            config.drops["!partner"].velocities
          );
          const sound = new Audio("./sound_effects/spooky.mp3");
          sound.play();
        }
        break;
      case ImageDrops.Partner:
        const check1 = "./drop_images/check.png";
        const check2 = "./drop_images/check_small.png";
        const check3 = "./drop_images/check_smaller.png";
        rain(
          [check1, check2, check3],
          config.drops["!partner"].emoteMultiplier,
          config.drops["!partner"].velocities
        );
        break;
      case ImageDrops.Netlify:
        const image1 = "./drop_images/netlify_logo.png";
        const image2 = "./drop_images/netlify_logo_dark.png";

        rain(
          [image1, image2],
          config.drops["!partner"].emoteMultiplier,
          config.drops["!partner"].velocities
        );
        eventRain(20);
        break;
      default:
        return;
    }
  };

  const yeetUser = async (imgUrl: string) => {
    const _image = imgUrl.replace("300x300", "50x50");
    const image = await imageManager.getImage(_image);
    const clip = await imageManager.getImage(clipImage);

    image.mask(clip);
    queueDrop(image, config.drops["!yeet"].velocities, true);
  };

  p5.setup = async () => {
    p5.frameRate(60);
    p5.createCanvas(p5.windowWidth, p5.windowHeight, p5.P2D);

    if (config.test) {
      rain(
        utils.getRandomSizedPantherEmotes(),
        config.drops["!sub"].emoteMultiplier,
        config.drops["!sub"].velocities
      );
      // // not added to queue for testing
      // const images = await Promise.all(
      //   utils
      //     .getPantherEmotes(emotes.config.sizes[1])
      //     .map((url) => imageManager.getImage(url))
      // );
      // drops = Array.from({ length: 10 }).reduce((drops: any[]) => {
      //   return drops.concat(
      //     images.map(
      //       (image) =>
      //         new Drop(p5, image, config.drops["!rain"].velocities, false)
      //     )
      //   );
      // }, []);
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
};

export { Sketch };
