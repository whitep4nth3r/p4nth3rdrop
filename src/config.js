export default {
  broadcaster: 'whitep4nth3r',
  clientId: process.env.REACT_APP_CLIENT_ID,
  dropTimeout: 10_000,
  maxVisibleDrops: 600,
  test: false,
  minAccountAge: 7 * 24 * 60 * 60 * 1000,
  weatherEmotes: [
    'https://static-cdn.jtvnw.net/emoticons/v1/303132133/2.0',
    'https://static-cdn.jtvnw.net/emoticons/v1/303132137/2.0',
    'https://static-cdn.jtvnw.net/emoticons/v1/302880696/2.0',
    'https://static-cdn.jtvnw.net/emoticons/v1/302880702/2.0',
    'https://static-cdn.jtvnw.net/emoticons/v1/302880692/2.0',
  ],
  specialUsers: [
    'thatn00b__',
    'baldbeardedbuilder'
  ],
  specialUsersEmotes: {
    thatn00b__: [
      'https://static-cdn.jtvnw.net/emoticons/v1/302960762/1.0',
      'https://static-cdn.jtvnw.net/emoticons/v1/302960777/1.0',
      'https://static-cdn.jtvnw.net/emoticons/v1/302960821/1.0'
    ],
    baldbeardedbuilder: [
      'https://static-cdn.jtvnw.net/emoticons/v1/300179542/1.0',
      'https://static-cdn.jtvnw.net/emoticons/v1/300179548/1.0',
      'https://static-cdn.jtvnw.net/emoticons/v1/300179551/1.0',
      'https://static-cdn.jtvnw.net/emoticons/v1/300219633/1.0',
      'https://static-cdn.jtvnw.net/emoticons/v1/300298963/1.0'
    ]
  }
};
