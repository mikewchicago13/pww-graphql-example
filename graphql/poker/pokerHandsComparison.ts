class Card {
  private readonly _numericValue: number;
  constructor(character_suit: string) {
    const [ character ] = character_suit;
    this._numericValue = Card._toNumber(character);
  }

  private static _toNumber(character: string): number {
    const map: any = {
      "T": 10,
      "J": 11,
      "Q": 12,
      "K": 13,
      "A": 14
    }
    return map[character] || Number(character);
  }

  get numericValue(): number {
    return this._numericValue;
  }
}

class Cards{
  static parse(cards: string): Card[] {
    return cards.split(" ")
      .map(x => new Card(x));
  }
}

class Hand {
  private readonly _cardsInput: string;
  private readonly _name: string;
  private readonly _cards: Card[];

  constructor(
    {
      cards,
      name
    }:
      {
        cards: string,
        name: string
      }) {
    this._cardsInput = cards;
    this._name = name;
    this._cards = Cards.parse(cards);
  }

  get name(): string{
    return this._name;
  }

  private _sortedByNumericValue(): number[] {
    return this._cards
      .map(c => c.numericValue)
      .sort((a, b) => b - a);
  }

  toString(): string {
    return this._cardsInput;
  }

  isBetterThan(other: Hand): boolean {
    const me = this._sortedByNumericValue();
    const you = other._sortedByNumericValue();
    for (let i = 0; i < me.length; i++) {
      if(me[i] > you[i]){
        return true;
      }
      if(you[i]> me[i]){
        return false;
      }
    }
    return false;
  }
}

class Comparison {
  private readonly _one: Hand;
  private readonly _two: Hand;

  constructor(one: Hand, two: Hand) {
    this._one = one;
    this._two = two;
  }

  get one(): Hand {
    return this._one;
  }

  get two(): Hand {
    return this._two;
  }

  toString(): string{
    if (this._two.isBetterThan(this._one)) {
      return this._two.name;
    } else if (this._one.isBetterThan(this._two)) {
      return this._one.name;
    }
    return "Tie"
  }
}

export class PokerHandsInput {
  parse(input: string): Comparison {
    const [black, white] = input.split("  ").map(value => value.substring(7));
    return new Comparison(
      new Hand({cards: black, name: "Black"}),
      new Hand({cards: white, name: "White"})
    )
  }
}