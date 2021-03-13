import React, { useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import PlayerCard from "../components/PlayCard";
import DrawingPad from "../components/DrawingPad";
import Socket from "../utils/socket";
import { startGame, createNewRoomSocket, GAME_STATE, ROUND_STATE, onDraw} from "../store/actions/room";
import { useDispatch } from "react-redux";
import "../App.css";



const HomeScreen = (props) => {
  const [players, setPlayers] = useState([]);
  const [initialValue, setInitialValue] = useState(
    localStorage.getItem("1111") || null
  );
  const [isOwner, setIsOwner] = useState(true);
  const [gameState, setGameState] = useState("waiting");
  const [timeLeft, setTimeLeft] = useState("")

  const socket = Socket.getInstance();
  const dispatch = useDispatch();


  // update board
  socket.socket.on("onDraw", data => {
    setInitialValue(data);
  })

  // check for room status
  socket.socket.on("roomPlaying", (data) => {
    data = JSON.parse(data);
    console.log(data)
    if (data.state === GAME_STATE.PREPARE) {
      setGameState("waiting");
    } else if (data.state === GAME_STATE.INGAME) {
      switch (data.round_state) {
        case ROUND_STATE.PREPARE:
          setGameState("preparing:");
          setTimeLeft(data.prepare);
          break;
        case ROUND_STATE.DRAWING:
          setGameState("drawing:");
          setTimeLeft(data.roundTimer);
          break;
        default:
          break
      }
    }
  });
  useEffect(() => {
    setPlayers((state) =>
      ["name", "1", "2", "3", "4", ...state].filter((_, index) => index < 5)
    );
  }, []);

  const onStart = () => {
    dispatch(startGame(socket, props.location.state.roomid));
  };

  const _onDraw = (drawings) => {
    dispatch(onDraw(socket, props.location.state.roomid, drawings));
  }

  const testRoom = () => {
    dispatch(createNewRoomSocket(socket));
  };
  const PrepareContainer = () => {
    return (
      <div className="prepareContainer">
        {" "}
        <Button
          variant="contained"
          style={{
            backgroundColor: "#00FF00",
            width: "40%",
            height: "70%",
            borderRadius: "30px",
            borderWidth: "2px 2px",
          }}
          onClick={onStart}
        >
          {isOwner ? "Start" : "Prepare"}
        </Button>
        <Button
          variant="contained"
          style={{
            backgroundColor: "red",
            width: "40%",
            height: "70%",
            borderRadius: "30px",
            border: "solid gray",
            borderWidth: "2px 2px",
          }}
        >
          Exit
        </Button>
      </div>
    );
  };

  return (
    <div className="container">
      <div className="player-container">
        <PrepareContainer />
        {players.map((val) => {
          return <PlayerCard name={val} />;
        })}
      </div>

      <div className="game-container">
        <DrawingPad initialValue={initialValue} onDraw={ _onDraw}/>
      </div>
      <div className="chat-container">
        <div className="globalTimer">
          <text>{gameState}</text>
          <text style={{ color: "yellowgreen" }}>{timeLeft}</text>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
