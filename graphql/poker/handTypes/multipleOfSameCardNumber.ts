import {HandType} from "../handType";
import {Card} from "../card";
import {DoesNotMatchHandResult, HandMatchResult} from "../handMatchResult";
import {Cards} from "../cards";

export class MultipleOfSameCardNumber implements HandType {
  private readonly _numberOfSameCardNumber: number;

  constructor(numberOfSameCardNumber: number) {
    this._numberOfSameCardNumber = numberOfSameCardNumber;
  }

  static description(cards: Card[]): string {
    return String(cards[0])[0] + "s";
  }

  static join(first: Card[], second: Card[], joinText: string): string {
    return [
      MultipleOfSameCardNumber.description(first),
      MultipleOfSameCardNumber.description(second)
    ]
      .join(joinText);
  }

  parse(cards: Card[]): HandMatchResult {
    const countByCardValue = Cards.countByCardValue(cards);

    for (const key in countByCardValue) {
      if (countByCardValue[key] === this._numberOfSameCardNumber) {
        const primaryCards =
          cards.filter(x => x.numericValue === Number(key));
        const remainingCards =
          cards.filter(x => x.numericValue !== Number(key));

        return new HandMatchResult({
          doesMatch: true,
          groupsOfCardsToCompare: [primaryCards, remainingCards],
          description: x => MultipleOfSameCardNumber.description(x[0])
        })
      }
    }

    return new DoesNotMatchHandResult(cards);
  }

  toString(): string {
    throw new Error("not applicable");
  }
}