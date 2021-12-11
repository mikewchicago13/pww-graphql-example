class Game {
  _rolls = new Array(21).fill(undefined);
  _index = 0;

  get score() {
    let result = 0;
    for (let roll = 0; roll < 20; roll += 2) {
      if (this._isStrike(this._pins(roll))) {
        result += this._pins(roll) + this._nextTwoRolls(roll);
      } else if (this._isSpare(this._pins(roll), this._pins(roll + 1))) {
        result += this._pins(roll) + this._pins(roll + 1) + this._pins(roll + 2);
      } else {
        result += this._pins(roll) + this._pins(roll + 1);
      }
    }
    return result;
  }

  _isStrike(firstBallOfFrame) {
    return firstBallOfFrame === 10;
  }

  _isSpare(firstBallOfFrame, secondBallOfFrame) {
    return firstBallOfFrame + secondBallOfFrame === 10;
  }

  _pins(roll) {
    return this._rolls[roll] || 0;
  }

  roll(pins) {
    this._rolls[this._index] = pins;
    if (this._isStrike(pins) && this._isFirstBallOf9thFrameOrEarlier()) {
      this._index += 2;
    } else {
      this._index++;
    }
    return this;
  }


  _isFirstBallOf9thFrameOrEarlier() {
    return this._index < 18 && this._index % 2 === 0;
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