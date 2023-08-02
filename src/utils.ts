import { emotes } from "./emotes";
// eslint-disable-next-line
export default class {
  static getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  static getCommandFromMessage = (message: string) => message.split(" ")[0];
  static getRestOfMessage = (message: string) => message.split(" ").slice(1);

  static getPantherEmotes(size: string): string[] {
    const panthers = emotes.groups.panthers.map(
      (pantherId: string) => `${emotes.config.baseUrl}${pantherId}/${size}`
    );

    const panthersV2 = emotes.groups.panthersV2.map(
      (pantherId: string) =>
        `${emotes.config.baseUrlV2}${pantherId}/default/light/${size}`
    );

    return [...panthers, ...panthersV2];
  }

  static getRandomSizedPantherEmotes(): string[] {
    const panthers = emotes.groups.panthers.map(
      (pantherId: string) =>
        `${emotes.config.baseUrl}${pantherId}/${
          emotes.config.sizes[this.getRandomInt(0, 2)]
        }`
    );

    const panthersV2 = emotes.groups.panthersV2.map(
      (pantherId: string) =>
        `${emotes.config.baseUrlV2}${pantherId}/default/light/${
          emotes.config.sizes[this.getRandomInt(0, 2)]
        }`
    );

    return [...panthers, ...panthersV2];
  }
}
