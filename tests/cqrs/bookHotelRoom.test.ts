import {v4 as uuidv4} from 'uuid';
import {CommandService} from "../../graphql/cqrs/commandService";
import {QueryService} from "../../graphql/cqrs/queryService";

describe('book hotel room', () => {
  it('should have free rooms', () => {
    areAllRoomsAvailableBetween("2021-12-25", "2021-12-26");
  });

  describe('should book a room', () => {
    function bookAndValidateNotAvailableBetween(arrival: string, departure: string) {
      book("0");
      notAvailableBetween(arrival, departure, "0");
    }

    function bookAndValidateAvailableBetween(arrival: string, departure: string) {
      book("0");
      availableBetween(arrival, departure, "0");
    }

    it('should not be available on last day of reservation', () => {
      bookAndValidateNotAvailableBetween("2021-12-25", "2021-12-26");
    });
    it('should not be available on first day of reservation', () => {
      bookAndValidateNotAvailableBetween("2021-12-24", "2021-12-25");
    });
    it('should not be available over entire reservation', () => {
      bookAndValidateNotAvailableBetween("2021-12-24", "2021-12-26");
    });
    it('should not be available on span over entire duration', () => {
      bookAndValidateNotAvailableBetween("2021-12-01", "2021-12-31");
    });
    it('should be available immediately after the reservation expires', () => {
      bookAndValidateAvailableBetween("2021-12-26", "2021-12-27")
    });
    it('should be available immediately before the reservation starts', () => {
      bookAndValidateAvailableBetween("2021-12-21", "2021-12-24")
    });

    describe('cannot double book', () => {
      it('should blow up', () => {
        book("0", "2021-12-24", "2021-12-26")
        areAllRoomsAvailableBetween("1970-01-01", "2021-12-24")
        areAllRoomsAvailableBetween("2021-12-26", "3000-01-01")
        expect(() => areAllRoomsAvailableBetween("2021-12-24", "2021-12-26")).toThrow();
        expect(() => book("0", "2021-01-01", "2021-12-31")).toThrow();
        areAllRoomsAvailableBetween("1970-01-01", "2021-12-24")
        areAllRoomsAvailableBetween("2021-12-26", "3000-01-01")
      });
    });
  });
});

function areAllRoomsAvailableBetween(arrival: string, departure: string) {
  expect(new QueryService()
    .freeRooms(new Date(arrival), new Date(departure)))
    .toHaveLength(10);
}

function notAvailableBetween(arrival: string, departure: string, roomName: string) {
  expect(new QueryService()
    .freeRooms(new Date(arrival), new Date(departure))
    .map(x => x.roomName))
    .not.toContain(roomName);
}

function availableBetween(arrival: string, departure: string, roomName: string) {
  expect(new QueryService()
    .freeRooms(new Date(arrival), new Date(departure))
    .map(x => x.roomName))
    .toContain(roomName);
}

function book(roomName: string, arrival: string = "2021-12-24", departure: string = "2021-12-26") {
  new CommandService().bookARoom({
    arrivalDate: new Date(arrival),
    clientId: "short stay " + uuidv4(),
    departureDate: new Date(departure),
    roomName
  })
}

beforeEach(() => {
  new CommandService()
    .addRooms(new Array(10).fill(1).map((_, index) => index + ""))
})

afterEach(() => {
  new CommandService().cancelEverything();
  areAllRoomsAvailableBetween("1970-01-01", "3000-01-01")
})