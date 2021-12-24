import {TexasHoldEm} from "../../graphql/poker/texasHoldEm";

describe("texas hold 'em", () => {
  const input = `KC 9S KS KD 9D 3C 6D
  9C AH KS KD 9D 3C 6D
  AC QC KS KD 9D 3C
  9H 5S
  4D 2D KS KD 9D 3C 6D
  7S TS KS KD 9D`;
  const expected = `KC 9S KS KD 9D 3C 6D Full House (winner)
  9C AH KS KD 9D 3C 6D Two Pairs
  AC QC KS KD 9D 3C 
  9H 5S 
  4D 2D KS KD 9D 3C 6D Flush
  7S TS KS KD 9D`

  it('should split by line', () => {
    expect(TexasHoldEm.parse(input)).toHaveLength(6);
  });
});