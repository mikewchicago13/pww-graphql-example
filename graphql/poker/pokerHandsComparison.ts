class Hand {
  private readonly _cards: string;
  constructor(cards: string) {
    this._cards = cards;
  }

  toString(): string{
    return this._cards;
  }
}

interface Comparison {
  black: Hand
  white: Hand
}

export class PokerHandsInput {
  parse(input: string): Comparison {
    const [black, white] = input.split("  ").map(value => value.substring(7));
    return {
      black: new Hand(black),
      white: new Hand(white)
    };
  }
}