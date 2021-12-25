import {HandType} from "./handType";
import {Card} from "./card";
import {DoesNotMatchHandResult, HandMatchResult} from "./handMatchResult";
import {Cards} from "./cards";
import {MultipleOfSameCardNumber} from "./multipleOfSameCardNumber";

export class TwoPairs implements HandType {
  toString(): string {
    return "Two Pairs";
  }

  parse(cards: Card[]): HandMatchResult {
    const pairsFound = TwoPairs._pairsFound(Cards.countByCardValue(cards));

    if (pairsFound.length === 2) {
      return new HandMatchResult({
        doesMatch: true,
        groupsOfCardsToCompare: TwoPairs._separate(pairsFound, cards),
        description: (x: Card[][]) => MultipleOfSameCardNumber.join(x[0], x[1], " and ")
      })
    }

    return new DoesNotMatchHandResult(cards);
  }

  private static _separate(pairsFound: number[], cards: Card[]): Card[][] {
    const sortedDescending = pairsFound.sort((a, b) => b - a);
    const higherPair = sortedDescending[0];
    const lowerPair = sortedDescending[1];

    const primaryCards =
      cards.filter(x => x.numericValue === higherPair);
    const secondaryCards =
      cards.filter(x => x.numericValue === lowerPair);
    const remainingCards =
      cards.filter(x => ![higherPair, lowerPair].includes(x.numericValue));
    return [primaryCards, secondaryCards, remainingCards];
  }

  private static _pairsFound(countByCardValue: any): number[] {
    const pairsFound: number[] = [];
    for (const key in countByCardValue) {
      if (countByCardValue[key] === 2) {
        pairsFound.push(Number(key));
      }
    }
    return pairsFound;
  }
}