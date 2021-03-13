export const GET_ALL_ROOM = "GET_ALL_ROOM";
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
