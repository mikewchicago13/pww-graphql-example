import {Publisher, RoomBookedEvent, RoomCanceledEvent} from "./eventNotifications";
import {DateUtilities} from "./dateUtilities";

interface Booking {
  clientId: string;
  roomName: string;
  arrivalDate: Date;
  departureDate: Date;
}

class ReservableRoom {
  private readonly _roomName: string;
  private readonly _datesReserved: any = {};

  constructor(roomName: string) {
    this._roomName = roomName;
  }

  reserve(booking: Booking) {
    this._validateRoomIsAvailable(booking);
    this._bookAllDates(booking);
  }

  private _bookAllDates(booking: Booking) {
    for (let i = booking.arrivalDate;
         i < booking.departureDate;
         i = DateUtilities.nextDay(i)) {
      this._datesReserved[DateUtilities.datePart(i)] = booking.clientId;
    }
  }

  private _validateRoomIsAvailable(booking: Booking) {
    const arrivalDate = DateUtilities.datePart(booking.arrivalDate);
    const departureDate = DateUtilities.datePart(booking.departureDate);

    const doubleBookDates = Object.keys(this._datesReserved)
      .filter(reservationDate => arrivalDate <= reservationDate && reservationDate < departureDate)
      .join(",");

    if(doubleBookDates) {
      throw new Error(`Room ${booking.roomName} is already reserved on ${doubleBookDates}`)
    }
  }

  cancelAllNights(eachNightCanceledCallback: (evt: RoomCanceledEvent) => void) {
    for (const datesReservedKey in this._datesReserved) {
      delete this._datesReserved[datesReservedKey];
      eachNightCanceledCallback(new RoomCanceledEvent({
        date: new Date(datesReservedKey),
        roomName: this._roomName
      }))
    }
  }
}

export class CommandService {
  private static readonly _reservationsByRoom: any = {};

  bookARoom(booking: Booking): void {
    CommandService._reserve(booking);
    CommandService._notify(booking);
  }

  private static _notify(booking: Booking) {
    new Publisher<RoomBookedEvent>().publish(new RoomBookedEvent({
      roomName: booking.roomName,
      arrivalDate: booking.arrivalDate,
      departureDate: booking.departureDate
    }))
  }

  private static _reserve(booking: Booking): void {
    if (!(booking.roomName in CommandService._reservationsByRoom)) {
      CommandService._reservationsByRoom[booking.roomName] = new ReservableRoom(booking.roomName)
    }
    const room: ReservableRoom = CommandService._reservationsByRoom[booking.roomName];
    room.reserve(booking);
  }

  cancelEverything() {
    for (const roomName in CommandService._reservationsByRoom) {
      const room: ReservableRoom = CommandService._reservationsByRoom[roomName];
      room.cancelAllNights((evt: RoomCanceledEvent) => {
        new Publisher<RoomCanceledEvent>().publish(evt);
      });
      delete CommandService._reservationsByRoom[roomName];
    }
  }
}

