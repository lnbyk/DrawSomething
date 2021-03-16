import React, { useCallback, useEffect, useRef, useState } from "react";
import RoomCreateModal from "../components/RoomCreateModal";
import Table from "../components/Table";
import Room from "../models/Room";
import Socket from "../utils/socket";
import {
  getAllRoom,
  createNewRoomSocket,
  getAllRoomsSocket,
  jointRoom,
} from "../store/actions/room";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { useHistory } from "react-router";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";

const curRoom = new Room("21313", 60, "aad", 2);
const GameLobbyScreen = (props) => {
  const modalRef = useRef();
  const [timeLeft, setTimeLeft] = useState(curRoom.prepare);
  const [gameState, setGameState] = useState(Room.GAME_STATE.prepare);
  const [backDrop, setBackDrop] = useState(false);

  const socket = Socket.getInstance();
  const allRooms = useSelector((state) => {
    return state.room.room;
  });

  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    socket.socket.on("allRooms", (rooms) => {
      rooms = JSON.parse(rooms);
      dispatch(getAllRoom(rooms));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    socket.socket.on("jointRoom", (room) => {
      room = JSON.parse(room);
      dispatch(jointRoom(room));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const waitJoinRoom = async (createdRoom) => {
    setBackDrop(true);
    return new Promise((resolve) => {
      setTimeout(() => {
        dispatch(createNewRoomSocket(socket, createdRoom));
        resolve(setBackDrop(false));
      }, 800);
    });
  };
  const createRoom = async () => {
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

        await waitJoinRoom(createdRoom);
        history.push(`/gameroom/${createdRoom.id}`, {
          roomid: createdRoom.id,
        });
      } catch (err) {
        console.log(err);
        alert("cancel");
      }
    }, 100);
  };

  const joinRoom = async (id) => {
    let createdRoom = allRooms.find((v) => v.id === id);
    if (createdRoom.curPlayers < createdRoom.maxPlayer) {
      await waitJoinRoom(createdRoom);
      history.push(`gameroom/${id}`, { roomid: createdRoom.id });
    } else {
      alert("room is full");
    }
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
            gameState={rrrrr.state}
          ></Table>
        );
      }
    }
  };
  var rooms = [];
  renderRoom();
  useEffect(() => {
    renderRoom();
  }, [allRooms]);

  // initialize all rooms
  useEffect(() => {
    dispatch(getAllRoomsSocket(socket));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container" id="lobby">
      <Backdrop style={{ zIndex: 20 }} open={backDrop}>
        <CircularProgress color="inherit" />
      </Backdrop>
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
