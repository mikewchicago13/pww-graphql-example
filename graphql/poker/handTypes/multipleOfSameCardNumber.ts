import {Card} from "../card";
import {
  HandMatchResult,
  HandMatchResultFactory
} from "../handMatchResult";
import {Cards} from "../cards";

export class MultipleOfSameCardNumber {
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

        return HandMatchResultFactory.create({
          doesMatch: true,
          groupsOfCardsToCompare: [primaryCards, remainingCards],
          description: x => MultipleOfSameCardNumber.description(x[0])
        })
      }
    }

    return HandMatchResultFactory.noMatchDetected();
  }
}