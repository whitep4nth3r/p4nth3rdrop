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
  fixedPosition: boolean;

  constructor(
    p5: P5,
    image: P5.Image,
    incomingVelocity: Velocity,
    fixedPosition: boolean
  ) {
    this.fixedPosition = fixedPosition;
    this.landTime = 0;
    this.p5 = p5;
    this.image = image;
    this.landed = false;
    this.wobble = p5.random(p5.TAU);

    const vectorX = this.fixedPosition
      ? 0
      : p5.random(0, p5.windowWidth - image.width);
    const vectorY = this.fixedPosition ? 0 : -100;
    const vectorAngle = this.fixedPosition
      ? p5.random(0.1, 0.2)
      : p5.random(p5.PI * 0.1, p5.PI * 0.9);

    this.position = p5.createVector(vectorX, vectorY);
    this.vector = Vector.fromAngle(
      vectorAngle,
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

    const newVector: Vector = P5.Vector.mult(vector, -1);
    if (position.x <= 0) {
      vector.x = newVector.x;
    } else if (position.x + image.width >= p5.windowWidth) {
      vector.x = newVector.x;
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
