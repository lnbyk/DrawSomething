import React from 'react';
import Image from 'react-bootstrap/Image'
import "./PlayCard.css"
import a from "../logo.svg"
const PlayerCard = (props) => {

    return <div className="PlayCard" style={{...props.style}}>

        <Image src={a} rounded className="playcard-imageholder" />
        <div className="information">
            <div>
                {"score"}</div>
            <div>{"name"}</div>
            <div>{"drawing"}</div>
        </div>
    </div>
}

export default PlayerCard