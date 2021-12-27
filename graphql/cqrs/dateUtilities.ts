import {DatePart} from "./types";

export class DateUtilities {
  static nextDay(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1,
      date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds());
  }

  static datePart(date: Date): DatePart {
    return date.toISOString().split("T")[0];
  }

  static isDatePartBetween(reservationDate: DatePart, arrivalDate: DatePart, departureDate: DatePart): boolean {
    return arrivalDate <= reservationDate && reservationDate < departureDate;
  }
}