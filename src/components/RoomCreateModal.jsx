import React, { forwardRef, useImperativeHandle, useState } from "react";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import Room from "../models/Room";
import Socket from "../utils/socket";
import CustomButton from "./CustomButton";
import "./RoomCreateModal.css";

const timeRange = [60, 70, 80, 90, 100];
const personLimits = [2, 3, 4, 5];

const RoomCreateModal = forwardRef((props, ref) => {
  const [roomName, setRoomName] = useState("");
  const [roomPassord, setRoomPassword] = useState("");
  const [timeLimit, setTimeLimit] = useState(timeRange[0]);
  const [personLimit, setPersonLimit] = useState(personLimits[0]);
  const [isShow, setIsShow] = useState(false);
  const [promiseInfo, setPromiseInfo] = useState(null);
  const socket = new Socket().socket;

  const roomNameHandler = (e) => {
    setRoomName(e.target.value);
  };

  const roomPasswordHandler = (e) => {
    setRoomPassword(e.target.value);
  };
  const timeLimitHandler = (e) => {
    setTimeLimit(e.target.value);
  };

  const personLimitHandler = (e) => {
    setPersonLimit(e.target.value);
  };

  useImperativeHandle(ref, () => ({
    show: async () => {
      return new Promise((resolve, reject) => {
        setIsShow(true);
        setPromiseInfo({ resolve, reject });
      });
    },
  }));

  const createHandler = () => {
    let room = new Room(socket.id, timeLimit, roomName, personLimit);
    setIsShow(false);
    promiseInfo.resolve(room);
  };

  const cancelHandler = () => {
    setIsShow(false);
    promiseInfo.reject();
  };

  return (
    <div
      className="roomcreatemodal-container"
      style={{ display: isShow ? "flex" : "none", zIndex: 20 }}
      ref={ref}
    >
      <div className="room-input">
        <TextField
          id="room-name"
          label="Room Name"
          value={roomName}
          onChange={roomNameHandler}
        />
      </div>
      <div className="room-input">
        <TextField
          id="room-password"
          label="Room Password"
          placeholder="leave empty if no"
          value={roomPassord}
          onChange={roomPasswordHandler}
        />
      </div>
      <div className="room-input">
        <TextField
          id="room-time-limit"
          select
          label="Timie Limit"
          value={timeLimit}
          onChange={timeLimitHandler}
          helperText="Select time limit"
        >
          {timeRange.map((v) => (
            <MenuItem key={v + " seconds"} value={v}>
              {v + " seconds"}
            </MenuItem>
          ))}
        </TextField>
      </div>
      <div className="room-input">
        <TextField
          id="room-time-limit"
          select
          label="Timie Limit"
          value={personLimit}
          onChange={personLimitHandler}
          helperText="Select person limits "
        >
          {personLimits.map((v) => (
            <MenuItem key={v + " persons"} value={v}>
              {v}
            </MenuItem>
          ))}
        </TextField>
      </div>

      <div
        className="create-button-container"
        style={{ height: "13.5", width: "75" }}
      >
        <CustomButton
          backgroundColor="red"
          height="100%"
          border="solid #f7d9d9"
          onClick={cancelHandler}
        >
          cancel
        </CustomButton>

        <CustomButton
          backgroundColor="#f9f3f3"
          height="100%"
          border="solid gray"
          onClick={createHandler}
        >
          create
        </CustomButton>
      </div>
    </div>
  );
});

export default RoomCreateModal;
