export default {
  broadcaster: 'whitep4nth3r',
  clientId: process.env.REACT_APP_CLIENT_ID,
  dropTimeout: 10_000,
  maxVisibleDrops: 600,
  test: false,
  minAccountAge: 7 * 24 * 60 * 60 * 1000,
  chatCommands: {
    bigdrop: '!bigdrop',
    blizzard: '!blizzard',
    drop: '!drop',
    endTrail: '!endTrail',
    hail: '!hail',
    rain: '!rain',
    shower: '!shower',
    snow: '!snow',
    startTrail: '!start-trail'
  },
  rainVelocities: {
    default: {
      min: 3,
      max: 7
    }
  },
  specialUsers: [
    'thatn00b__',
    'baldbeardedbuilder'
  ],
};
