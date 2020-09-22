import Socket from "./socket";
import clipImage from "./assets/white_circle.png";
import clipImageBig from "./assets/white_circle_big.png";
import Drop from "./Drop";
import ImageManager from "./ImageManager";
import { config } from "./config";
import { emotes } from "./emotes";
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
        config.drops["!rain"].emoteMultiplier,
        config.drops["!rain"].velocities
      );
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
          queueDrop(image, dropConfig.velocities);
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
      specialUserEvent(event.data.username);
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
};

export { Sketch };
