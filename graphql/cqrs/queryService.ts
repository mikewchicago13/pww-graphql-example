import {
  Subscriber,
  EventTypes,
  RoomBookedEvent,
  RoomCanceledEvent
} from "./eventNotifications";
import {DateUtilities} from "./dateUtilities";

interface Room {
  roomName: string;
}

export class QueryService {
  private static readonly _rooms: string[] = new Array(10).fill(1)
    .map((_, index): string => index + "");

  private static readonly _reservationsByDate: any = {};

  static {
    new Subscriber<RoomBookedEvent>().subscribe(EventTypes.RoomBooked, (roomBookedEvent) => {
      this.logReservation(roomBookedEvent);
    })
    new Subscriber<RoomCanceledEvent>().subscribe(EventTypes.RoomCanceled, (roomCanceledEvent) => {
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