import { GET_OUT, GET_USER_IN_ROOM} from "../actions/player";
import { ROOMS } from "../dummy-data";


const initialState = {
  room: ROOMS,
  currentIn: ROOMS[0],
};

const playerReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_OUT:
      return { ...state, currentIn: null };
    case GET_USER_IN_ROOM:
      const roomFound = state.filter((v) => v.id === action.roomId);
      if (!roomFound.isFull) {
        return { ...state, currentIn: roomFound };
      }
      return { ...state, currentIn: null };
    default:
      return state
  }
};

export default playerReducer