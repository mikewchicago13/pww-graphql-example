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
      callback(new RoomCanceledEvent({
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
    new EventNotifications<RoomBookedEvent>().publish(new RoomBookedEvent({
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
        new EventNotifications<RoomCanceledEvent>().publish(evt);
        delete CommandService._reservationsByRoom[roomName];
      });
    }
  }
}

class RoomBookedEvent implements Event {
  private readonly _roomName: string;
  private readonly _arrivalDate: Date;
  private readonly _departureDate: Date;

  constructor({
                roomName,
                arrivalDate,
                departureDate
              }: { roomName: string, arrivalDate: Date, departureDate: Date }) {
    this._roomName = roomName;
    this._arrivalDate = arrivalDate;
    this._departureDate = departureDate;
  }

  get departureDate(): Date {
    return this._departureDate;
  }

  get arrivalDate(): Date {
    return this._arrivalDate;
  }

  get roomName(): string {
    return this._roomName;
  }

  get eventType(): EventTypes {
    return EventTypes.RoomBooked;
  }
}

class RoomCanceledEvent implements Event {
  private readonly _roomName: string;
  private readonly _date: Date;

  constructor({roomName, date}: { roomName: string, date: Date }) {
    this._roomName = roomName;
    this._date = date;
  }

  get date(): Date {
    return this._date;
  }

  get roomName(): string {
    return this._roomName;
  }

  get eventType(): EventTypes {
    return EventTypes.RoomCanceled;
  }
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

interface Event {
  readonly eventType: EventTypes
}

class EventNotifications<T extends Event> {
  private static readonly _subscriptions: any = {};

  subscribe(eventType: EventTypes, callback: (evt: T) => void): void {
    if (!(eventType in EventNotifications._subscriptions)) {
      EventNotifications._subscriptions[eventType] = []
    }
    EventNotifications._subscriptions[eventType].push(callback)
  }

  publish(evt: T): void {
    (EventNotifications._subscriptions[evt.eventType] || []).forEach((value: ((evt: T) => void)) => value(evt))
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
    new EventNotifications<RoomBookedEvent>().subscribe(EventTypes.RoomBooked, (roomBookedEvent) => {
      this.logReservation(roomBookedEvent);
    })
    new EventNotifications<RoomCanceledEvent>().subscribe(EventTypes.RoomCanceled, (roomCanceledEvent) => {
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