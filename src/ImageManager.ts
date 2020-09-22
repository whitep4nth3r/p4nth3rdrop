import P5 from "p5";

export default class ImageManager {
  p5: P5;
  cache = new Map<string, any>();

  constructor(p5: P5) {
    this.p5 = p5;
    this.cache = new Map();
  }

  async getImage(url: string) {
    if (this.cache.has(url)) {
      return this.cache.get(url);
    }

    const imagePromise = new Promise((resolve) => {
      this.p5.loadImage(url, (image) => {
        this.cache.set(url, image);
        resolve(image);
      });
    });
    this.cache.set(url, imagePromise);
    return imagePromise;
  }
}
