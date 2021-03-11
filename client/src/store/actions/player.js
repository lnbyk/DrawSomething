export const GET_ROOM_WITH_ID = "GET_ROOM_WITH_ID";
export const GET_OUT = "GET_OUT";
export const GET_USER_IN_ROOM = "GET_USER_IN_ROOM"

export const getRoomWithId = (id) => {
  return {
    type: GET_USER_IN_ROOM,
    roomId: id,
  };
};

export const getOut = () => {
  return {
    type: GET_OUT,
  }
}
