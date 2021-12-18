declare global {
  interface DateConstructor {
    dateFrom(yearMonth: string, dayOfMonth: number): Date;

    allDatesInMonth(yearMonth: string): Date[];

    numberOfDaysIn(yearMonth: string): number;
  }
}

export {}