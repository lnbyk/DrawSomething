import React, { useEffect, useState, useRef } from "react";
import PlayerCard from "../components/PlayCard";
import DrawingPad from "../components/DrawingPad";
import ChatContainer from "../components/ChatContainer";
import Socket from "../utils/socket";
import { useHistory } from "react-router";
import CircularProgress from "@material-ui/core/CircularProgress";
import Backdrop from "@material-ui/core/Backdrop";
import {
  startGame,
  GAME_STATE,
  ROUND_STATE,
  onDraw,
  leaveRoom,
  prepare,
} from "../store/actions/room";
import { useDispatch, useSelector } from "react-redux";
import CustomButton from "../components/CustomButton";
import CheckIcon from "@material-ui/icons/Check";
import "../App.css";

const HomeScreen = (props) => {
  // const [players, setPlayers] = useState([]);
  const [initialValue, setInitialValue] = useState(
    localStorage.getItem("1111") || null
  );
  const [gameState, setGameState] = useState("waiting");
  const [timeLeft, setTimeLeft] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [backDrop, setBackDrop] = useState(false);

  const socket = Socket.getInstance();
  const dispatch = useDispatch();

  const drawingPadRef = useRef();
  const selectedRoom = useSelector((state) => {
    return state.room.currentIn;
    // return state.room.room.find((v) => v.id === props.location.state.roomid);
  });

  const history = useHistory();
  // update board

  useEffect(() => {
    socket.socket.on("onDraw", (data) => {
      setInitialValue(data);
    });
  });

  // check for room status
  useEffect(() => {
    socket.socket.on("roomPlaying", (data) => {
      data = JSON.parse(data);
      if (data.state === GAME_STATE.PREPARE) {
        setGameState("waiting");
      } else if (data.state === GAME_STATE.INGAME) {
        switch (data.round_state) {
          case ROUND_STATE.PREPARE:
            setGameState("preparing:");
            setTimeLeft(data.prepare);
            setIsEditing(data.currentEditing === socket.socket.id);

            drawingPadRef.current && drawingPadRef.current._clear();
            break;
          case ROUND_STATE.DRAWING:
            setGameState("drawing:");
            setTimeLeft(data.roundTimer);
            setIsEditing(data.currentEditing === socket.socket.id);
            break;
          default:
            break;
        }
      } else if ((data.state = GAME_STATE.FINISH)) {
        setGameState("waiting");
        setTimeLeft("");
        setIsEditing(false);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onStart = () => {
    dispatch(startGame(socket, props.location.state.roomid));
  };

  const onPrepare = () => {
    dispatch(prepare(socket, props.location.state.roomid));
  };
  const onExit = async () => {
    setBackDrop(true);
    dispatch(leaveRoom(socket));
    await new Promise((resolve) => {
      setTimeout(() => {
        history.goBack();
        resolve(setBackDrop(false));
      }, 800);
    });
  };

  const _onDraw = (drawings) => {
    dispatch(onDraw(socket, props.location.state.roomid, drawings));
  };
  const PrepareContainer = () => {
    let currentUser = null;
    let isOwner = null;
    if (selectedRoom) {
      currentUser = selectedRoom.players.find(
        (v) => v && v.id === socket.socket.id
      );
      isOwner = selectedRoom.owner === socket.socket.id;
    }

    return (
      <div className="prepareContainer">
        {" "}
        <CustomButton
          backgroundColor="#00FF00"
          width="46%"
          height="70%"
          onClick={isOwner ? onStart : onPrepare}
        >
          {isOwner ? (
            "Start"
          ) : currentUser && currentUser.prepare ? (
            <div>
              <CheckIcon style={{ fontSize: 60, color: "orange" }} />
              <div
                style={{
                  opacity: 0.6,
                  position: "absolute",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  top: "50%",
                }}
              >
                ready
              </div>
            </div>
          ) : (
            <div style={{ position: "relative" }}>
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  top: "50%",
                }}
              >
                prepare
              </div>
            </div>
          )}
        </CustomButton>
        <CustomButton
          backgroundColor="red"
          width="46%"
          height="70%"
          onClick={onExit}
        >
          Exit
        </CustomButton>
      </div>
    );
  };

  return (
    <div className="container">
      <Backdrop style={{ zIndex: 10 }} open={backDrop}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <div className="player-container">
        <PrepareContainer />
        {selectedRoom &&
          selectedRoom.players.map((val) => {
            if (val === null) return <PlayerCard name={"EMPTY"} />;
            else
              return (
                <PlayerCard
                  key={val.id}
                  name={val.name}
                  isEditing={val.isEditing}
                  score={"score: " + val.points}
                />
              );
          })}
      </div>

      <div className="game-container">
        <DrawingPad
          ref={drawingPadRef}
          initialValue={initialValue}
          onDraw={_onDraw}
          isEditing={isEditing}
          roomid={props.location.state.roomid}
        />
      </div>
      <div className="chat-container">
        <div className="globalTimer">
          <p>{gameState}</p>
          <p style={{ color: "yellowgreen" }}>{timeLeft}</p>
        </div>
        <ChatContainer
          isEditing={isEditing}
          roomid={props.location.state.roomid}
        />
      </div>
    </div>
  );
};

export default HomeScreen;
