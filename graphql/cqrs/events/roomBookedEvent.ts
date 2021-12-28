import {Event} from "../eventNotifications";
import {DateRange, RoomName} from "../types";

export class RoomBookedEvent implements Event, DateRange {
  private readonly _roomName: RoomName;
  private readonly _arrivalDate: Date;
  private readonly _departureDate: Date;

  constructor({
                roomName,
                arrivalDate,
                departureDate
              }: { roomName: RoomName, arrivalDate: Date, departureDate: Date }) {
    this._roomName = roomName;
    this._arrivalDate = arrivalDate;
    this._departureDate = departureDate;
  }

  get departureDate(): Date {
    return this._departureDate;
  }

  get arrivalDate(): Date {
    return this._arrivalDate;
  }

  get roomName(): RoomName {
    return this._roomName;
  }
}