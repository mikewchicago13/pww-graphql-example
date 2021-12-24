import {EOL} from "os";

class TexasHoldEmHand {
  constructor(value: string) {

  }
}

export class TexasHoldEm {
  static parse(input: string): TexasHoldEmHand[]{
    return input.split(EOL)
      .map(value => new TexasHoldEmHand(value));
  }
}