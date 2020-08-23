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
  dropVelocities: {
    default: {
      min: 3,
      max: 7
    },
    blizzard: {
      min:20, 
      max:30
    },
    snow: {
      min: 1, 
      max: 2
    },
    user: {
      min: 1,
      max: 3
    }
  },
  specialUsers: [
    'thatn00b__',
    'baldbeardedbuilder'
  ],
};
