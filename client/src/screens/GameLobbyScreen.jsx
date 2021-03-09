import React, { useRef } from "react";
import RoomCreateModal from "../components/RoomCreateModal";

const GameLobbyScreen = (props) => {
  const modalRef = useRef(null);

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

  return (
    <div className="container">
      <button onClick={createRoom}>open </button>
      <RoomCreateModal ref={modalRef} />
    </div>
  );
};

export default GameLobbyScreen;
