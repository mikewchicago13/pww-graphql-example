class Game {
  _rolls = new Array(21).fill(undefined);
  _index = 0;

  get score() {
    let result = 0;
    for (let roll = 0; roll < 20; roll += 2) {
      const firstBallOfFrame = this._pins(roll);
      const frame = firstBallOfFrame + this._pins(roll + 1);
      if (firstBallOfFrame === 10) {
        result += firstBallOfFrame + this._nextTwoRolls(roll);
      } else if (frame === 10) {
        result += frame + this._pins(roll + 2);
      } else {
        result += frame;
      }
    }
    return result;
  }

  _pins(roll) {
    return this._rolls[roll] || 0;
  }

  roll(pins) {
    this._rolls[this._index] = pins;
    if (pins === 10 && this._index < 18 && this._index % 2 === 0) {
      this._index += 2;
    } else {
      this._index++;
    }
    return this;
  }



  toString() {
    return JSON.stringify(this);
  }

  _nextTwoRolls(index) {
    return this._rolls.slice(index + 1)
      .filter(value => value !== undefined)
      .slice(0, 2)
      .reduce((a, b) => a + b, 0);
  }
}

function bowling() {
  return new Game();
}

export default bowling;