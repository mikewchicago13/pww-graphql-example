class Game {
  _rolls = new Array(21).fill(undefined);
  _index = 0;

  roll(pins) {
    this._rolls[this._index] = pins;
    if (this._isStrike(pins) && this._isFirstBallOf9thFrameOrEarlier()) {
      this._index += 2;
    } else {
      this._index++;
    }
    return this;
  }

  get score() {
    const _pins = (roll) => {
      return this._rolls[roll] || 0;
    }

    let result = 0;
    for (let roll = 0; roll < 20; roll += 2) {
      if (this._isStrike(_pins(roll))) {
        result += _pins(roll) + this._nextTwoRolls(roll);
      } else if (this._isSpare(_pins(roll), _pins(roll + 1))) {
        result += _pins(roll) + _pins(roll + 1) + _pins(roll + 2);
      } else {
        result += _pins(roll) + _pins(roll + 1);
      }
    }
    return result;
  }

  _isStrike(firstBallOfFrame) {
    return this._didAllThePinsFall(firstBallOfFrame);
  }

  _isSpare(...rolls) {
    return this._didAllThePinsFall(...rolls);
  }

  _didAllThePinsFall(...rolls) {
    return rolls.reduce((a, b) => a + b, 0) === 10;
  }

  _isFirstBallOf9thFrameOrEarlier() {
    return this._index < 18 && this._index % 2 === 0;
  }

  _nextTwoRolls(index) {
    return this._rolls.slice(index + 1)
      .filter(value => value !== undefined)
      .slice(0, 2)
      .reduce((a, b) => a + b, 0);
  }

  toString() {
    return JSON.stringify(this);
  }
}

function bowling() {
  return new Game();
}

export default bowling;