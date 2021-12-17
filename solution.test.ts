import {assert} from "chai";
import {billFor, User, Subscription, UserCalculations, monthBookends, nextDay} from "./solution";

const newPlan: Subscription = {
  id: 1,
  customerId: 1,
  monthlyPriceInDollars: 4,
};

const constantUsers: User[] = [
  {
    id: 1,
    name: "Employee #1",
    activatedOn: new Date("2018-11-04"),
    deactivatedOn: null,
    customerId: 1,
  },
  {
    id: 2,
    name: "Employee #2",
    activatedOn: new Date("2018-12-04"),
    deactivatedOn: null,
    customerId: 1,
  },
];

const noUsers: User[] = [];

describe("billFor", function () {
  it("works when the customer has no active users during the month", function () {
    assert.closeTo(billFor("2019-01", newPlan, noUsers), 0.0, 0.01);
  });

  it("works when the customer has no subscription", function () {
    assert.closeTo(billFor("2019-01", null, constantUsers), 0.0, 0.01);
  });

  it("works when everything stays the same for a month", function () {
    assert.closeTo(billFor("2019-01", newPlan, constantUsers), 8.0, 0.01);
  });

  it("works when a user is activated during the month", function () {
    const userSignedUp: User[] = [
      {
        id: 1,
        name: "Employee #1",
        activatedOn: new Date("2018-11-04"),
        deactivatedOn: null,
        customerId: 1,
      },
      {
        id: 2,
        name: "Employee #2",
        activatedOn: new Date("2018-12-04"),
        deactivatedOn: null,
        customerId: 1,
      },
      {
        id: 3,
        name: "Employee #3",
        activatedOn: new Date("2019-01-10"),
        deactivatedOn: null,
        customerId: 1,
      },
    ];
    assert.closeTo(billFor("2019-01", newPlan, userSignedUp), 10.84, 0.01);
  });
  it("works when a user is activated for first day during February", function () {
    const userSignedUp: User[] = [
      {
        id: 1,
        name: "Employee #1",
        activatedOn: new Date("2019-02-01"),
        deactivatedOn: new Date("2019-02-01"),
        customerId: 1,
      }
    ];
    assert.closeTo(billFor("2019-02", newPlan, userSignedUp), 0.14, 0.01);
  });
  it("works when a user is activated for last day during February", function () {
    const userSignedUp: User[] = [
      {
        id: 1,
        name: "Employee #1",
        activatedOn: new Date("2019-02-28"),
        deactivatedOn: new Date("2019-02-28"),
        customerId: 1,
      }
    ];
    assert.closeTo(billFor("2019-02", newPlan, userSignedUp), 0.14, 0.01);
  });

  describe('isActiveOn', () => {
    function getUserCalculations(activatedOn: Date, deactivatedOn: Date | null): UserCalculations {
      return new UserCalculations({
        id: 1,
        name: "dude",
        activatedOn,
        deactivatedOn,
        customerId: 1
      });
    }

    const {firstOfMonth, lastOfMonth} = monthBookends("2019-02");

    describe('month bookends from yearMonth string', () => {
      const actual = getUserCalculations(new Date("2019-02-01"), null);
      describe('timezones WEST of UTC', () => {
        it('firstOfMonth', () => {
          assert.isTrue(actual.isActiveOn(new Date(Date.parse("2019-02-01T00:00:00.000-01:00"))));
        });
        it('lastOfMonth', () => {
          assert.isTrue(actual.isActiveOn(new Date(Date.parse("2019-02-28T00:00:00.000-01:00"))));
        });
      });

      describe('default timezone', () => {
        it('firstOfMonth', () => {
          assert.isTrue(actual.isActiveOn(new Date("2019-02-01")));
        });
        it('lastOfMonth', () => {
          assert.isTrue(actual.isActiveOn(new Date("2019-02-28")));
        });
      });

      describe('timezones EAST of UTC', () => {
        it('firstOfMonth', () => {
          assert.isTrue(actual.isActiveOn(new Date(Date.parse("2019-02-01T00:00:00.000+01:00"))));
        });
        it('lastOfMonth', () => {
          assert.isTrue(actual.isActiveOn(new Date(Date.parse("2019-02-28T00:00:00.000+01:00"))));
        });
      });

      it('iterates through every day', () => {
        let counter = 0;
        for (let i = firstOfMonth; i <= lastOfMonth; i = nextDay(i)) {
          counter++;
        }
        assert.equal(counter, 28);
      });
    });

    describe('activated and deactivated on first of month', () => {
      const actual = getUserCalculations(new Date("2019-02-01"), new Date("2019-02-01"));
      it('first of next month', () => {
        assert.isFalse(actual.isActiveOn(new Date("2019-03-01")));
      });

      const dates = new Array(28);
      let counter = 0;
      for (let i = firstOfMonth; i <= lastOfMonth; i = nextDay(i)) {
        dates[counter++] = actual.isActiveOn(i);
      }
      it('firstOfMonth', () => {
        assert.isTrue(dates[0]);
      });
      describe('all other days are not active', () => {
        dates.slice(1)
          .forEach((value, index) => {
            it(index + "", () => {
              assert.isFalse(value);
            });
          });
      });
    });

    describe('activated and deactivated on last of month', () => {
      const actual = getUserCalculations(new Date("2019-02-28"), new Date("2019-02-28"));
      it('first of next month', () => {
        assert.isFalse(actual.isActiveOn(new Date("2019-03-01")));
      });

      const dates = new Array(28);
      let counter = 0;
      for (let i = firstOfMonth; i <= lastOfMonth; i = nextDay(i)) {
        dates[counter++] = actual.isActiveOn(i);
      }
      it('lastOfMonth', () => {
        assert.isTrue(dates[27]);
      });
      describe('all other days are not active', () => {
        dates.slice(-27)
          .forEach((value, index) => {
            it(index + "", () => {
              assert.isFalse(value);
            });
          });
      });
    });
  });
});
