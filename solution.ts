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
  private readonly _activatedDate: string;
  private readonly _deactivateDate: string;

  constructor(user: User) {
    this._activatedDate = UserCalculations._datePart(user.activatedOn);
    this._deactivateDate = UserCalculations._datePart(user.deactivatedOn || UserCalculations._positiveInfinity);
  }

  static _datePart(a: Date): string {
    return a.toISOString().split("T")[0];
  }

  static readonly _positiveInfinity: Date = new Date("3000-01-01");

  isActiveOn(date: Date): boolean {
    const comparisonDate = UserCalculations._datePart(date);

    const activatedBeforeComparisonDate = this._activatedDate <= comparisonDate;
    const comparisonBeforeDeactivated = comparisonDate <= this._deactivateDate;
    const isFirstDayOfSubscription = this._activatedDate === comparisonDate;
    const isLastDayOfSubscription = this._deactivateDate === comparisonDate;

    return isFirstDayOfSubscription ||
      isLastDayOfSubscription ||
      (activatedBeforeComparisonDate && comparisonBeforeDeactivated);
  }
}

function dateFrom(yearMonth: string, dayOfMonth: number): Date {
  return new Date(yearMonth + "-" + String(dayOfMonth).padStart(2, "0"));
}

export function allDatesInMonth(yearMonth: string): Date[] {
  return new Array(daysInMonth(yearMonth)).fill(1)
    .map((_, index) => dateFrom(yearMonth, index + 1));
}

const add = (a: number, b: number): number => a + b;

class Customer {
  private _users: User[] | [];
  private _dailyRate: number;
  constructor(users: User[] | [], dailyRate: number) {
    this._users = users;
    this._dailyRate = dailyRate;
  }

  totalForDay(dateInMonth: Date) : number {
    return this._users
      .map(x => new UserCalculations(x))
      .filter(x => x.isActiveOn(dateInMonth))
      .map(() => this._dailyRate)
      .reduce(add, 0)
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
  const numberOfDaysInMonth = daysInMonth(yearMonth);
  const customer = new Customer(users,
    activeSubscription.monthlyPriceInDollars / numberOfDaysInMonth);

  const total = allDatesInMonth(yearMonth)
    .map(dateInMonth => customer.totalForDay(dateInMonth))
    .reduce(add, 0);

  return Number(total.toFixed(2));
}

function daysInMonth(yearMonth: string): number {
  const date = dateFrom(yearMonth, 2);
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}