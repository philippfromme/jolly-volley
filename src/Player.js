import Matter, {
  Body,
  Bodies,
  Engine,
  Events,
  Render,
  Vector,
  World
} from "matter-js";

import { onCollision } from "./Util";

import {
  PLAYER_JUMP_VELOCITY,
  HORIZONTAL_PLAYER_SPEED,
  PLAYER_1_COLOR
} from "./Config";

export default class Player {
  constructor(engine, position, options = {}) {
    let { color, label } = options;

    if (!color) {
      color = PLAYER_1_COLOR;
    }

    if (!label) {
      label = "Player";
    }

    this.state = {
      grounded: true
    };

    const { x, y } = position;

    const head = (this.head = Bodies.circle(x, y - 100, 40, {
      label: `${label}_Head`,
      render: {
        fillStyle: color,
        lineWidth: 0
      }
    }));

    const body = (this.body = Body.create({
      label,
      friction: 0, // Prevent player from sliding against other bodies
      parts: [
        head,
        Bodies.circle(x, y - 50, 50, {
          label: `${label}_Body`,
          render: {
            fillStyle: color,
            lineWidth: 0
          }
        })
      ],
      inertia: Infinity // Prevent player from rotating
    }));

    Events.on(engine, "afterUpdate", () => {
      // Prevent player from sliding horizontally
      Body.setVelocity(body, Vector.create(0, body.velocity.y));
    });

    onCollision(engine, body, (other) => {
      if (other.label === "Ground") {
        this.state = {
          ...this.state,
          grounded: true
        };
      }
    });
  }

  getBody() {
    return this.body;
  }

  getHead() {
    return this.head;
  }

  jump() {
    if (this.state.grounded) {
      this.state.grounded = false;

      Body.applyForce(
        this.body,
        Vector.create(this.body.position.x, this.body.position.y),
        Vector.create(0, -PLAYER_JUMP_VELOCITY)
      );
    }
  }

  moveRight() {
    Body.setPosition(
      this.body,
      Vector.create(
        this.body.position.x + HORIZONTAL_PLAYER_SPEED,
        this.body.position.y
      )
    );
  }

  moveLeft() {
    Body.setPosition(
      this.body,
      Vector.create(
        this.body.position.x - HORIZONTAL_PLAYER_SPEED,
        this.body.position.y
      )
    );
  }
}
