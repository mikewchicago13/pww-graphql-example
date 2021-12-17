export interface User {
  id: number;
  name: string;
  activatedOn: Date;
  deactivatedOn: Date | null;
  customerId: number;
}

export interface Subscription {
  id: number;
  customerId: number;
  monthlyPriceInDollars: number;
}

class UserCalculations {
  private readonly _user: User;

  constructor(user: User) {
    this._user = user;
  }

  isActiveOn(date: Date): boolean {
    const activatedOn = this._user.activatedOn;
    const activated = activatedOn.getTime();
    const comparison = date.getTime();
    const deactivated = this._user.deactivatedOn || new Date("3000-01-01");
    return activated <= comparison && comparison <= deactivated.getTime();
  }
}

export function billFor(
  yearMonth: string,
  activeSubscription: Subscription | null,
  users: User[] | []
): number {
  if (!activeSubscription) {
    return 0;
  }
  const dateInMonth = new Date(Date.parse(yearMonth + "-02T00:00:00Z"));
  const firstOfMonth = firstDayOfMonth(dateInMonth);
  const lastOfMonth = lastDayOfMonth(dateInMonth);
  const numberOfDaysInMonth = lastOfMonth.getDate();
  const dailyRate = activeSubscription.monthlyPriceInDollars / numberOfDaysInMonth;

  let total = 0;
  for (let i = firstOfMonth; i <= lastOfMonth; i = nextDay(i)) {
    total += users
      .map((x:User) => new UserCalculations(x))
      .filter((value: UserCalculations) => {
        const activeOn = value.isActiveOn(i);
        console.log("activeOn " + activeOn + " date " + i);
        return activeOn;
      })
      .map(() => dailyRate)
      .reduce((a, b) => a + b, 0)
  }

  return Number(total.toFixed(2));
}

/*******************
 * Helper functions *
 *******************/

/**
 Takes a Date object and returns a Date which is the first day
 of that month. For example:

 firstDayOfMonth(new Date(2019, 2, 7)) // => new Date(2019, 2, 1)
 **/
function firstDayOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

/**
 Takes a Date object and returns a Date which is the last day
 of that month. For example:

 lastDayOfMonth(new Date(2019, 2, 7)) // => new Date(2019, 2, 28)
 **/
function lastDayOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

/**
 Takes a Date object and returns a Date which is the next day.
 For example:

 nextDay(new Date(2019, 2, 7))  // => new Date(2019, 2, 8)
 nextDay(new Date(2019, 2, 28)) // => new Date(2019, 3, 1)
 **/
function nextDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
}