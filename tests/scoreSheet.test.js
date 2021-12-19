import bowling from "../graphql/bowling";

const FRAMES = 10;
describe('scoreSheet', () => {
  describe('no balls thrown yet', () => {
    const actual = bowling().scoreSheet;
    it('should have ten frames', () => {
      expect(actual.frames).toHaveLength(FRAMES);
    });
    for (let i = 0; i < 9; i++) {
      it('frame ' + (i + 1) + ' should have zero balls thrown', () => {
        expect(actual.frames[i].ballsThrown).toStrictEqual([undefined, undefined]);
      });
      it('frame ' + (i + 1) + ' should have running score of undefined', () => {
        expect(actual.frames[i].runningScore).toBeUndefined();
      });
    }

    it('frame ' + 10 + ' should have three undefined balls thrown', () => {
      expect(actual.frames[9].ballsThrown).toStrictEqual([undefined, undefined, undefined]);
    });
    it('frame ' + 10 + ' should have running score of undefined', () => {
      expect(actual.frames[9].runningScore).toBeUndefined();
    });
  });

  describe('all zeros', () => {
    let game = bowling();
    for (let i = 0; i < 20; i++) {
      game = game.roll(0);
    }
    const actual = game.scoreSheet;
    for (let i = 0; i < 9; i++) {
      it('frame ' + (i + 1) + ' should have two balls thrown', () => {
        expect(actual.frames[i].ballsThrown).toStrictEqual([0, 0]);
      });
      it('frame ' + (i + 1) + ' should have running score of 0', () => {
        expect(actual.frames[i].runningScore).toBe(0);
      });
    }

    it('frame ' + 10 + ' should have two balls thrown', () => {
      expect(actual.frames[9].ballsThrown).toStrictEqual([0, 0, undefined]);
    });
    it('frame ' + 10 + ' should have running score of 0', () => {
      expect(actual.frames[9].runningScore).toBe(0);
    });
  });
});