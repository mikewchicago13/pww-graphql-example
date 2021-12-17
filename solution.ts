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
    return this._user.activatedOn.getTime() <= date.getTime() && (
      date.getTime() <= (this._user.deactivatedOn || new Date("3000-01-01")).getTime()
    );
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
  const dateInMonth = new Date(yearMonth + "-01");
  const lastOfMonth = lastDayOfMonth(dateInMonth);
  const numberOfDaysInMonth = lastOfMonth.getDate();
  const dailyRate = activeSubscription.monthlyPriceInDollars / numberOfDaysInMonth;

  let total = 0;
  for (let i = 1; i <= numberOfDaysInMonth; i++) {
    total += users
      .map(x => new UserCalculations(x))
      .filter((value: UserCalculations) => {
        return value.isActiveOn(new Date(yearMonth + "-" + String(i).padStart(2, "0")))
      })
      .map(() => dailyRate)
      .reduce((a, b) => a + b, 0)
  }


  return total;
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