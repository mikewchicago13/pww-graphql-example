interface Booking {
  clientId: string;
  roomName: string;
  arrivalDate: Date;
  departureDate: Date;
}

export class CommandService {
  bookARoom(booking: Booking): void {
    EventNotifications.publish({
      roomName: booking.roomName,
      arrivalDate: booking.arrivalDate,
      departureDate: booking.departureDate
    })
  }
}

interface RoomBookedEvent {
  roomName: string;
  arrivalDate: Date;
  departureDate: Date;
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
  private readonly _rooms: Room[] = new Array(10).fill(1)
    .map((_, index): Room => {
      return {
        roomName: index + "",
      }
    });

  private _reservationsByDate: any = {};

  private static nextDay(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
  }

  private static datePart(date: Date): string {
    return date.toISOString().split("T")[0];
  }

  constructor() {
    EventNotifications.subscribe(({roomBookedEvent}) => {
      for (let i = roomBookedEvent.arrivalDate; i < roomBookedEvent.departureDate; i = QueryService.nextDay(i)) {
        const date = QueryService.datePart(i);
        if (this._reservationsByDate[date]) {
          this._reservationsByDate[date][roomBookedEvent.roomName] = 1;
        } else {
          const map: any = {}
          map[roomBookedEvent.roomName] = 1;
          this._reservationsByDate[date] = map;
        }
      }
    })
  }

  freeRooms(arrival: Date, departure: Date): Room[] {
    const availableRooms: Room[] = [...this._rooms];
    for (let i = arrival; i < departure; i = QueryService.nextDay(i)) {
      const datePart = QueryService.datePart(i);
      const reservationsOnDate = this._reservationsByDate[datePart] || {};
      availableRooms
        .forEach((value, index) => {
          if (reservationsOnDate[value.roomName]) {
            availableRooms.splice(index, 1);
          }
        })
    }
    return availableRooms;
  }
}