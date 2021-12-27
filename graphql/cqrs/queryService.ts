import {Subscriber} from "./eventNotifications";
import {DateUtilities} from "./dateUtilities";
import {RoomAddedEvent} from "./events/roomAddedEvent";
import {RoomBookedEvent} from "./events/roomBookedEvent";
import {RoomCanceledEvent} from "./events/roomCanceledEvent";
import {DatePart, RoomName} from "./types";

interface Room {
  roomName: RoomName;
}

export class QueryService {
  private static readonly _rooms: Set<RoomName> = new Set<RoomName>();
  private static readonly _reservationsByDate: Map<DatePart, Set<RoomName>> = new Map<DatePart, Set<RoomName>>();

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
    this._rooms.add(roomAddedEvent.roomName);
  }

  private static logReservation(roomBookedEvent: RoomBookedEvent): void {
    for (let i = roomBookedEvent.arrivalDate;
         i < roomBookedEvent.departureDate;
         i = DateUtilities.nextDay(i)) {
      const date = DateUtilities.datePart(i);
      const reservationsOnDate = this._reservationsByDate.get(date);
      if (reservationsOnDate) {
        reservationsOnDate.add(roomBookedEvent.roomName);
      } else {
        this._reservationsByDate.set(date, new Set<RoomName>(roomBookedEvent.roomName));
      }
    }
  }

  private static cancelReservation(roomCanceledEvent: RoomCanceledEvent) {
    const date = DateUtilities.datePart(roomCanceledEvent.date);
    const reservationsOnDate = this._reservationsByDate.get(date);
    if(reservationsOnDate){
      reservationsOnDate.delete(roomCanceledEvent.roomName);
      if(reservationsOnDate.size === 0){
        this._reservationsByDate.delete(date);
      }
    }
  }

  freeRooms(arrival: Date, departure: Date): Room[] {
    const reservedRoomNames = this._reservedRoomNames(arrival, departure);

    return Array.from(QueryService._rooms)
      .filter(roomName => !reservedRoomNames.has(roomName))
      .map(roomName => {
        return {
          roomName
        }
      });
  }

  private _reservedRoomNames(arrival: Date, departure: Date): Set<RoomName> {
    const arrivalDate = DateUtilities.datePart(arrival);
    const departureDate = DateUtilities.datePart(departure);
    return Array.from(QueryService._reservationsByDate.keys())
      .filter(reservationDate => DateUtilities.isDatePartBetween(reservationDate, arrivalDate, departureDate))
      .reduce((previousValue, reservationDate) => {
        const roomNamesReservedOnDate = QueryService._reservationsByDate.get(reservationDate) || new Set<RoomName>();
        roomNamesReservedOnDate.forEach(value => previousValue.add(value))
        return previousValue;
      }, new Set<RoomName>());
  }

}