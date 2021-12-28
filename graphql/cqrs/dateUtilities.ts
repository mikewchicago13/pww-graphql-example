import {DatePart, DateRange} from "./types";

export class DateUtilities {
  private static _nextDay(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1,
      date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds());
  }

  static datePart(date: Date): DatePart {
    return date.toISOString().split("T")[0];
  }

  static isReservationDateBetween(reservationDate: DatePart, range: DateRange): boolean {
    return DateUtilities.datePart(range.arrivalDate) <= reservationDate && reservationDate < DateUtilities.datePart(range.departureDate);
  }

  static performOnAllNights(func: (reservationDate: DatePart) => void): (range: DateRange) => void {
    return range => {
      for (let i = range.arrivalDate;
           DateUtilities.isReservationDateBetween(DateUtilities.datePart(i), range);
           i = DateUtilities._nextDay(i)) {
        func(DateUtilities.datePart(i))
      }
    }
  }
}