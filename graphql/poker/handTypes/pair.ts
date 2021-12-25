import {HandType} from "../handType";
import {Card} from "../card";
import {HandMatchResult} from "../handMatchResult";
import {MultipleOfSameCardNumber} from "./multipleOfSameCardNumber";

export class Pair implements HandType {
  toString(): string {
    return "Pair";
  }

  parse(cards: Card[]): HandMatchResult {
    return new MultipleOfSameCardNumber(2).parse(cards);
  }
}