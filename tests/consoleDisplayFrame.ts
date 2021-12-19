export class ConsoleDisplayFrame {
  private readonly _runningScore: number;
  private readonly _marks: string[];

  constructor({runningScore, marks}: { runningScore: number; marks: string[] }) {
    this._runningScore = runningScore;
    this._marks = marks;
  }

  private static _nullSafe(x: any): string {
    return x || "";
  }

  get line1(): string {
    return this._marks
      .map(x => ConsoleDisplayFrame._nullSafe(x))
      .join("")
      .padEnd(3);
  }

  get line2(): string {
    return String(ConsoleDisplayFrame._nullSafe(this._runningScore)).padEnd(3);
  }

  static print(frames: any, func: (x: string) => void = console.log) {
    const map: ConsoleDisplayFrame[] = frames
      .map(({marks, runningScore}: { marks: string[], runningScore: number }) => {
        return new ConsoleDisplayFrame({marks, runningScore});
      });
    const separator = " | ";
    const line1 = map
      .map(value => value.line1)
      .join(separator)
    const line2 = map
      .map(value => value.line2)
      .join(separator)
    func(line1 + '\n' + line2)
  }
}