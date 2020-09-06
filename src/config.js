import emotes from './emotes';

export default {
  broadcaster: {
    username: 'whitep4nth3r',
    commands: {
      endTrail: '!end-trail',
      startTrail: '!start-trail',
    },
  },
  clientId: process.env.REACT_APP_CLIENT_ID,
  dropTimeout: 10_000,
  maxVisibleDrops: 500,
  test: false,
  minAccountAge: 7 * 24 * 60 * 60 * 1000,
  drops: {
    '!drop': {
      emoteMultiplier: 1,
      velocities: {
        min: Math.floor(Math.random() * 5) + 3,
        max: Math.floor(Math.random() * 5) + 7,
      },
      strategy: 'drop',
    },
    '!bigdrop': {
      emoteMultiplier: 1,
      velocities: {
        min: Math.floor(Math.random() * 5) + 3,
        max: Math.floor(Math.random() * 5) + 7,
      },
      strategy: 'drop',
    },
    '!rain': {
      emoteMultiplier: 15,
      velocities: {
        min: Math.floor(Math.random() * 5) + 3,
        max: Math.floor(Math.random() * 5) + 7,
      },
      strategy: 'dropSpecificSizedPanthers',
      size: emotes.sizes[1],
    },
    '!blizzard': {
      emoteMultiplier: 15,
      velocities: {
        min: Math.floor(Math.random() * 6) + 20,
        max: Math.floor(Math.random() * 6) + 25,
      },
      strategy: 'dropRandomSizedPanthers',
    },
    '!hail': {
      emoteMultiplier: 15,
      velocities: {
        min: Math.floor(Math.random() * 4) + 4,
        max: Math.floor(Math.random() * 4) + 7,
      },
      strategy: 'dropRandomSizedPanthers',
    },
    '!shower': {
      emoteMultiplier: 5,
      velocities: {
        min: Math.floor(Math.random() * 3) + 2,
        max: Math.floor(Math.random() * 4) + 4,
      },
      strategy: 'dropSpecificSizedPanthers',
      size: emotes.sizes[1],
    },
    '!snow': {
      emoteMultiplier: 10,
      velocities: {
        min: 1,
        max: 2,
      },
      strategy: 'dropSpecificSizedPanthers',
      size: emotes.sizes[0],
    },
  },
  specialUsers: [
    'thatn00b__',
    'baldbeardedbuilder',
    'codingwithluce',
    'madhousesteve',
    'melkeydev',
  ],
};
