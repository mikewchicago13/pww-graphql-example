export const map: any = {
  "T": 10,
  "J": 11,
  "Q": 12,
  "K": 13,
  "A": 14
}

export class Card {
  private readonly _numericValue: number;
  private readonly _asString: string;
  private readonly _suit: string;

  constructor(character_suit: string) {
    this._asString = character_suit;
    const [character, suit] = character_suit;
    this._suit = suit;
    this._numericValue = Card._toNumber(character);
  }

  private static _toNumber(character: string): number {
    return map[character] || Number(character);
  }

  get numericValue(): number {
    return this._numericValue;
  }

  get suit(): string {
    return this._suit;
  }

  toString(): string {
    return this._asString;
  }
}