class Frame {
  private readonly _rolls: (string | undefined)[];

  constructor(rolls: number[]) {
    this._rolls = rolls.map(value => {
      if(value !== undefined){
        return String(value)
      }
      return undefined;
    });
  }

  get ballsThrown(): (string | undefined)[] {
    return this._rolls;
  }

  get runningScore(): number | undefined {
    const actualRolls = this._rolls
      .filter(value => value !== undefined);
    if (actualRolls.length) {
      return 0;
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
        return frameIndex === 9 ?
          new Frame(this.getRollsInTenthFrame()) :
          new Frame(this.getRollsInFirstNineFrames(rollIndex));
      });
  }

  private getRollsInFirstNineFrames(rollIndex: number): number[] {
    return [this._rolls[rollIndex], this._rolls[rollIndex + 1]];
  }

  private getRollsInTenthFrame(): number[] {
    return [this._rolls[18], this._rolls[19], this._rolls[20]];
  }
}