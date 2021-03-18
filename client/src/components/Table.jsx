import React from "react";
import Button from "@material-ui/core/Button";
import Room from "../models/Room";
import "./Table.css";
const Table = (props) => {
  const { joinHandler, gameState } = props;
  const disabled = gameState === Room.GAME_STATE.INGAME;
  return (
    <div
      className="round-table"
      style={{ width: props.width, height: props.height }}
    >
      <div className="round-table-top">
        <div className="child-table"></div>
        <div className="child-table"></div>
      </div>
      <div className="round-table-bottom">
        <div className="child-table-bottom"></div>
        <div className="child-table-bottom"></div>{" "}
        <div className="child-table-bottom"></div>
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
    </div>
  );
};

export default Table;
