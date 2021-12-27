import {Publisher} from "./eventNotifications";
import {DateUtilities} from "./dateUtilities";
import {RoomAddedEvent} from "./events/roomAddedEvent";
import {RoomBookedEvent} from "./events/roomBookedEvent";
import {RoomCanceledEvent} from "./events/roomCanceledEvent";
import {DatePart, RoomName} from "./types";

interface Booking {
  clientId: string;
  roomName: string;
  arrivalDate: Date;
  departureDate: Date;
}

class ReservableRoom {
  private readonly _roomName: RoomName;
  private readonly _datesReserved: Set<DatePart> = new Set<DatePart>();

  constructor(roomName: RoomName) {
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
      this._datesReserved.add(DateUtilities.datePart(i));
    }
  }

  private _validateRoomIsAvailable(booking: Booking) {
    const arrivalDate = DateUtilities.datePart(booking.arrivalDate);
    const departureDate = DateUtilities.datePart(booking.departureDate);

    const doubleBookDates = Array.from(this._datesReserved.keys())
      .filter(reservationDate => DateUtilities.isDatePartBetween(reservationDate, arrivalDate, departureDate))
      .join(",");

    if (doubleBookDates) {
      throw new Error(`Room ${booking.roomName} is already reserved on ${doubleBookDates}`)
    }
  }

  cancelAllNights(eachNightCanceledCallback: (evt: RoomCanceledEvent) => void) {
    Array.from(this._datesReserved.keys())
      .forEach(datePart => {
        this._datesReserved.delete(datePart);
        eachNightCanceledCallback(new RoomCanceledEvent({
          date: new Date(datePart),
          roomName: this._roomName
        }))
      });
  }
}

export class CommandService {
  private static readonly _reservationsByRoom: any = {};

  bookARoom(booking: Booking): void {
    CommandService._reserve(booking);
    CommandService._notify(booking);
  }

  private static _notify(booking: Booking) {
    new Publisher<RoomBookedEvent>().publish({
      evt: new RoomBookedEvent({
        roomName: booking.roomName,
        arrivalDate: booking.arrivalDate,
        departureDate: booking.departureDate
      })
    })
  }

  private static _reserve(booking: Booking): void {
    if (!(booking.roomName in CommandService._reservationsByRoom)) {
      throw new Error(`Room ${booking.roomName} does not exist`);
    }
    const room: ReservableRoom = CommandService._reservationsByRoom[booking.roomName];
    room.reserve(booking);
  }

  cancelEverything() {
    for (const roomName in CommandService._reservationsByRoom) {
      const room: ReservableRoom = CommandService._reservationsByRoom[roomName];
      room.cancelAllNights((evt: RoomCanceledEvent) => {
        new Publisher<RoomCanceledEvent>().publish({
          evt: evt
        });
      });
      delete CommandService._reservationsByRoom[roomName];
    }
  }

  addRooms(roomNames: string[]): void {
    roomNames
      .forEach(roomName => {
        CommandService._reservationsByRoom[roomName] = new ReservableRoom(roomName)
        new Publisher<RoomAddedEvent>().publish({evt: new RoomAddedEvent(roomName)})
      })
  }
}

