import {CommandService, QueryService} from "../../graphql/cqrs/bookHotelRoom";

describe('book hotel room', () => {
  const arrival = new Date("2021-12-25");
  const departure = new Date("2021-12-26");

  function getFreeRooms() {
    return new QueryService().freeRooms(arrival, departure);
  }

  it('should have free rooms', () => {
    expect(getFreeRooms()).toHaveLength(10);
  });

  describe('should book a room', () => {
    const rooms = getFreeRooms();
    const bookedRoom = rooms[0].roomName;

    it('should not have booked room available', () => {
      new CommandService().bookARoom({
        arrivalDate: arrival,
        clientId: "test",
        departureDate: departure,
        roomName: bookedRoom
      })
      expect(getFreeRooms().map(x => x.roomName)).not.toContain(bookedRoom);
    });
  });
});