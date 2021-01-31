import { Bodies } from "matter-js";

import { at } from './Util';

export default class Box {
  constructor(engine, sketch, options) {
    this.sketch = sketch;
    this.options = options;

    this.body = Bodies.rectangle(options.x, options.y, options.width, options.height, {
      isStatic: options.isStatic || true,
      label: options.label || "Box"
    });
  }

  getBody() {
    return this.body;
  }

  draw() {
    at(this.sketch, this.body.position, () => {
      this.sketch.box(this.options.width, this.options.height, 100);
    });
  }
}