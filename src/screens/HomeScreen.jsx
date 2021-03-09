import React, { useEffect, useState } from "react";

import PlayerCard from "../components/PlayCard";
import DrawingPad from "../components/DrawingPad";
import "../App.css";

const HomeScreen = (props) => {
  const [players, setPlayers] = useState([]);
  const [initialValue, setInitialValue] = useState(
    localStorage.getItem("1111") || null
  );

  useEffect(() => {
    setPlayers((state) =>
      ["name", "1", "2", "3", "4", ...state].filter((_, index) => index < 5)
    );
  }, []);

  return (
    <div className="container">
      <div className="player-container">
        {players.map((val) => {
          return <PlayerCard name={val} />;
        })}
      </div>

      <div className="game-container">
        <DrawingPad initialValue={initialValue}/>
      </div>
      <div className="chat-container"></div>
    </div>
  );
};

export default HomeScreen;
