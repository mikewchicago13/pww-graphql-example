interface Booking {
  clientId: string;
  roomName: string;
  arrivalDate: Date;
  departureDate: Date;
}

class ReservableRoom {
  private readonly _datesReserved: any = {};

  reserve(booking: Booking) {
    for (let i = booking.arrivalDate;
         i < booking.departureDate;
         i = DateUtilities.nextDay(i)) {
      const datePart = DateUtilities.datePart(i);
      if(datePart in this._datesReserved){
        throw new Error(`Room ${booking.roomName} is already reserved ${JSON.stringify(this._datesReserved)}`);
      }
      this._datesReserved[datePart] = booking.clientId;
    }
  }
}

export class CommandService {
  private readonly _reservationsByRoom: any = {};

  bookARoom(booking: Booking): void {
    this._reserve(booking);
    EventNotifications.publish({
      roomName: booking.roomName,
      arrivalDate: booking.arrivalDate,
      departureDate: booking.departureDate
    })
  }

  private _reserve(booking: Booking): void {
    if(!(booking.roomName in this._reservationsByRoom)){
      this._reservationsByRoom[booking.roomName] = new ReservableRoom()
    }
    const room: ReservableRoom = this._reservationsByRoom[booking.roomName];
    room.reserve(booking);
  }
}

interface RoomBookedEvent {
  roomName: string;
  arrivalDate: Date;
  departureDate: Date;
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

class EventNotifications {
  private static _subscriptions: (({roomBookedEvent}: { roomBookedEvent: RoomBookedEvent }) => void)[] = []

  static subscribe(callback: ({roomBookedEvent}: { roomBookedEvent: RoomBookedEvent }) => void): void {
    EventNotifications._subscriptions.push(callback)
  }

  static publish(roomBookedEvent: RoomBookedEvent): void {
    this._subscriptions.forEach(value => value({roomBookedEvent}))
  }
}

interface Room {
  roomName: string;
}

export class QueryService {
  private readonly _rooms: string[] = new Array(10).fill(1)
    .map((_, index): string => index + "");

  private readonly _reservationsByDate: any = {};

  constructor() {
    EventNotifications.subscribe(({roomBookedEvent}) => {
      this.logReservation(roomBookedEvent);
    })
  }

  private logReservation(roomBookedEvent: RoomBookedEvent): void {
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

  freeRooms(arrival: Date, departure: Date): Room[] {
    const reservedRoomNames = this._reservedRoomNames(arrival, departure);

    return this._rooms
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
    return Object.keys(this._reservationsByDate)
      .filter(reservationDate => arrivalDate <= reservationDate && reservationDate < departureDate)
      .reduce((previousValue, reservationDate) => {
        const roomNamesReservedOnDate = this._reservationsByDate[reservationDate] || {};
        return {...previousValue, ...roomNamesReservedOnDate};
      }, {});
  }
}