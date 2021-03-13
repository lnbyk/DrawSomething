import React, { useEffect, useRef, useState } from "react";
import RoomCreateModal from "../components/RoomCreateModal";
import Table from "../components/Table";
import RefreshIcon from "@material-ui/icons/Refresh";
import Room from "../models/Room";
import Socket from "../utils/socket";
import {
  getAllRoom,
  createNewRoomSocket,
  getAllRoomsSocket,
} from "../store/actions/room";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { useHistory } from "react-router";

const { promisify } = require("util");

const curRoom = new Room("21313", 60, "aad", 2);
const GameLobbyScreen = (props) => {
  const modalRef = useRef();
  const [totalRooms, setTotalRooms] = useState(2);
  const [timeLeft, setTimeLeft] = useState(curRoom.prepare);
  const [gameState, setGameState] = useState(Room.GAME_STATE.prepare);
  const [socket, setSocket] = useState(Socket.getInstance());
  const allRooms = useSelector((state) => {
    return state.room.room;
  });

  const dispatch = useDispatch();
  const history = useHistory();

  socket.socket.on("allRooms", (rooms) => {
    rooms = JSON.parse(rooms);
    dispatch(getAllRoom(rooms));
  });

  const createRoom = () => {
    const modal = modalRef.current;
    setTimeout(async () => {
      try {
        const result = await modal.show();
        let createdRoom = {
          id: uuidv4(),
          name: result.name,
          timeLimit: result.timeLimit,
          maxPlayer: result.maxPlayer,
        };
        dispatch(createNewRoomSocket(socket, createdRoom));
        history.push("/", { roomid: createdRoom.id });
      } catch (err) {
        console.log(err);
        alert("cancel");
      }
    }, 100);
  };

  const joinRoom = (id) => {
    console.log(id);
    let createdRoom = {
      id: id,
      name: 1,
      timeLimit: 1,
      maxPlayer: 1,
    };
    dispatch(createNewRoomSocket(socket, createdRoom));
    history.push("/", { roomid: createdRoom.id });
  };

  const renderRoom = () => {
    for (var i = 0; i < allRooms.length; i++) {
      const rrrrr = allRooms[i];
      if (rrrrr !== null) {
        rooms.push(
          <Table
            key={i + "13132"}
            height={200}
            width={200}
            joinHandler={() => joinRoom(rrrrr.id)}
          ></Table>
        );
      }
    }
  };
  var rooms = [];
  renderRoom();
  useEffect(() => {
    setTotalRooms((e) => e++);
    renderRoom();
  }, [allRooms]);

  // initialize all rooms
  useEffect(() => {
    dispatch(getAllRoomsSocket(socket));
  }, []);

  return (
    <div className="container" id="lobby">
      <button onClick={createRoom}>open </button>
      <RoomCreateModal ref={modalRef} />
      <div className="tables-container">{rooms}</div>
      <div style={{ textAlign: "center" }}>
        {gameState === Room.GAME_STATE.prepare ? (
          <b> {"preparing " + timeLeft + " left"}</b>
        ) : (
          <b>{"Time remaining " + timeLeft}</b>
        )}
      </div>
    </div>
  );
};

export default GameLobbyScreen;
