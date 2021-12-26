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
  private static readonly _reservationsByRoom: any = {};

  static{
    console.log("COMMAND IN_STATIC_INITIALIZER")
  }

  bookARoom(booking: Booking): void {
    CommandService._reserve(booking);
    EventNotifications.publish({
      roomName: booking.roomName,
      arrivalDate: booking.arrivalDate,
      departureDate: booking.departureDate
    })
  }

  private static _reserve(booking: Booking): void {
    if(!(booking.roomName in CommandService._reservationsByRoom)){
      CommandService._reservationsByRoom[booking.roomName] = new ReservableRoom()
    }
    const room: ReservableRoom = CommandService._reservationsByRoom[booking.roomName];
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
  private static readonly _rooms: string[] = new Array(10).fill(1)
    .map((_, index): string => index + "");

  private static readonly _reservationsByDate: any = {};

  static {
    console.log("QUERY IN_STATIC_INITIALIZER");
    EventNotifications.subscribe(({roomBookedEvent}) => {
      this.logReservation(roomBookedEvent);
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