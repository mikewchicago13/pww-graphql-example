import {Subscriber} from "./eventNotifications";
import {DateUtilities} from "./dateUtilities";
import {RoomAddedEvent} from "./events/roomAddedEvent";
import {RoomBookedEvent} from "./events/roomBookedEvent";
import {RoomCanceledEvent} from "./events/roomCanceledEvent";
import {DatePart, DateRange, RoomName} from "./types";

interface Room {
  roomName: RoomName;
}

export class QueryService {
  private static readonly _rooms: Set<RoomName> = new Set<RoomName>();
  private static readonly _reservationsByDate: Map<DatePart, Set<RoomName>> = new Map<DatePart, Set<RoomName>>();

  private static addRoom(roomAddedEvent: RoomAddedEvent) {
    this._rooms.add(roomAddedEvent.roomName);
  }

  private static logReservation(roomBookedEvent: RoomBookedEvent): void {
    DateUtilities.performOnAllNights(reservationDate => this.recordBookingIn(roomBookedEvent.roomName).on(reservationDate))(roomBookedEvent);
  }

  private static recordBookingIn(roomName: RoomName): { on: (reservationDate: DatePart) => void } {
    return {
      on: (reservationDate: DatePart) => {
        const reservationsOnDate = this._reservationsByDate.get(reservationDate);
        if (reservationsOnDate) {
          reservationsOnDate.add(roomName);
        } else {
          this._reservationsByDate.set(reservationDate, new Set<RoomName>(roomName));
        }
      }
    }
  }

  private static cancelReservation(roomCanceledEvent: RoomCanceledEvent) {
    const date = DateUtilities.datePart(roomCanceledEvent.date);
    const reservationsOnDate = this._reservationsByDate.get(date);
    if (reservationsOnDate) {
      reservationsOnDate.delete(roomCanceledEvent.roomName);
      if (reservationsOnDate.size === 0) {
        this._reservationsByDate.delete(date);
      }
    }
  }

  static {
    new Subscriber<RoomBookedEvent>().subscribe(RoomBookedEvent)(this.logReservation.bind(this));
    new Subscriber<RoomCanceledEvent>().subscribe(RoomCanceledEvent)(this.cancelReservation.bind(this));
    new Subscriber<RoomAddedEvent>().subscribe(RoomAddedEvent)(this.addRoom.bind(this));
  }

  freeRooms(arrivalDate: Date, departureDate: Date): Room[] {
    const reservedRoomNames = this._reservedRoomNames({arrivalDate, departureDate});

    return Array.from(QueryService._rooms)
      .filter(roomName => !reservedRoomNames.has(roomName))
      .map(roomName => {
        return {
          roomName
        }
      });
  }

  private _reservedRoomNames(dateRange: DateRange): Set<RoomName> {
    return Array.from(QueryService._reservationsByDate.keys())
      .filter(reservationDate => DateUtilities.isReservationDateBetween(reservationDate, dateRange))
      .reduce((previousValue, reservationDate) => {
        const roomNamesReservedOnDate = QueryService._reservationsByDate.get(reservationDate) || new Set<RoomName>();
        return new Set<RoomName>([...previousValue, ...roomNamesReservedOnDate]);
      }, new Set<RoomName>());
  }

}