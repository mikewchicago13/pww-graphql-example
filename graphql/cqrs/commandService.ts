import {Publisher} from "./eventNotifications";
import {DateUtilities} from "./dateUtilities";
import {RoomAddedEvent} from "./events/roomAddedEvent";
import {RoomBookedEvent} from "./events/roomBookedEvent";
import {RoomCanceledEvent} from "./events/roomCanceledEvent";
import {DatePart, RoomName} from "./types";

interface Booking {
  clientId: string;
  roomName: RoomName;
  arrivalDate: Date;
  departureDate: Date;
}

class ReservableRoom {
  private readonly _roomName: RoomName;
  private readonly _datesReserved: Set<DatePart> = new Set<DatePart>();

  constructor(roomName: RoomName) {
    this._roomName = roomName;
  }

  reserve(booking: Booking): (postReservationAction: (b: Booking) => void) => void {
    return this._reserve(booking, this._validateRoomAvailable.bind(this))(this._bookAllDates.bind(this));
  }

  private _bookAllDates(booking: Booking) {
    for (let i = booking.arrivalDate;
         i < booking.departureDate;
         i = DateUtilities.nextDay(i)) {
      this._datesReserved.add(DateUtilities.datePart(i));
    }
  }

  private _reserve(booking: Booking, validationAction: (b: Booking) => void):
    (reservationAction: (b: Booking) => void) =>
      (notificationAction: (b: Booking) => void) =>
        void {
    return reservationAction => {
      return notificationAction => {
        validationAction(booking);
        reservationAction(booking);
        notificationAction(booking);
      }
    }
  }

  private _validateRoomAvailable(booking: Booking) {
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
    this._datesReserved
      .forEach(datePart => this.cancelSingleNight(datePart, eachNightCanceledCallback));
  }

  private cancelSingleNight(datePart: string, eachNightCanceledCallback: (evt: RoomCanceledEvent) => void) {
    this._datesReserved.delete(datePart);
    eachNightCanceledCallback(new RoomCanceledEvent({
      date: new Date(datePart),
      roomName: this._roomName
    }))
  }

  get roomName(): RoomName {
    return this._roomName;
  }
}

export class CommandService {
  private static readonly _reservationsByRoom: Map<RoomName, ReservableRoom> = new Map<RoomName, ReservableRoom>();

  bookARoom(booking: Booking): void {
    CommandService._reserve(booking)(CommandService._publishRoomBookedEvent);
  }

  private static _publishRoomBookedEvent(booking: Booking) {
    new Publisher<RoomBookedEvent>().publish(new RoomBookedEvent({
          roomName: booking.roomName,
          arrivalDate: booking.arrivalDate,
          departureDate: booking.departureDate
        }
      )
    )
  }

  private static _reserve(booking: Booking):
    (notification: (b: Booking) => void) => void {
    return (notification: (b: Booking) => void) => {
      const room = CommandService._reservationsByRoom.get(booking.roomName);
      if (!room) {
        throw new Error(`Room ${booking.roomName} does not exist`);
      }
      room.reserve(booking)(notification);
    }
  }

  cancelEverything() {
    CommandService._reservationsByRoom.forEach(CommandService._cancel);
  }

  private static _cancel(room: ReservableRoom) {
    room.cancelAllNights((evt: RoomCanceledEvent) => {
      new Publisher<RoomCanceledEvent>().publish(evt);
    });
    CommandService._reservationsByRoom.delete(room.roomName);
  }

  addRooms(roomNames: RoomName[]): void {
    roomNames.forEach(CommandService.addRoom)
  }

  private static addRoom(roomName: RoomName) {
    CommandService._reservationsByRoom.set(roomName, new ReservableRoom(roomName))
    new Publisher<RoomAddedEvent>().publish(new RoomAddedEvent(roomName))
  }
}

