import { GET_ALL_ROOM } from "../actions/room";
import { ROOMS } from "../dummy-data";

const initialState = {
  room: ROOMS,
  currentIn: ROOMS[0],
};

const roomReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_ROOM:
      return { ...state, room : action.rooms };
    default:
      return state;
  }
};

export default roomReducer;
