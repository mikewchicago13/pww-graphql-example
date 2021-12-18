class Frame {
  private readonly _rolls: number[];

  constructor(rolls: number[]) {
    this._rolls = rolls.filter(value => value !== undefined);
  }

  get ballsThrown(): number[] {
    return this._rolls;
  }

  get runningScore(): number | undefined {
    if (this._rolls.length) {
      return this._rolls.reduce((a, b) => a + b, 0);
    }
    return undefined;
  }
}

export class ScoreSheet {
  private readonly _rolls: number[];

  constructor(rolls: number[]) {
    this._rolls = rolls;
  }

  get frames(): Frame[] {
    return new Array(10).fill(0)
      .map((_, frameIndex) => {
        const rollIndex = frameIndex * 2;

        return new Frame(frameIndex === 9 ?
          this.getRollsInTenthFrame() :
          this.getRollsInFirstNineFrames(rollIndex));
      });
  }

  private getRollsInFirstNineFrames(rollIndex: number): number[] {
    return [this._rolls[rollIndex], this._rolls[rollIndex + 1]];
  }

  private getRollsInTenthFrame(): number[] {
    return [this._rolls[18], this._rolls[19], this._rolls[20]];
  }
}