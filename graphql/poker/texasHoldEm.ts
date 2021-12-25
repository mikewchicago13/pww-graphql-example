import {EOL} from "os";
import {TexasHoldEmHand} from "./texasHoldEmHand";

export class TexasHoldEm {
  private readonly _hands: TexasHoldEmHand[];
  constructor(input: string) {
    this._hands = input.split(EOL)
      .map(x => x.trim())
      .map(value => new TexasHoldEmHand(value));
  }

  static parse(input: string): TexasHoldEm {
    return new TexasHoldEm(input);
  }

  toOutput(): string {
    const winner: TexasHoldEmHand = this._winner();

    return this._hands
      .map((value) => {
        return `${value.name} ${value.description} ${TexasHoldEm._format(value, winner)}`.trim()
      })
      .join(EOL);
  }

  private static _format(value: TexasHoldEmHand, winner: TexasHoldEmHand) {
    return TexasHoldEm._isWinner(value, winner) ? "(winner)" : "";
  }

  private static _isWinner(value: TexasHoldEmHand, winner: TexasHoldEmHand) : boolean {
    return String(value) === String(winner);
  }

  private _winner(): TexasHoldEmHand {
    return [...this._hands]
      .sort((a, b) => a.compareTo(b))[0];
  }
}