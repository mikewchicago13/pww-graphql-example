import {Event} from "../eventNotifications";
import {RoomName} from "../types";

export class RoomAddedEvent implements Event {
  private readonly _roomName: RoomName;

  constructor(roomName: RoomName) {
    this._roomName = roomName;
  }

  get roomName(): RoomName {
    return this._roomName;
  }
}