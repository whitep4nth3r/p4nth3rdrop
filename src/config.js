import emotes from "./emotes";

export default {
  maxVisibleDrops: 500,
  test: false,
  dropTimeout: 10_000,
  drops: {
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
      emoteMultiplier: 15,
      velocities: {
        min: 3,
        max: 7,
      },
      strategy: "dropSpecificSizedPanthers",
      size: emotes.sizes[1],
    },
    "!blizzard": {
      emoteMultiplier: 15,
      velocities: {
        min: 20,
        max: 30,
      },
      strategy: "dropRandomSizedPanthers",
    },
    "!hail": {
      emoteMultiplier: 15,
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
      size: emotes.sizes[1],
    },
    "!snow": {
      emoteMultiplier: 10,
      velocities: {
        min: 1,
        max: 2,
      },
      strategy: "dropSpecificSizedPanthers",
      size: emotes.sizes[0],
    },
  },
};
