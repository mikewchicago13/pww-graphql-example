import {Card} from "./card";
import {Cards} from "./cards";
import {FormattingChainOfResponsibilityFactory} from "./formattingChainOfResponsibility";

export class Hand {
  private readonly _name: string;
  private readonly _sortableString: string;
  private readonly _description: string;

  static create({
                  cards,
                  name
                }: { cards: string; name: string }): Hand {
    return new Hand({
      name,
      cards: Cards.parse(cards)
    });
  }

  constructor(
    {
      cards,
      name
    }:
      {
        cards: Card[],
        name: string
      }) {
    const maximum = 5;
    if (cards.length > maximum) {
      throw new Error(`${cards} has more than ${maximum} cards`);
    }
    this._name = name;
    const chain = FormattingChainOfResponsibilityFactory.create(cards);
    this._sortableString = String(chain);
    this._description = chain.readerFriendlyDescription;
  }

  get name(): string {
    return this._name;
  }

  get description(): string {
    return this._description;
  }

  toString(): string {
    return this._sortableString;
  }

  compareTo(b: Hand): number {
    if (this > b) {
      return -1;
    }
    if (b > this) {
      return 1;
    }
    return 0;
  }
}