import {GET_ALL_PLAYERS} from "../actions/player";


const initialState = {
  players: [],
};

const playerReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_PLAYERS:
      return { ...state, players: action.players };
    default:
      return state
  }
};

export default playerReducer