interface Booking {
  clientId: string;
  roomName: string;
  arrivalDate: Date;
  departureDate: Date;
}

export class CommandService {
  bookARoom(booking: Booking): void {
  }
}


interface Room {
  roomName: string;
}

export class QueryService {
  freeRooms(arrival: Date, departure: Date): Room[] {
    return new Array(10).fill(1)
      .map((_, index): Room => {
        return {
          roomName: index + ""
        }
      });
  }
}