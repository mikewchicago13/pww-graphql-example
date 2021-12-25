import {Hand} from "./hand";
import {Comparison} from "./comparison";

export class PokerHandsInput {
  parse(input: string): Comparison {
    const [black, white] = input.split("  ").map(value => value.substring(7));
    return new Comparison(
      Hand.create({cards: black, name: "Black"}),
      Hand.create({cards: white, name: "White"})
    )
  }
}