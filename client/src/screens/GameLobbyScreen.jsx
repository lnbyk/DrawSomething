import React, { useEffect, useRef, useState } from "react";
import {
  RoomCreateModal,
  PasswordCompareModal,
} from "../components/RoomCreateModal";
import Table from "../components/Table";
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
import LobbyInfoContainer from "../components/LobbyInfoContainer";
import { getAllPlayers, GET_ALL_PLAYERS } from "../store/actions/player";
import { Snackbar } from "@material-ui/core";
// tables

const GameLobbyScreen = (props) => {
  const modalRef = useRef();
  const passwordModalRef = useRef();
  const [backDrop, setBackDrop] = useState(false);
  const [showAvailableRooms, setShowAvailableRooms] = useState(false);
  const [cancel, setCancel] = useState(false);
  const [loadPlayers, setLoadPlayers] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState("");
  const socket = Socket.getInstance();
  const allRooms = useSelector((state) => {
    if (showAvailableRooms) {
      return state.room.room.filter((v) => !v.isPlaying);
    }
    return state.room.room;
  });

  console.log(allRooms);

  const allPlayers = useSelector((state) => state.players.players);
  const dispatch = useDispatch();
  const history = useHistory();
  useEffect(async () => {
    setBackDrop(true);
    const rooms = await new Promise((resolve) => {
      socket.socket.on("allRooms", (rooms) => resolve(JSON.parse(rooms)));
    });
    setBackDrop(false);
    dispatch(getAllRoom(rooms));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    socket.socket.on("jointRoom", (room) => {
      room = JSON.parse(room);
      dispatch(jointRoom(room));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(async () => {
    setLoadPlayers(true);
    const player = await new Promise((resolve) => {
      socket.socket.on("allPlayers", (player) => {
        resolve(JSON.parse(player));
      });
    })
    dispatch(getAllPlayers(player));
    setLoadPlayers(false);
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
          password: result.password,
        };

        await waitJoinRoom(createdRoom);
        history.push(`/gameroom/${createdRoom.id}`, {
          roomid: createdRoom.id,
        });
      } catch (err) {
        console.log(err);
        setCancel(true);
        setSnackBarMessage("cancel");
        await new Promise((resolve) =>
          setTimeout(() => resolve(setCancel(false)), 800)
        );
      }
    }, 100);
  };

  const joinRoom = async (id) => {
    let createdRoom = allRooms.find((v) => v.id === id);
    if (createdRoom.curPlayers < createdRoom.maxPlayer) {
      // compare password
      if (createdRoom.password !== "") {
        try {
          var result = await passwordModalRef.current.show();
          while (result !== createdRoom.password) {
            setSnackBarMessage("wrong password");
            setCancel(true);
            setTimeout(() => setCancel(false), 800);
            result = await passwordModalRef.current.show();

          }
        } catch (err) {
          setSnackBarMessage("cancel");
          setCancel(true);
          await new Promise((resolve) =>
            setTimeout(() => resolve(setCancel(false)), 800)
          );
          return;
        }
      }

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
            players={rrrrr.players}
            gameState={rrrrr.state}
            roomName={rrrrr.name}
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
      <PasswordCompareModal ref={passwordModalRef} />
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={cancel}
        ContentProps={{
          "aria-describedby": "message-id",
        }}
        message={<span id="message-id">{snackBarMessage}</span>}
      />
      <Backdrop style={{ zIndex: 20 }} open={backDrop}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <RoomCreateModal ref={modalRef} />
      <div className="tables-container">{rooms}</div>
      <LobbyInfoContainer
        createRoom={createRoom}
        players={allPlayers}
        showAvailableRooms={() => setShowAvailableRooms((e) => !e)}
        backDrop={loadPlayers}
      />
    </div>
  );
};

export default GameLobbyScreen;
