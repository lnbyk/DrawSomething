import { io } from "socket.io-client";

const END_POINT = "http://localhost:8000";

class Socket {
  constructor() {
    if (!!Socket._instance) {
      return Socket._instance;
    }

    Socket._instance = this;

    this.socket = io(END_POINT);

    
    return this;
  }

  static getInstance() {
    return this._instance;
  }

  onConnect(player) {
    this.socket.emit("onConnect", JSON.stringify(player));
  }

  createOrJoin(room) {
      this.socket.emit("createRoom", JSON.stringify(room));
  }
  getAllRooms() {
      this.socket.emit("allRooms");
  }
  startGame(roomid) {
      this.socket.emit("startGame", roomid);
  }
  onDraw(roomid, drawings) {
    this.socket.emit("onDraw", roomid, drawings);
  }
}

export default Socket;
