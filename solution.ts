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

export interface ActiveCalculations {
  result: boolean;

  _activatedDate: Date;
  _activatedTime: number;
  _comparisonDate: Date;
  _comparisonTime: number;
  _deactivatedDate: Date;
  _deactivatedTime: number;
  _effectiveDeactivationDate: Date;
  _effectiveDeactivationTime: number;
  _activatedBeforeComparisonDate: boolean;
  _comparisonBeforeDeactivated: boolean;
}

export class UserCalculations {
  private readonly _user: User;

  constructor(user: User) {
    this._user = user;
  }

  _isActive(date: Date): ActiveCalculations {
    const activatedTime = this._user.activatedOn.getTime();
    const comparisonTime = date.getTime();
    const deactivatedDate = this._user.deactivatedOn || new Date("3000-01-01");
    const effectiveDeactivationDate = nextDay(deactivatedDate);
    const effectiveDeactivatedTime = effectiveDeactivationDate.getTime();

    const activatedBeforeComparisonDate = activatedTime <= comparisonTime;
    const comparisonBeforeDeactivated = comparisonTime < effectiveDeactivatedTime;
    const result = activatedBeforeComparisonDate && comparisonBeforeDeactivated;
    const calculationComponents: ActiveCalculations = {
      result,
      _activatedDate: this._user.activatedOn,
      _activatedTime: activatedTime,
      _comparisonDate: date,
      _comparisonTime: comparisonTime,
      _deactivatedDate: deactivatedDate,
      _deactivatedTime: deactivatedDate.getTime(),
      _effectiveDeactivationDate: effectiveDeactivationDate,
      _effectiveDeactivationTime: effectiveDeactivatedTime,
      _activatedBeforeComparisonDate: activatedBeforeComparisonDate,
      _comparisonBeforeDeactivated: comparisonBeforeDeactivated
    };
    console.log(JSON.stringify(calculationComponents));
    return calculationComponents
  }

  isActiveOn(date: Date): boolean {
    return this._isActive(date).result;
  }
}

export function monthBookends(yearMonth: string):
  { firstOfMonth: Date, lastOfMonth: Date } {
  const dateInMonth = new Date(yearMonth + "-02T00:00:00Z");
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
  return new Date(Date.UTC(date.getFullYear(), date.getMonth(), 1));
}

/**
 Takes a Date object and returns a Date which is the last day
 of that month. For example:

 lastDayOfMonth(new Date(2019, 2, 7)) // => new Date(2019, 2, 28)
 **/
function lastDayOfMonth(date: Date): Date {
  return new Date(Date.UTC(date.getFullYear(), date.getMonth() + 1, 0));
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