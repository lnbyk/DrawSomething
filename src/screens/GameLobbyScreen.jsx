import React, { useEffect, useRef, useState } from "react";
import RoomCreateModal from "../components/RoomCreateModal";
import Table from "../components/Table";
import RefreshIcon from "@material-ui/icons/Refresh";
import Room from "../models/Room";
const async = require("async");
const { promisify } = require("util");

const curRoom = new Room("21313", 60, "aad", 2);
const GameLobbyScreen = (props) => {
  const modalRef = useRef(null);
  const [totalRooms, setTotalRooms] = useState(10);
  const [timeLeft, setTimeLeft] = useState(curRoom.prepare);
  const [gameState, setGameState] = useState(Room.GAME_STATE.prepare);

  const createRoom = () => {
    const modal = modalRef.current;
    setTimeout(async () => {
      try {
        const result = await modal.show();
        alert(JSON.stringify(result));
      } catch (err) {
        alert("cancel");
      }
    }, 100);
  };
  const renderRoom = () => {
    for (var i = 0; i < totalRooms; i++) {
      rooms.push(<Table key={i + "13132"} height={200} width={200}></Table>);
    }
  };
  var rooms = [];
  renderRoom();
  useEffect(() => {
    rooms = [];
    renderRoom();
  }, [totalRooms]);

  const prepareTimer = async () => {
    return new Promise((resolve) => {
      var i = curRoom.prepare;
      const interval = setInterval(() => {
        setTimeLeft(i);
        i--;
        //console.log(this.prepare)
        if (i === -1) {
          clearInterval(interval);
          resolve();
        }
      }, 100);
    });
  };

  const gameTimer = async () => {
    setGameState(Room.GAME_STATE.INGAME);
    return await new Promise((resolve) => {
      var i = curRoom.timeLimit;
      const interval = setInterval(() => {
        setTimeLeft(i)
        i--;
        if (i === -1) {
          clearInterval(interval);
          resolve();
        }
      }, 100);
    });
  };

  const gameLoop = async () => {
    setGameState(Room.GAME_STATE.prepare);
    await prepareTimer();
    await gameTimer();
  };

  const start = async () => {
    var index = 0;
    while (index < 1) {
      // alert(1)
      await gameLoop();
     setGameState(Room.GAME_STATE.prepare);
      index++;
    }
  };

  console.log(curRoom.prepare);
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
      <button onClick={start}>sssss</button>
    </div>
  );
};

export default GameLobbyScreen;
