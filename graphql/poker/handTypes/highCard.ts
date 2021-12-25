import {HandType} from "../handType";
import {Card} from "../card";
import {HandMatchResult, HandMatchResultFactory} from "../handMatchResult";

export class HighCard implements HandType {
  parse(cards: Card[]): HandMatchResult {
    return HandMatchResultFactory.create({
      doesMatch: true,
      groupsOfCardsToCompare: [cards],
      description: (x: Card[][]) => String(x[0][0])[0]
    })
  }

  toString(): string {
    return "High Card";
  }
}