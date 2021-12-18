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

export class UserCalculations {
  private readonly _user: User;

  constructor(user: User) {
    this._user = user;
  }

  static _datePart(a: Date): string {
    return a.toISOString().split("T")[0];
  }

  static readonly _positiveInfinity: Date = new Date("3000-01-01");

  isActiveOn(date: Date): boolean {
    const activatedDate = UserCalculations._datePart(this._user.activatedOn);
    const comparisonDate = UserCalculations._datePart(date);
    const deactivateDate = UserCalculations._datePart(this._user.deactivatedOn || UserCalculations._positiveInfinity);

    const activatedBeforeComparisonDate = activatedDate <= comparisonDate;
    const comparisonBeforeDeactivated = comparisonDate <= deactivateDate;
    const isFirstDayOfSubscription = activatedDate === comparisonDate;
    const isLastDayOfSubscription = deactivateDate === comparisonDate;

    return isFirstDayOfSubscription ||
      isLastDayOfSubscription ||
      activatedBeforeComparisonDate && comparisonBeforeDeactivated;
  }
}

export function monthBookends(yearMonth: string):
  { firstOfMonth: Date, lastOfMonth: Date } {
  const dateInMonth = new Date(yearMonth + "-02");
  return {
    firstOfMonth: firstDayOfMonth(dateInMonth),
    lastOfMonth: lastDayOfMonth(dateInMonth)
  };
}

export function billFor(
  yearMonth: string,
  activeSubscription: Subscription | null,
  users: User[] | []
): number {
  if (!activeSubscription) {
    return 0;
  }
  const {firstOfMonth, lastOfMonth} = monthBookends(yearMonth);
  const numberOfDaysInMonth = lastOfMonth.getDate();
  const dailyRate = activeSubscription.monthlyPriceInDollars / numberOfDaysInMonth;

  let total = 0;
  for (let i = firstOfMonth; i <= lastOfMonth; i = nextDay(i)) {
    total += users
      .map((x: User) => new UserCalculations(x))
      .filter((x: UserCalculations) => x.isActiveOn(i))
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
export function nextDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
}