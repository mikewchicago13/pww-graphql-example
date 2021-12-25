import {CommandService, QueryService} from "../../graphql/cqrs/bookHotelRoom";

describe('book hotel room', () => {
  it('should have free rooms', () => {
    expect(new QueryService()
      .freeRooms(new Date("2021-12-25"), new Date("2021-12-26")))
      .toHaveLength(10);
  });

  describe('should book a room', () => {
    const rooms = new QueryService().freeRooms(new Date("2021-12-25"), new Date("2021-12-26"));
    const bookedRoom = rooms[0].roomName;

    it('should not have booked room available', () => {
      new CommandService().bookARoom({
        arrivalDate: new Date("2021-12-25"),
        clientId: "test",
        departureDate: new Date("2021-12-26"),
        roomName: bookedRoom
      })
      expect(new QueryService()
        .freeRooms(new Date("2021-12-25"), new Date("2021-12-26"))
        .map(x => x.roomName))
        .not.toContain(bookedRoom);
    });
    it('should be available for booking on a different day', () => {
      expect(new QueryService()
        .freeRooms(new Date("2021-12-26"), new Date("2021-12-27"))
        .map(x => x.roomName))
        .toContain(bookedRoom);
    });
  });
});