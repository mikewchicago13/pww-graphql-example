import {PokerHandsInput} from "../../graphql/poker/pokerHandsComparison";

describe('poker hands comparison', () => {
  describe('choose a winner', () => {
    describe('high card', () => {
      describe('simple high card', () => {
        it('White', () => {
          const comparison = new PokerHandsInput().parse("Black: 2H 3D 5S 9C KD  White: 2C 3H 4S 8C AH");
          expect(comparison + "").toMatch(/White/);
        });
        it('Black', () => {
          const comparison = new PokerHandsInput().parse("Black: 2C 3H 4S 8C AH  White: 2H 3D 5S 9C KD");
          expect(comparison + "").toMatch(/Black/);
        });
        it('Tie', () => {
          const comparison = new PokerHandsInput().parse("Black: 2C 3H 4S 8C AH  White: 2S 3C 4H 8S AD");
          expect(comparison + "").toMatch(/Tie/);
        });
      });
      describe('high card same, need second highest', () => {
        it('White', () => {
          const comparison = new PokerHandsInput().parse("Black: 2H 3D 5S 9C AD  White: 2C 3H 4S TC AH");
          expect(comparison + "").toMatch(/White/);
        });
        it('Black', () => {
          const comparison = new PokerHandsInput().parse("Black: 2C 3H 4S TC AH  White: 2H 3D 5S 9C AD");
          expect(comparison + "").toMatch(/Black/);
        });
      });
    });

    describe('pair', () => {

      describe('pair vs high card', () => {
        it('White has pair of 2s, Black has higher high card', () => {
          const comparison = new PokerHandsInput().parse("Black: 2H 3D 5S 9C KD  White: 2C 2S 4S 8C QH");
          expect(comparison + "").toMatch(/White/);
        });
        it('Tie', () => {
          const comparison = new PokerHandsInput().parse("Black: 2C 2H 4S 8C AH  White: 2S 2D 4H 8S AD");
          expect(comparison + "").toMatch(/Tie/);
        });
      });

      describe('same pair', () => {
        it('Both have pair of 2s, both have same first two kickers, White has higher last card', () => {
          const comparison = new PokerHandsInput().parse("Black: 2H 2D 3S 8S KD  White: 2C 2S 4S 8C KH");
          expect(comparison + "").toMatch(/White/);
        });
        it('Tie', () => {
          const comparison = new PokerHandsInput().parse("Black: 2H 2D 4C 8S KD  White: 2C 2S 4S 8C KH");
          expect(comparison + "").toMatch(/Tie/);
        });
      });

      it('higher pair wins, ignoring kickers', () => {
        const comparison = new PokerHandsInput().parse("Black: 3C 3S QS KC AH  White: 5H 5D 2C 3S 4D");
        expect(comparison + "").toMatch(/White/);
      });
    });

    describe('two pairs', () => {
      it('highest pair wins', () => {
        const comparison = new PokerHandsInput().parse("Black: 5C 5S 4S 4C AH  White: 5H 5D 6C 6S AD");
        expect(comparison + "").toMatch(/White/);
      });
      it('second highest pair wins', () => {
        const comparison = new PokerHandsInput().parse("Black: AC AS KS KC 2H  White: AH AD QC QS 2D");
        expect(comparison + "").toMatch(/Black/);
      });
      it('same pairs uses final kicker', () => {
        const comparison = new PokerHandsInput().parse("Black: 3C 3S KS KC AH  White: 3H 3D KC KS QD");
        expect(comparison + "").toMatch(/Black/);
      });
      it('beats a pair', () => {
        const comparison = new PokerHandsInput().parse("Black: 8C 8S 7S 4C AH  White: AH 5D 5C 2S 2D");
        expect(comparison + "").toMatch(/White/);
      });
      it('beats high card', () => {
        const comparison = new PokerHandsInput().parse("Black: 8C 5S 7S 4C AH  White: 3H 5D 5C 2S 2D");
        expect(comparison + "").toMatch(/White/);
      });
      it('tie', () => {
        const comparison = new PokerHandsInput().parse("Black: 3C 3S QS QC AH  White: 3H 3D QC QS AD");
        expect(comparison + "").toMatch(/Tie/);
      });
    });

    describe('three of a kind', () => {
      it('highest set wins', () => {
        const comparison = new PokerHandsInput().parse("Black: AH 5D 6C 6S 6D  White: AC 5S 4S 4C 4H");
        expect(comparison + "").toMatch(/Black/);
      });
      it('beats two pairs', () => {
        const comparison = new PokerHandsInput().parse("Black: 5C 5S 4S 4C AH  White: AH 5D 2C 2S 2D");
        expect(comparison + "").toMatch(/White/);
      });
      it('beats a pair', () => {
        const comparison = new PokerHandsInput().parse("Black: 5C 5S 7S 4C AH  White: AH 5D 2C 2S 2D");
        expect(comparison + "").toMatch(/White/);
      });
      it('beats high card', () => {
        const comparison = new PokerHandsInput().parse("Black: 3C 5S 7S 4C AH  White: AH 5D 2C 2S 2D");
        expect(comparison + "").toMatch(/White/);
      });
    });
    describe('straight', () => {
      it('highest high card wins', () => {
        const comparison = new PokerHandsInput().parse("Black: 2H 3D 4C 5S 6D  White: 3C 4S 5S 6C 7H");
        expect(comparison + "").toMatch(/White/);
      });
      it('ace can be low end of straight', () => {
        const comparison = new PokerHandsInput().parse("Black: 2H 3D 4C 5S 6D  White: AC 2S 3S 4C 5H");
        expect(comparison + "").toMatch(/Black/);
      });
      it('beats three of a kind', () => {
        const comparison = new PokerHandsInput().parse("Black: 2H 3D 4C 5S 6D  White: AC 5S 4S 4C 4H");
        expect(comparison + "").toMatch(/Black/);
      });
      it('beats two pairs', () => {
        const comparison = new PokerHandsInput().parse("Black: 2H 3D 4C 5S 6D  White: AH 5D 5C 2S 2D");
        expect(comparison + "").toMatch(/Black/);
      });
      it('beats a pair', () => {
        const comparison = new PokerHandsInput().parse("Black: 2H 3D 4C 5S 6D  White: AH 5D 7C 2S 2D");
        expect(comparison + "").toMatch(/Black/);
      });
      it('beats high card', () => {
        const comparison = new PokerHandsInput().parse("Black: 2H 3D 4C 5S 6D  White: AH 5D 7C 8S 9D");
        expect(comparison + "").toMatch(/Black/);
      });
      it('tie', () => {
        const comparison = new PokerHandsInput().parse("Black: 2C 3C 4C 5C 6D  White: 2D 3D 4D 5D 6S");
        expect(comparison + "").toMatch(/Tie/);
      });
    });
    describe('flush', () => {
      it('highest high card wins', () => {
        const comparison = new PokerHandsInput().parse("Black: 2H 3H 4H 5H 7H  White: 3C 4C 5C 6C 8C");
        expect(comparison + "").toMatch(/White/);
      });
      it('beats straight', () => {
        const comparison = new PokerHandsInput().parse("Black: 2H 3H 4H 5H 7H  White: AC 2S 3S 4C 5D");
        expect(comparison + "").toMatch(/Black/);
      });
      it('beats three of a kind', () => {
        const comparison = new PokerHandsInput().parse("Black: 2H 3H 4H 5H 7H  White: AC 5S 4S 4C 4H");
        expect(comparison + "").toMatch(/Black/);
      });
      it('beats two pairs', () => {
        const comparison = new PokerHandsInput().parse("Black: 2H 3H 4H 5H 7H  White: AH 5D 5C 2S 2D");
        expect(comparison + "").toMatch(/Black/);
      });
      it('beats a pair', () => {
        const comparison = new PokerHandsInput().parse("Black: 2H 3H 4H 5H 7H  White: AH 5D 7C 2S 2D");
        expect(comparison + "").toMatch(/Black/);
      });
      it('beats high card', () => {
        const comparison = new PokerHandsInput().parse("Black: 2H 3H 4H 5H 7H  White: AH 5D 7C 8S 9D");
        expect(comparison + "").toMatch(/Black/);
      });
      it('tie', () => {
        const comparison = new PokerHandsInput().parse("Black: 2H 3H 4H 5H 7H  White: 2D 3D 4D 5D 7D");
        expect(comparison + "").toMatch(/Tie/);
      });
    });
  });

  describe('describe winning hand', () => {

  });
});