import {HandType} from "../handType";
import {Card} from "../card";
import {HandMatchResult} from "../handMatchResult";
import {MultipleOfSameCardNumber} from "./multipleOfSameCardNumber";

export class ThreeOfAKind implements HandType {
  toString(): string {
    return "Three of a Kind";
  }

  parse(cards: Card[]): HandMatchResult {
    return new MultipleOfSameCardNumber(3).parse(cards);
  }
}