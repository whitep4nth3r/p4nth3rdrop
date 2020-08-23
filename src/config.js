export default {
  broadcaster: {
    username: 'whitep4nth3r',
    commands: {
      endTrail: '!end-trail',
      startTrail: '!start-trail'
    }
  },
  clientId: process.env.REACT_APP_CLIENT_ID,
  dropTimeout: 10_000,
  maxVisibleDrops: 600,
  test: false,
  minAccountAge: 7 * 24 * 60 * 60 * 1000,
  drops: {
    drop: {
      command: '!drop',
      emoteMultiplier: 1,
      velocities: {
        min: 3,
        max: 7
      }
    },
    bigDrop: {
      command: '!bigdrop'
    },
    rain: {
      command: '!rain',
      emoteMultiplier: 15,
      velocities: {
        min: 3,
        max: 7
      }
    },
    blizzard: {
      command: '!blizzard',
      emoteMultiplier: 15,
      velocities: {
        min: 20, 
        max: 30
      }
    },
    hail: {
      command: '!hail',
      emoteMultiplier: 15,
      velocities: {
        min: 4,
        max: 10
      }
    },
    shower: {
      command: '!shower',
      emoteMultiplier: 5,
      velocities: {
        min: 2,
        max: 6
      }
    },
    snow: {
      command: '!snow',
      emoteMultiplier: 10,
      velocities: {
        min: 1, 
        max: 2
      }
    },
    user: {
      command: 'xxx',
      emoteMultiplier: 1,
      velocities: {
        min: 3,
        max: 7
      }
    }
  },
  specialUsers: [
    'thatn00b__',
    'baldbeardedbuilder'
  ],
};
