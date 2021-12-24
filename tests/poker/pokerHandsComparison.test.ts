import {PokerHandsInput} from "../../graphql/poker/pokerHandsComparison";

describe('poker hands comparison', () => {
  describe('parse input', () => {
    const comparison = new PokerHandsInput().parse("Black: 2H 3D 5S 9C KD  White: 2C 3H 4S 8C AH");
    it('should have black hand', () => {
      expect(comparison.black + "").toBe("2H 3D 5S 9C KD");
    });
    it('should have white hand', () => {
      expect(comparison.white + "").toBe("2C 3H 4S 8C AH");
    });
  });

  describe('choose a winner', () => {
    
  });

  describe('describe winning hand', () => {

  });
});