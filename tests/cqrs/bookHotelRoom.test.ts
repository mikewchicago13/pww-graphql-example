import {CommandService, QueryService} from "../../graphql/cqrs/bookHotelRoom";

describe('book hotel room', () => {
  const arrival = new Date("2021-12-25");
  const departure = new Date("2021-12-26");

  it('should have free rooms', () => {
    expect(new QueryService().freeRooms(arrival, departure))
      .toHaveLength(10);
  });

  describe('should book a room', () => {
    const rooms = new QueryService().freeRooms(arrival, departure);
    const bookedRoom = rooms[0].roomName;
    new CommandService().bookARoom({
      arrivalDate: arrival,
      clientId: "test",
      departureDate: departure,
      roomName: bookedRoom
    })
    it('should have one less room to book', () => {
      expect(new QueryService().freeRooms(arrival, departure)).toHaveLength(9);
    });
    it('should not have booked room available', () => {
      expect(new QueryService().freeRooms(arrival, departure).map(x => x.roomName)).not.toContain(bookedRoom);
    });
  });
});