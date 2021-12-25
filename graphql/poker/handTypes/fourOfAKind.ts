import {HandType} from "../handType";
import {Card} from "../card";
import {HandMatchResult} from "../handMatchResult";
import {MultipleOfSameCardNumber} from "./multipleOfSameCardNumber";

export class FourOfAKind implements HandType {
  toString(): string {
    return "Four of a Kind";
  }

  parse(cards: Card[]): HandMatchResult {
    return new MultipleOfSameCardNumber(4).parse(cards);
  }
}