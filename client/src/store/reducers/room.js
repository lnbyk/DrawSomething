import { GET_ALL_ROOM, JOIN_ROOM } from "../actions/room";
import { ROOMS } from "../dummy-data";

const initialState = {
  room: ROOMS,
  currentIn: null,
};

const roomReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_ROOM:
      return { ...state, room: action.rooms };
    case JOIN_ROOM:
      return { ...state, currentIn: action.room };
    default:
      return state;
  }
};

export default roomReducer;
