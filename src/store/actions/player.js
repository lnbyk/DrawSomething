export const GET_ALL_PLAYERS = "GET_ALL_PLAYERS";


export const getAllPlayers = (players) => {
  return {
    type: GET_ALL_PLAYERS,
    players: players,
  };
};