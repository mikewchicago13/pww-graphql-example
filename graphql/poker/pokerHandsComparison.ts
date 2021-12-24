interface Hand {

}

interface Comparison {
  white: Hand
  black: Hand
}

export class PokerHandsInput {
  parse(input: string): Comparison {
    throw new Error(input);
  }
}