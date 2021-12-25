import {EOL} from "os";
import {TexasHoldEmHand} from "./texasHoldEmHand";

export class TexasHoldEm {
  static parse(input: string): TexasHoldEmHand[] {
    return input.split(EOL)
      .map(x => x.trim())
      .map(value => new TexasHoldEmHand(value));
  }

  static toOutput(input: string): string {
    const texasHoldEmHands = TexasHoldEm.parse(input);

    const winner: TexasHoldEmHand = this._winner(texasHoldEmHands);

    return texasHoldEmHands
      .map((value) => {
        return `${value.name} ${value.description} ${this._isWinner(value, winner) ? "(winner)" : ""}`.trim()
      })
      .join(EOL);
  }

  private static _isWinner(value: TexasHoldEmHand, winner: TexasHoldEmHand) : boolean {
    return value + "" === winner + "";
  }

  private static _winner(texasHoldEmHands: TexasHoldEmHand[]): TexasHoldEmHand {
    return [...texasHoldEmHands]
      .sort((a, b) => a.compareTo(b))[0];
  }
}