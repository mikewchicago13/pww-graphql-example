class Game {
  _rolls = new Array(21).fill(0);
  _index = 0;

  get score() {
    let result = 0;
    for (let roll = 0; roll < 20; roll += 2) {
      const frame = this._rolls[roll] + this._rolls[roll + 1];
      if (frame === 10) {
        result += frame + this._rolls[roll + 2];
      } else {
        result += frame;
      }
    }
    return result;
  }

  roll(pins) {
    this._rolls[this._index] = pins;
    this._index++;
    return this;
  }

  toString(){
    return JSON.stringify(this);
  }
}

function bowling() {
  return new Game();
}

export default bowling;