export default {
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
  ]
};
