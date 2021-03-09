import Player from "../models/Player";
import Room from "../models/Room";

let room = new Room("1");
let player = new Player("adjwadla", "none", "ada", 60);
let player1 = new Player("adjwadla", "none", "ada", 60);
let player2 = new Player("adjwadla", "none", "ada", 60);
let player3 = new Player("adjwadla", "none", "ada", 60);
room.addPlayer(player);
room.addPlayer(player1);
room.addPlayer(player2);
room.addPlayer(player3);
export const ROOMS = [room];
