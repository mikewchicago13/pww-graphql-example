class Frame {
  get ballsThrown(): number[] {
    return [];
  }
}

export class ScoreSheet {
  private readonly _rolls: number[];

  constructor(rolls: number[]) {
    this._rolls = rolls;
  }

  get frames(): Frame[] {
    return new Array(10).fill(new Frame());
  }
}