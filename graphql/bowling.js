class Game {
  _score;

  constructor(score = 0) {
    this._score = score;
  }

  get score() {
    return this._score;
  }

  roll(pins) {
    this._score += pins;
    return this;
  }
}

function bowling() {
  return new Game();
}

export default bowling;