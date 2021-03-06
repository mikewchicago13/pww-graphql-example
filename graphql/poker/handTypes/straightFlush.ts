import {HandType} from "../handType";
import {Card} from "../card";
import {HandMatchResult, HandMatchResultFactory} from "../handMatchResult";
import {Flush} from "./flush";
import {Straight} from "./straight";

export class StraightFlush implements HandType {
  toString(): string {
    return "Straight Flush";
  }

  parse(cards: Card[]): HandMatchResult {
    const {description} = Flush.partsFrom(cards);
    const {doesMatch: isStraight, groupsOfCardsToCompare} = new Straight().parse(cards);
    const {doesMatch: isFlush} = new Flush().parse(cards);
    return HandMatchResultFactory.create({
      doesMatch: isFlush && isStraight,
      groupsOfCardsToCompare: groupsOfCardsToCompare,
      description
    });
  }
}