import {HandType} from "../handType";
import {Card} from "../card";
import {HandMatchResult, HandMatchResultFactory} from "../handMatchResult";
import {ThreeOfAKind} from "./threeOfAKind";
import {Pair} from "./pair";
import {MultipleOfSameCardNumber} from "./multipleOfSameCardNumber";

export class FullHouse implements HandType {
  toString(): string {
    return "Full House";
  }

  parse(cards: Card[]): HandMatchResult {
    const {
      doesMatch: hasThreeOfAKind,
      groupsOfCardsToCompare
    } = new ThreeOfAKind().parse(cards);
    const {doesMatch: hasPair} = new Pair().parse(cards);
    return HandMatchResultFactory.create({
      doesMatch: hasThreeOfAKind && hasPair,
      groupsOfCardsToCompare: groupsOfCardsToCompare,
      description: (x: Card[][]) =>
          MultipleOfSameCardNumber.join(x[0], x[1], " over ")
    });
  }
}