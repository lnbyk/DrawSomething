export const GET_ALL_ROOM = "GET_ALL_ROOM";
export const JOIN_ROOM = "JOIN_ROOM";
export const GAME_STATE = {
  PREPARE: "PREPARE",
  INGAME: "INGAME",
  FINISH: "FINISH",
};

export const ROUND_STATE = {
  PREPARE: "PREPARE",
  DRAWING: "DRAWING",
};

export const getAllRoom = (rooms) => {
  return {
    type: GET_ALL_ROOM,
    rooms: rooms,
  };
};

export const jointRoom = (room) => {
  return {
    type: JOIN_ROOM,
    room:room
  }
}

/***************************************************************************************** */
/* Async Action items using - Sockets													   */
/***************************************************************************************** */
export const createNewRoomSocket = (socket, room) => {
  return (dispatch) => {
    socket.createOrJoin(room);
  };
};

export const getAllRoomsSocket = (socket) => {
  return (dispatch) => {
    socket.getAllRooms();
  };
};

export const startGame = (socket, roomid) => {
  return (dispatch) => {
    socket.startGame(roomid);
  };
};

export const onDraw = (socket, roomid, drawings) => {
  return (dispatch) => {
    socket.onDraw(roomid, drawings);
  }
}


export const sendMessage = (socket, roomid, message) => {
  return (dispatch) => {
    socket.socket.emit("sendMessage", roomid, message)
  }
}

export const leaveRoom = (socket) => {
  return (dispatch) => {
    socket.socket.emit("leaveRoom");
  }
}

export const prepare = (socket, roomid) => {
  return (dispatch) => {
    socket.socket.emit("prepare", roomid);
  }
}