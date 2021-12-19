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
        expect(actual.frames[i].ballsThrown).toStrictEqual(["0", "0"]);
      });
      it('frame ' + (i + 1) + ' should have running score of 0', () => {
        expect(actual.frames[i].runningScore).toBe(0);
      });
    }

    it('frame ' + 10 + ' should have two balls thrown', () => {
      expect(actual.frames[9].ballsThrown).toStrictEqual(["0", "0", undefined]);
    });
    it('frame ' + 10 + ' should have running score of 0', () => {
      expect(actual.frames[9].runningScore).toBe(0);
    });
  });

  describe('perfect game', () => {
    let game = bowling();
    for (let i = 0; i < 12; i++) {
      game = game.roll(10);
    }
    const actual = game.scoreSheet;
    for (let i = 0; i < 9; i++) {
      it('frame ' + (i + 1) + ' should have one strike and empty fill', () => {
        expect(actual.frames[i].ballsThrown).toStrictEqual(["X", undefined]);
      });
      timeBomb('frame ' + (i + 1) + ' should have running score of 30 per frame', () => {
        expect(actual.frames[i].runningScore).toBe((i + 1) * 30);
      });
    }

    it('frame ' + 10 + ' should have three strikes', () => {
      expect(actual.frames[9].ballsThrown).toStrictEqual(["X", "X", "X"]);
    });
    timeBomb('frame ' + 10 + ' should have running score of 300', () => {
      expect(actual.frames[9].runningScore).toBe(300);
    });
  });

  describe('all 5s, i.e. all spares and fill ball', () => {
    let game = bowling();
    for (let i = 0; i < 21; i++) {
      game = game.roll(5);
    }
    const actual = game.scoreSheet;
    for (let i = 0; i < 9; i++) {
      it('frame ' + (i + 1) + ' should have "5 /"', () => {
        expect(actual.frames[i].ballsThrown).toStrictEqual(["5", "/"]);
      });
      timeBomb('frame ' + (i + 1) + ' should have running score of 15 per frame', () => {
        expect(actual.frames[i].runningScore).toBe((i + 1) * 15);
      });
    }

    it('frame ' + 10 + ' should have "5 / 5"', () => {
      expect(actual.frames[9].ballsThrown).toStrictEqual(["5", "/", "5"]);
    });
    timeBomb('frame ' + 10 + ' should have running score of 150', () => {
      expect(actual.frames[9].runningScore).toBe(150);
    });
  });

  describe('spare on fill ball in the tenth', () => {
    let game = bowling();
    for (let i = 0; i < 18; i++) {
      game = game.roll(0);
    }
    game = game.roll(10);
    game = game.roll(5);
    game = game.roll(5);
    const actual = game.scoreSheet;

    it('frame ' + 10 + ' should have "X 5 /"', () => {
      expect(actual.frames[9].ballsThrown).toStrictEqual(["X", "5", "/"]);
    });
  });
});

function timeBomb(name, fn) {
  const isExpired = new Date() > new Date(2021, 12 - 1, 18, 20);
  const runFn = isExpired ? it : it.skip;
  runFn(name, fn);
}