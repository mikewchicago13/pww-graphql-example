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

    const winner = [...texasHoldEmHands]
      .sort((a, b) => a.compareTo(b))[0];

    return texasHoldEmHands
      .map((value) => {
        return `${value.name} ${value.description} ${value === winner ? "(winner)" : ""}`.trim()
      })
      .join(EOL);
  }
}