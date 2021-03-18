import { TextField } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import Socket from "../utils/socket";
import { sendMessage } from "../store/actions/room";
import "./ChatContainer.css";
import { useDispatch } from "react-redux";

const ChatContainer = (props) => {
  const [guessText, setGuessText] = useState("");
  const [messages, setMessages] = useState([]);
  const socket = new Socket();

  const dispatch = useDispatch();
  const { roomid, isEditing } = props;

  useEffect(() => {
    socket.socket.on("loadMessages", (data) => {
      data = JSON.parse(data);
      setMessages(data);
    });
  }, []);

  const textHandler = (e) => {
    setGuessText(e.target.value);
  };

  const onEnter = (e) => {
    if (e.keyCode === 13) {
      dispatch(sendMessage(socket, roomid, e.target.value));
      setGuessText("");
    }
  };

  const b = [];
  for (var i = 0; i < 10; i++) b.push(i);

  return (
    <div className="chatarea">
      <div className="messagesDisplayArea">
        {messages.map((v) => {
          const textColor = v.id === socket.socket.id ? "pink" : "black";
          return (
            <div style={{ display: "flex", padding: "2%", width: "95%" }}>
              <div
                style={{
                  fontSize: "2.3vh",
                  wordBreak: "break-all",
                  border: "gray solid 0.1px",
                  borderRadius: "10px",
                  textAlign: "left",
                  color: textColor,
                }}
              >
                {v.sender + " : " + v.message}
              </div>
            </div>
          );
        })}
      </div>
      <div className="chatInputArea">
        <TextField
          value={guessText}
          onChange={textHandler}
          onKeyDown={onEnter}
        />
      </div>
      {isEditing ? (
        <div className="inputOverLay">
          <div>You are drawing..</div>
        </div>
      ) : null}
    </div>
  );
};

export default ChatContainer;
