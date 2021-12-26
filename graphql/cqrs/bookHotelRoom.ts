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
    for (let i = booking.arrivalDate;
         i < booking.departureDate;
         i = DateUtilities.nextDay(i)) {
      const datePart = DateUtilities.datePart(i);
      if (datePart in this._datesReserved) {
        throw new Error(`Room ${booking.roomName} is already reserved on ${datePart}`);
      }
      this._datesReserved[datePart] = booking.clientId;
    }
  }

  cancelAllNights(callback: (evt: RoomCanceledEvent) => void) {
    for (const datesReservedKey in this._datesReserved) {
      delete this._datesReserved[datesReservedKey];
      callback({
        date: new Date(datesReservedKey),
        roomName: this._roomName
      })
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
    EventNotifications.publish(EventTypes.RoomBooked, {
      roomName: booking.roomName,
      arrivalDate: booking.arrivalDate,
      departureDate: booking.departureDate
    })
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
        EventNotifications.publish(EventTypes.RoomCanceled, evt);
        delete CommandService._reservationsByRoom[roomName];
      });
    }
  }
}

interface RoomBookedEvent {
  roomName: string;
  arrivalDate: Date;
  departureDate: Date;
}

interface RoomCanceledEvent {
  roomName: string;
  date: Date;
}

class DateUtilities {
  static nextDay(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1,
      date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds());
  }

  static datePart(date: Date): string {
    return date.toISOString().split("T")[0];
  }
}

enum EventTypes {
  RoomBooked,
  RoomCanceled
}

class EventNotifications {
  private static readonly _subscriptions: any = {};

  static subscribe(eventType: EventTypes, callback: (evt: any) => void): void {
    if (!(eventType in this._subscriptions)) {
      this._subscriptions[eventType] = []
    }
    this._subscriptions[eventType].push(callback)
  }

  static publish(eventType: EventTypes, evt: any): void {
    (this._subscriptions[eventType] || []).forEach((value: ((evt: any) => void)) => value(evt))
  }
}

interface Room {
  roomName: string;
}

export class QueryService {
  private static readonly _rooms: string[] = new Array(10).fill(1)
    .map((_, index): string => index + "");

  private static readonly _reservationsByDate: any = {};

  static {
    EventNotifications.subscribe(EventTypes.RoomBooked, (roomBookedEvent) => {
      this.logReservation(roomBookedEvent);
    })
    EventNotifications.subscribe(EventTypes.RoomCanceled, (roomCanceledEvent) => {
      this.cancelReservation(roomCanceledEvent);
    })
  }

  private static logReservation(roomBookedEvent: RoomBookedEvent): void {
    for (let i = roomBookedEvent.arrivalDate;
         i < roomBookedEvent.departureDate;
         i = DateUtilities.nextDay(i)) {
      const date = DateUtilities.datePart(i);
      if (this._reservationsByDate[date]) {
        this._reservationsByDate[date][roomBookedEvent.roomName] = 1;
      } else {
        const map: any = {}
        map[roomBookedEvent.roomName] = 1;
        this._reservationsByDate[date] = map;
      }
    }
  }

  private static cancelReservation(roomCanceledEvent: RoomCanceledEvent) {
    const date = DateUtilities.datePart(roomCanceledEvent.date);
    const reservationsOnCancellationDate = this._reservationsByDate[date];
    if (reservationsOnCancellationDate && reservationsOnCancellationDate[roomCanceledEvent.roomName]) {
      delete reservationsOnCancellationDate[roomCanceledEvent.roomName];
    }
  }

  freeRooms(arrival: Date, departure: Date): Room[] {
    const reservedRoomNames = this._reservedRoomNames(arrival, departure);

    return QueryService._rooms
      .filter(roomName => !(roomName in reservedRoomNames))
      .map(roomName => {
        return {
          roomName
        }
      });
  }

  private _reservedRoomNames(arrival: Date, departure: Date): any {
    const arrivalDate = DateUtilities.datePart(arrival);
    const departureDate = DateUtilities.datePart(departure);
    return Object.keys(QueryService._reservationsByDate)
      .filter(reservationDate => arrivalDate <= reservationDate && reservationDate < departureDate)
      .reduce((previousValue, reservationDate) => {
        const roomNamesReservedOnDate = QueryService._reservationsByDate[reservationDate] || {};
        return {...previousValue, ...roomNamesReservedOnDate};
      }, {});
  }

}