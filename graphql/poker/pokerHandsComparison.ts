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

  get highCard(): number {
    return this._cards
      .map(c => c.numericValue)
      .sort((a, b) => b - a)
      [0];
  }

  toString(): string {
    return this._cardsInput;
  }
}

class Comparison {
  private readonly _black: Hand;
  private readonly _white: Hand;

  constructor(black: Hand, white: Hand) {
    this._black = black;
    this._white = white;
  }

  get black(): Hand {
    return this._black;
  }

  get white(): Hand {
    return this._white;
  }

  toString(): string{
    return this._betterHandOf().name;
  }

  private _betterHandOf(): Hand {
    if(this._white.highCard > this._black.highCard){
      return this._white;
    }
    return this._black;
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