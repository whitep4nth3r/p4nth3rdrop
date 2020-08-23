import config from './config';
import emotes from './emotes';

export default class {
  static getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  static getPantherEmotes = (size) => {
    return emotes.panthers.map(pantherId => 
      `${emotes.baseUrl}${pantherId}/${size}`);
  }

  static getRandomSizedPantherEmotes = () => {
    return emotes.panthers.map(pantherId => 
      `${emotes.baseUrl}${pantherId}/${emotes.sizes[this.getRandomInt(0, 2)]}`);
  }

  static getSpecialUserEmotes = username => {
    return emotes[username].map(emoteId => 
      `${emotes.baseUrl}${emoteId}/${emotes.sizes[this.getRandomInt(0, 2)]}`)
  }
}