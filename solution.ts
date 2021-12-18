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

function dateFrom(yearMonth: string, dayOfMonth: number): Date {
  return new Date(yearMonth + "-" + String(dayOfMonth).padStart(2, "0"));
}

export function allDatesInMonth(yearMonth: string, numberOfDaysInMonth: number): Date[] {
  return new Array(numberOfDaysInMonth).fill(1)
    .map((_, index) => dateFrom(yearMonth, index + 1));
}

const add = (a: number, b: number): number => a + b;

function totalForDay(users: User[] | [], dateInMonth: Date, dailyRate: number) : number {
  return users
    .map((x: User) => new UserCalculations(x))
    .filter((x: UserCalculations) => x.isActiveOn(dateInMonth))
    .map(() => dailyRate)
    .reduce(add, 0)
}

export function billFor(
  yearMonth: string,
  activeSubscription: Subscription | null,
  users: User[] | []
): number {
  if (!activeSubscription) {
    return 0;
  }
  const lastOfMonth = lastDayOfMonth(dateFrom(yearMonth, 2));
  const numberOfDaysInMonth = lastOfMonth.getDate();
  const dailyRate = activeSubscription.monthlyPriceInDollars / numberOfDaysInMonth;

  const total = allDatesInMonth(yearMonth, numberOfDaysInMonth)
    .map(dateInMonth => totalForDay(users, dateInMonth, dailyRate))
    .reduce(add, 0);

  return Number(total.toFixed(2));
}

function lastDayOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}