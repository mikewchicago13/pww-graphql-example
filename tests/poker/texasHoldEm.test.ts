import {TexasHoldEm, TexasHoldEmHand} from "../../graphql/poker/texasHoldEm";

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

  describe('create all possible hands', () => {
    const cards = "1D 2D 3D 4D 5D 6D 7D";
    it('should have 7 choose 5 = 21 possible hands', () => {
      expect(new TexasHoldEmHand(cards).allPossibleHands).toHaveLength(21);
    });
    it('should have 21 distinct hands', () => {
      const uniqueHands = new TexasHoldEmHand(cards).allPossibleHands
        .map(value => value.rawCards + "")
        .filter(function (value, index, self) {
          return self.indexOf(value) === index;
        });
      expect(uniqueHands).toHaveLength(21);
    });
    new TexasHoldEmHand(cards).allPossibleHands.forEach(value => {
      it(`${value.rawCards} ${value.name}`, () => {
        expect(value.rawCards.length).toBe(5);
      });
    })
  });
});