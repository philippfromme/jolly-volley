import { Bodies } from "matter-js";

import { at } from './Util';

export default class Sphere {
  constructor(engine, sketch, options) {
    this.sketch = sketch;
    this.options = options;

    const { x, y, radius, label, ...rest } = options;

    this.body = Bodies.circle(x, y, radius, {
      label: label || "Sphere",
      ...rest
    });
  }

  getBody() {
    return this.body;
  }

  draw() {
    at(this.sketch, this.body.position, () => {
      this.sketch.rotateZ(this.sketch.frameCount * 0.01);
      this.sketch.rotateX(this.sketch.frameCount * 0.01);
      this.sketch.rotateY(this.sketch.frameCount * 0.01);

      // this.sketch.sphere(this.options.radius, 10, 10);
      this.sketch.sphere(this.options.radius);
    });
  }
}