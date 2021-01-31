import { Events } from "matter-js";

import {
  GAME_WIDTH,
  GAME_HEIGHT
} from './Config';

let collisionStartError;

/**
 * Call callback when body or one of its parts collides with other body.
 *
 * @param {Matter.Engine} engine
 * @param {Matter.Body} body
 * @param {Function} callback
 */
export function onCollision(engine, body, callback) {
  Events.on(engine, "collisionStart", (event) => {
    if (collisionStartError) return;

    try {
      const { pairs } = event;

      pairs.forEach(({ bodyA, bodyB }) => {
        if (body.parts.includes(bodyA)) {
          callback(bodyB);
        } else if (body.parts.includes(bodyB)) {
          callback(bodyA);
        }
      });
    } catch (err) {
      console.log("collisionStart error", err);

      collisionStartError = err;
    }
  });
}

export function at(sketch, position, callback) {
  sketch.push();

  sketch.translate(position.x - GAME_WIDTH / 2, position.y - GAME_HEIGHT / 2, 0);

  callback();

  sketch.pop();
}