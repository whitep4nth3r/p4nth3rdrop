import P5, { Vector } from "p5";
import { config } from "./config";
import { Velocity, DropInstance } from "./types";

export default class Drop implements DropInstance {
  p5: P5;
  image: P5.Image;
  vector: P5.Vector;
  landed: boolean;
  wobble: number;
  position: P5.Vector;
  landTime: number;

  constructor(p5: P5, image: P5.Image, incomingVelocity: Velocity) {
    this.landTime = 0;
    this.p5 = p5;
    this.image = image;
    this.landed = false;
    this.wobble = p5.random(p5.TAU);
    this.position = p5.createVector(
      p5.random(0, p5.windowWidth - image.width),
      -100
    );

    this.vector = Vector.fromAngle(
      p5.random(p5.PI * 0.1, p5.PI * 0.9),
      p5.random(incomingVelocity.min, incomingVelocity.max)
    );
  }

  draw(now: number) {
    let alpha = 1;
    this.p5.push();
    if (this.landed) {
      const diff = now - this.landTime;
      alpha =
        diff >= config.dropTimeout
          ? 0
          : this.p5.map(diff, config.dropTimeout, 0, 0, 1);
      // @ts-ignore
      // Type not available from @types/p5 currently
      this.p5.drawingContext.globalAlpha = alpha;
    }
    // translate to the point we want to rotate around, which is the top center of the drop
    this.p5.translate(this.position.x, this.position.y - this.image.height / 2);
    // rotate by the drops wobble value mapped between -PI/16 and PI/16
    this.p5.rotate(
      this.p5.map(
        this.p5.sin(this.wobble),
        -1,
        1,
        -this.p5.QUARTER_PI / 2,
        this.p5.QUARTER_PI / 2
      )
    );
    // translate down from the rotate point to the draw point (center)
    this.p5.translate(0, this.image.height / 2);
    this.p5.image(this.image, 0, 0);
    this.p5.pop();

    return alpha <= 0;
  }

  update() {
    const { position, vector, p5, image, landed } = this;

    if (landed) return;

    position.add(vector);

    if (position.x <= 0) {
      // @ts-ignore
      vector.mult(p5.createVector(-1, 1));
    } else if (position.x + image.width >= p5.windowWidth) {
      // @ts-ignore
      vector.mult(p5.createVector(-1, 1));
      position.x = p5.windowWidth - image.width;
    }

    if (position.y + image.height >= p5.windowHeight) {
      position.y = p5.windowHeight - image.height;
      this.landed = true;
      this.landTime = Date.now();
    }
    this.wobble += p5.random(0.05, 0.1);
  }
}
