class Frame {
  private readonly _rolls: number[];
  private readonly _frameIndex: number;

  constructor(rolls: number[], frameIndex: number) {
    this._rolls = rolls;
    this._frameIndex = frameIndex;
  }

  get _allowedNumberOfBallsThrown(): number {
    return 2;
  }

  get ballsThrown(): (string | undefined)[] {
    const start = this._frameIndex * 2;
    return this._rolls
      .slice(start, start + this._allowedNumberOfBallsThrown)
      .map((value, index) => {
        if (value !== undefined) {
          if(this._isStrike(index, value)){
            return "X";
          }
          return String(value)
        }
        return undefined;
      });
  }

  protected _isStrike(index: number, value: number) {
    return index === 0 && value === 10;
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

class TenthFrame extends Frame {
  constructor(_rolls: number[]) {
    super(_rolls, 9);
  }

  get _allowedNumberOfBallsThrown(): number {
    return 3;
  }

  protected _isStrike(_: number, value: number): boolean {
    return value === 10;
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
        return frameIndex === 9 ?
          new TenthFrame(this._rolls) :
          new Frame(this._rolls, frameIndex);
      });
  }
}