import Matter, {
  Body,
  Bodies,
  Engine,
  Events,
  Render,
  Runner,
  Vector,
  World
} from "matter-js";

import p5 from 'p5';

import Player from "./Player";
import PlayerController from "./PlayerController";
import AIController from "./AIController";

import Box from './Box';
import Sphere from './Sphere';

import { at, onCollision } from "./Util";

import {
  GAME_WIDTH,
  GAME_HEIGHT,
  BALL_COLOR,
  GROUND_COLOR,
  BACKGROUND_COLOR,
  NET_COLOR,
  PLAYER_1_COLOR,
  PLAYER_2_COLOR,
  BALL_RADIUS
} from "./Config";

import "./styles.css";

var engine,
  ball,
  ground,
  playerController,
  player,
  aiController,
  aiPlayer,
  render,
  sketch;

const debug = true;

const statics = [];

function setup() {
  engine = Engine.create();

  // render = Render.create({
  //   element: document.getElementById("app"),
  //   engine: engine,
  //   options: {
  //     width: 800,
  //     height: 600,
  //     wireframes: debug,
  //     background: BACKGROUND_COLOR,
  //     showAxes: debug,
  //     showConvexHulls: debug
  //   }
  // });

  sketch = new p5(sketch => {
    let img;

    sketch.setup = () => {
      sketch.createCanvas(GAME_WIDTH, GAME_HEIGHT, sketch.WEBGL);

      img = sketch.loadImage('assets/blobby.png');
    };

    sketch.draw = () => {
      sketch.background(250);

      sketch.ambientLight(60, 60, 60);
      sketch.pointLight(200, 200, 200, 0, -1000, 0);

      // sketch.normalMaterial();
      sketch.ambientMaterial(250);

      sketch.noStroke();

      // sketch.texture(img);

      if (ball) {
        ball.draw();
      }

      sketch.ambientMaterial(255, 0, 0);

      player && at(sketch, player.getHead().position, () => sketch.sphere(40, 10, 10));
      player && at(sketch, player.getBody().parts[2].position, () => sketch.sphere(50, 10, 10));

      sketch.ambientMaterial(0, 0, 255);

      aiPlayer && at(sketch, aiPlayer.getHead().position, () => sketch.sphere(40, 10, 10));
      aiPlayer && at(sketch, aiPlayer.getBody().parts[2].position, () => sketch.sphere(50, 10, 10));

      sketch.ambientMaterial(250);

      statics.forEach(s => {
        if (!s.getBody().label.includes('Wall')) s.draw();
      });
    };

    // sketch.windowResized = () => {
    //   sketch.resizeCanvas(sketch.windowWidth, sketch.windowHeight);
    // };
  }, document.getElementById("app"));

  ground = new Box(engine, sketch, {
    x: 400,
    y: 600,
    width: 1000,
    height: 60,
    label: "Ground"
  });

  statics.push(ground);

  const wallLeft = new Box(engine, sketch, {
    x: -5,
    y: 0,
    width: 10,
    height: 1200,
    label: "Wall Left"
  });

  statics.push(wallLeft);

  const wallRight = new Box(engine, sketch, {
    x: 805,
    y: 0,
    width: 10,
    height: 1200,
    label: "Wall Right"
  });

  statics.push(wallRight);

  const net = new Box(engine, sketch, {
    x: 400,
    y: 445,
    width: 15,
    height: 250,
    label: "Net"
  });

  statics.push(net);

  World.add(engine.world, statics.map(s => s.getBody()));

  // Render.run(render);

  Matter.Engine.run(engine);

  reset();
}

function reset() {
  pause();

  // Clear world except for static bodies
  World.clear(engine.world, true);

  ball = new Sphere(engine, sketch, {
    x: 200,
    y: 200,
    radius: BALL_RADIUS,
    label: "Ball",
    restitution: 0.75
  });

  onCollision(engine, ball.getBody(), (other) => {
    if (other.label === "Ground") {
      reset();
    }
  });

  player = new Player(
    engine,
    { x: 200, y: 570 },
    {
      color: PLAYER_1_COLOR,
      label: "Human Player"
    }
  );

  playerController && playerController.destroy();

  playerController = new PlayerController(player);

  aiPlayer = new Player(
    engine,
    { x: 600, y: 570 },
    {
      color: PLAYER_2_COLOR,
      label: "AI Player"
    }
  );

  aiController && aiController.destroy();

  aiController = new AIController(aiPlayer, ball);

  World.add(engine.world, [ball.getBody(), player.getBody(), aiPlayer.getBody()]);
}

function play() {
  engine.timing.timeScale = 1;
}

function pause() {
  engine.timing.timeScale = 0;
}

function isPlaying() {
  return engine.timing.timeScale !== 0;
}

setup();

window.addEventListener("keydown", ({ key }) => {
  if (!isPlaying()) {
    play();
  }

  if (isPlaying() && (key === "Delete" || key === "Escape")) {
    reset();
  }
});

let beforeUpdateError;

Events.on(engine, "beforeUpdate", () => {
  if (beforeUpdateError) return;

  try {
    playerController.update();

    aiController.update();
  } catch (err) {
    console.log("beforeUpdate error", err);

    beforeUpdateError = err;

    pause();
  }
});

function hasParent(body) {
  return body.parent && body.parent !== body;
}

function getParent(body) {
  if (hasParent(body)) {
    return getParent(body.parent);
  }

  return body;
}