export default class AIController {
  constructor(player) {
    this.player = player;

    this.keys = [];

    this.onKeyDown = this.onKeyDown.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);

    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("keyup", this.onKeyUp);
  }

  update() {
    if (this.keys.includes("ArrowRight")) {
      this.player.moveRight();
    }

    if (this.keys.includes("ArrowLeft")) {
      this.player.moveLeft();
    }
  }

  onKeyDown({ key }) {
    if (!this.keys.includes(key)) {
      this.keys.push(key);
    }

    if (key === "ArrowUp") {
      this.player.jump();
    }
  }

  onKeyUp({ key }) {
    this.keys = this.keys.filter((k) => k !== key);
  }

  destroy() {
    window.removeEventListener("keydown", this.onKeyDown);
    window.removeEventListener("keyup", this.onKeyUp);
  }
}
