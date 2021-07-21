import { emotes } from "./emotes";
import { Config } from "./types";

const config: Config = {
  maxVisibleDrops: 200,
  test: false,
  dropTimeout: 10_000,
  drops: {
    "!yeet": {
      emoteMultiplier: 1,
      velocities: {
        min: 80,
        max: 100,
      },
      strategy: "yeet",
    },
    "!drop": {
      emoteMultiplier: 1,
      velocities: {
        min: 3,
        max: 7,
      },
      strategy: "drop",
    },
    "!bigdrop": {
      emoteMultiplier: 1,
      velocities: {
        min: 3,
        max: 7,
      },
      strategy: "drop",
    },
    "!rain": {
      emoteMultiplier: 10,
      velocities: {
        min: 3,
        max: 7,
      },
      strategy: "dropSpecificSizedPanthers",
      size: emotes.config.sizes[1],
    },
    "!image": {
      emoteMultiplier: 5,
      velocities: {
        min: 3,
        max: 7,
      },
      strategy: "dropCustomImages",
      size: emotes.config.sizes[1],
    },
    "!partner": {
      emoteMultiplier: 15,
      velocities: {
        min: 3,
        max: 10,
      },
      strategy: "dropCustomImages",
      size: emotes.config.sizes[1],
    },
    "!blizzard": {
      emoteMultiplier: 10,
      velocities: {
        min: 20,
        max: 30,
      },
      strategy: "dropRandomSizedPanthers",
    },
    "!hail": {
      emoteMultiplier: 10,
      velocities: {
        min: 4,
        max: 10,
      },
      strategy: "dropRandomSizedPanthers",
    },
    "!shower": {
      emoteMultiplier: 5,
      velocities: {
        min: 2,
        max: 6,
      },
      strategy: "dropSpecificSizedPanthers",
      size: emotes.config.sizes[1],
    },
    "!snow": {
      emoteMultiplier: 10,
      velocities: {
        min: 1,
        max: 2,
      },
      strategy: "dropSpecificSizedPanthers",
      size: emotes.config.sizes[0],
    },
    "!specialUser": {
      emoteMultiplier: 2,
      velocities: {
        min: 3,
        max: 7,
      },
      strategy: "dropSpecificSizedPanthers",
      size: emotes.config.sizes[0],
    },
    "!sub": {
      emoteMultiplier: 1,
      velocities: {
        min: 1,
        max: 3,
      },
      strategy: "dropRandomSizedPanthers",
    },
  },
};

export { config };
