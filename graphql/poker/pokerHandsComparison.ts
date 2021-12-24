class Hand {
  private readonly _cards: string;
  private readonly _name: string;

  constructor(
    {
      cards,
      name
    }:
      {
        cards: string,
        name: string
      }) {
    this._cards = cards;
    this._name = name;
  }

  get name(): string{
    return this._name;
  }

  toString(): string {
    return this._cards;
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
    return this._white.name;
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