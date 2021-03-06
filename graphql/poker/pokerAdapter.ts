import {Hand} from "./hand";
import {Card} from "./card";

interface HandOutput {
  description: string,
  name: string
}

export class PokerAdapter {
  static singleHand(_: unknown, {name, cards}: { name: string, cards: string[] }): HandOutput {
    const hand = new Hand({name, cards: cards.map(x => new Card(x))});
    return {
      description: hand.description,
      name
    }
  }
}