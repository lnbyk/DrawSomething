import React from "react";
import Button from "@material-ui/core/Button";
import Room from "../models/Room";
import draingPad from "../assets/draingPad.png";
import draingPadBW from "../assets/draingPadBW.png";
import "./Table.css";
const Table = (props) => {
  const { joinHandler, gameState, players, roomName } = props;
  const disabled = gameState === Room.GAME_STATE.INGAME;
  const topPlayer = players.slice(0, 2);
  const bottomPlayer = players.slice(2, 5);

  const isLock = false

  const Seat = (props) => {
    return (
      <div
        className={props.className}
        style={{
          backgroundImage: `url(${props.v === null ? draingPadBW : draingPad})`,
          cursor: props.v === null ? "pointer" : "",
        }}
        onClick={props.v !== null ? () => {} : joinHandler}
      ></div>
    );
  };

  return (
    <div
      className="round-table"
      style={{ width: props.width, height: props.height }}
    >
      <div
        id="lock"
        style={{
          position: "absolute",
          top: 0,
          width: "100%",
          textAlign: "center",
          display:isLock ? "":"none"
        }}
      >
        <b>🔒</b>
      </div>
      <div className="round-table-top">
        {topPlayer.map((v) => (
          <Seat v={v} className="child-table" />
        ))}
      </div>
      <div className="round-table-bottom">
        {bottomPlayer.map((v) => (
          <Seat v={v} className="child-table-bottom" />
        ))}
      </div>
      <Button
        variant="contained"
        style={{
          backgroundColor: disabled ? "red" : "#00FF00",
          width: "40%",
          height: "15%",
          borderRadius: "30px",
          borderWidth: "2px 2px",
          left: "50%",
          top: "90%",
          transform: "translateX(-50%) translateY(-100%)",
          display: "inline",
          fontSize: 10,
          color: "black",
        }}
        disabled={disabled}
        onClick={joinHandler}
      >
        {disabled ? "IN-GAME " : "JOIN"}
      </Button>

      <div
        style={{
          color: "lightgray",
          position: "absolute",
          bottom: "-13%",
          width: "100%",
          textAlign: "center",
        }}
      >
        <b> {roomName === "" ? "gameRoom" : roomName}</b>
      </div>
    </div>
  );
};

export default Table;
