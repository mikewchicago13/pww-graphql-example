import {Subscriber} from "./eventNotifications";
import {DateUtilities} from "./dateUtilities";
import {RoomAddedEvent} from "./events/roomAddedEvent";
import {RoomBookedEvent} from "./events/roomBookedEvent";
import {RoomCanceledEvent} from "./events/roomCanceledEvent";

interface Room {
  roomName: string;
}

export class QueryService {
  private static readonly _rooms: any = {};

  private static readonly _reservationsByDate: any = {};

  static {
    new Subscriber<RoomBookedEvent>().subscribe({
      EventType: RoomBookedEvent,
      callback: (roomBookedEvent) => this.logReservation(roomBookedEvent)
    })
    new Subscriber<RoomCanceledEvent>().subscribe({
      EventType: RoomCanceledEvent,
      callback: (roomCanceledEvent) => this.cancelReservation(roomCanceledEvent)
    })
    new Subscriber<RoomAddedEvent>().subscribe({
      EventType: RoomAddedEvent,
      callback: (roomAddedEvent) => this.addRoom(roomAddedEvent)
    })
  }

  private static addRoom(roomAddedEvent: RoomAddedEvent) {
    this._rooms[roomAddedEvent.roomName] = 1;
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
    if (this._reservationsByDate[date] && this._reservationsByDate[date][roomCanceledEvent.roomName]) {
      delete this._reservationsByDate[date][roomCanceledEvent.roomName];
    }
    if(Object.keys(this._reservationsByDate[date]).length === 0){
      delete this._reservationsByDate[date];
    }
  }

  freeRooms(arrival: Date, departure: Date): Room[] {
    const reservedRoomNames = this._reservedRoomNames(arrival, departure);

    return Object.keys(QueryService._rooms)
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
      .filter(reservationDate => DateUtilities.isDatePartBetween(reservationDate, arrivalDate, departureDate))
      .reduce((previousValue, reservationDate) => {
        const roomNamesReservedOnDate = QueryService._reservationsByDate[reservationDate] || {};
        return {...previousValue, ...roomNamesReservedOnDate};
      }, {});
  }

}