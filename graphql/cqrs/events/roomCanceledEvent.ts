import {Event} from "../eventNotifications";
import {RoomName} from "../types";

export class RoomCanceledEvent implements Event {
  private readonly _roomName: RoomName;
  private readonly _date: Date;

  constructor({roomName, date}: { roomName: RoomName, date: Date }) {
    this._roomName = roomName;
    this._date = date;
  }

  get date(): Date {
    return this._date;
  }

  get roomName(): RoomName {
    return this._roomName;
  }
}