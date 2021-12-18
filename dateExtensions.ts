Date.dateFrom = function (yearMonth: string, dayOfMonth: number): Date {
  return new Date(yearMonth + "-" + String(dayOfMonth).padStart(2, "0"));
}
Date.allDatesInMonth = function (yearMonth: string): Date[] {
  return new Array(Date.numberOfDaysIn(yearMonth)).fill(1)
    .map((_, index) => Date.dateFrom(yearMonth, index + 1));
}
Date.numberOfDaysIn = function (yearMonth: string): number {
  const date = Date.dateFrom(yearMonth, 2);
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

export {}