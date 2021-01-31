import { AI_JUMP_THRESHOLD, AI_MOVE_INTERVAL } from "./Config";

import { throttle } from "min-dash";

const debug = true;

const log = throttle(
  (message) => debug && console.log(`[AIController] ${message}`),
  100
);

export default class AIController {
  constructor(player, ball) {
    this.player = player;
    this.ball = ball.getBody();

    this.moveDirection = null;

    this.setMoveDirection = throttle(
      this.setMoveDirection.bind(this),
      AI_MOVE_INTERVAL
    );
  }

  update() {
    if (this.ball.position.x < 400) {
      // Ball not in my half, make sure I'm not too far away from center
      this.resetMoveDirection();

      if (this.player.getBody().position.x < 550) {
        this.player.moveRight();
      } else if (this.player.getBody().position.x > 650) {
        this.player.moveLeft();
      }
    } else {
      // Ball in my half, try to hit ball
      if (this.player.getBody().position.x - this.ball.position.x < 0) {
        log("SET MOVE DIRECTION RIGHT");

        this.setMoveDirection("right");
      } else {
        log("SET MOVE DIRECTION LEFT");

        this.setMoveDirection("left");
      }

      if (
        distance(this.player.getHead().position, this.ball.position) <
        AI_JUMP_THRESHOLD
      ) {
        log("JUMP");

        this.player.jump();
      }
    }

    if (this.moveDirection === "right") {
      log("MOVE RIGHT");

      this.player.moveRight();
    } else if (this.moveDirection === "left") {
      log("MOVE LEFT");

      this.player.moveLeft();
    }
  }

  setMoveDirection(direction) {
    this.moveDirection = direction;
  }

  resetMoveDirection() {
    this.moveDirection = null;
  }

  destroy() {}
}

function distance(a, b) {
  return Math.hypot(b.x - a.x, b.y - a.y);
}
