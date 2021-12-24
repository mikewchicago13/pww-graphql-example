interface Hand {

}

interface Comparison {
  black: Hand
  white: Hand
}

export class PokerHandsInput {
  parse(input: string): Comparison {
    return {
      black: {},
      white: {}
    };
  }
}