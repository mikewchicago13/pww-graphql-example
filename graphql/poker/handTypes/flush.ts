import {HandType} from "../handType";
import {Card} from "../card";
import {Cards} from "../cards";
import {HandMatchResult} from "../handMatchResult";

export class Flush implements HandType {
  toString(): string {
    return "Flush";
  }

  private static readonly _suitDisplay: any = {
    "C": "Clubs",
    "D": "Diamonds",
    "H": "Hearts",
    "S": "Spades"
  };

  public static partsFrom(cards: Card[]): {
    distinctSuits: string[],
    description: (cardsAfterSortingEachGroup: Card[][]) => string
  } {
    const distinctSuits = Object.keys(Cards.countBySuit(cards));
    return {
      distinctSuits,
      description: (x: Card[][]) => String(x[0][0])[0] + " high in " + Flush._suitDisplay[distinctSuits[0]]
    }
  }

  parse(cards: Card[]): HandMatchResult {
    const {distinctSuits, description} = Flush.partsFrom(cards);
    const allCardsOfSameSuit = distinctSuits.length === 1;
    return new HandMatchResult({
      doesMatch: allCardsOfSameSuit,
      groupsOfCardsToCompare: [cards],
      description
    });
  }
}