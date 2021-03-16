import React from "react";
import Image from "react-bootstrap/Image";
import "./PlayCard.css";
import a from "../logo.svg";
const PlayerCard = (props) => {
    //f6dfeb

    const isEditingMessage = props.isEditing === null ? "" : props.isEditing ? "Editing":  "Guessing"
    const bgColor = props.isEditing ? '#a1cae2' :'white';
  return (
    <div className="PlayCard" style={{ ...props.style, backgroundColor:bgColor}}>
      <Image src={a} rounded className="playcard-imageholder" />
      <div className="information">
        <div>{props.score}</div>
        <div style={{ color: "orange" }}>{props.name}</div>
        <div>{isEditingMessage}</div>
      </div>
    </div>
  );
};

export default PlayerCard;
