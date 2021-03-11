const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const Room = require("./models/Room");
const Player = require("./models/Player");

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

var rooms = [];
var players = new Map();

io.on("connection", (socket) => {
  // add a newplayer to player lists
  let newPlayer = new Player(socket.id, "test : " + socket.id);
  players.set(socket.id, newPlayer);
  console.log("a user connected .. total players in room : " + players.size);

  // create a new room or join a room
  socket.on("createRoom", async (game) => {
    console.log("craeteRoom by " + socket.id);
    if (rooms.some((v) => v.name == game)) {
      var a = rooms.find((v) => v.name == game);
      // try if we can successfully add the player
      try {
        var result = await a.addPlayer(players.get(socket.id));
        socket.emit("room_feedback", JSON.stringify(result));
        socket.join(game);
      } catch (err) {
        socket.emit("room_feedback", err);
      }
    } else {
      var fff = new Room("20", 2, "11", 2, socket.id);
      fff.name = game;
      fff.addPlayer(players.get(socket.id));
      socket.emit("message", "Welcome to ChatCord !");
      rooms.push(fff);
      socket.join(game);
    }

    // when client start a game
    socket.on("startGame", async (id) => {
      try {
        let curInRoom = rooms.find((v) =>
          v.players.some((v) => v && v.id === id)
        );
        let result = await curInRoom.canStart();
        socket.emit("room_feedback", result);
        curInRoom.start();
        let roomTimer = setInterval(() => {
          if (curInRoom.state === Room.GAME_STATE.FINISH) {
            console.log("GAME ENDS !");
            clearInterval(roomTimer);
          } else {
            switch (curInRoom.round_state) {
              case Room.ROUND_STATE.PREPARE:
                console.log(
                  "\x1b[36m%s\x1b[0m",
                  `players ${curInRoom.currentEditing} is preparing, time last ${curInRoom.prepare}`
                );
                break;
              case Room.ROUND_STATE.DRAWING:
                console.log(
                  "\x1b[33m%s\x1b[0m",
                  `players ${curInRoom.currentEditing} is drawing time last ${curInRoom.roundTimer}`
                );
                break;
              default:
                console.log(curInRoom.state);
            }
          }
        }, 1000);
      } catch (err) {
        console.log(err);
        socket.emit("room_feedback", err);
      }
    });
  });

  socket.on("disconnect", () => {
    players.delete(socket.id);
    console.log(
      socket.id + " leaves ...  total players in room :" + players.size
    );
    let curInRoom = rooms.find((v) => v.players.some((v) => v === socket.id));
    try {
      curInRoom.leave(socket.id, () => {
        if (curInRoom.isEmpty()) {
          rooms.splice(rooms.indexOf(curInRoom), 1);
        }
      });
    } catch (err) {
      socket.emit("message", err.error);
    }
  });
});

http.listen(8000, () => {
  console.log("listening on *:8000");
});
