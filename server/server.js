const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
const Room = require("./models/Room");
const Player = require("./models/Player");
const { emit } = require("process");

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

var rooms = new Map();
var players = new Map();

io.on("connection", (socket) => {
  // add a newplayer to player lists
  let newPlayer = new Player(socket.id, "test : " + socket.id);
  players.set(socket.id, newPlayer);
  console.log("a user connected .. total players in room : " + players.size);

  // initial join room
  socket.on("onConnect", (player) => {
    console.log(player);
  });

  // create a new room or join a room
  socket.on("createRoom", async (game) => {
    game = JSON.parse(game);
    const { id, timeLimit, name, maxPlayer } = game;
    console.log("craeteRoom by " + socket.id);
    if (rooms.has(id)) {
      var a = rooms.get(id);

      console.log("join same one")
      // try if we can successfully add the player
      try {
        var result = await a.addPlayer(players.get(socket.id));
        socket.emit("room_feedback", JSON.stringify(result));
        socket.join(id);
      } catch (err) {
        socket.emit("room_feedback", err);
      }
    } else {
      var fff = new Room(id, timeLimit, name, maxPlayer, socket.id);
      fff.addPlayer(players.get(socket.id));
      socket.emit("message", "Welcome to ChatCord !");
      rooms.set(id, fff);
      socket.join(id);
    }

    socket.emit("allRooms", JSON.stringify([...rooms.values()]));
    socket.broadcast.emit("allRooms", JSON.stringify([...rooms.values()]));
  });

  // send all rooms to client
  socket.on("allRooms", () => {
    socket.emit("allRooms", JSON.stringify([...rooms.values()]));
  });

  // when client start a game
  socket.on("startGame", async (roomid) => {
    try {
      let curInRoom = [...rooms.values()].find((v) =>
        v.players.some((v) => v && v.id === socket.id)
      );

      console.log(socket.id)
      let result = await curInRoom.canStart();
      socket.emit("room_feedback", result);
      curInRoom.start();
      let roomTimer = setInterval(() => {
        if (curInRoom.state === Room.GAME_STATE.FINISH) {
          console.log("GAME ENDS !");
          clearInterval(roomTimer);
        } else {
          socket.emit("roomPlaying", JSON.stringify(curInRoom));
          console.log(roomid)
          socket.to(roomid).emit("roomPlaying", JSON.stringify(curInRoom));
          // switch (curInRoom.round_state) {
          //   case Room.ROUND_STATE.PREPARE:
          //     console.log(
          //       "\x1b[36m%s\x1b[0m",
          //       `players ${curInRoom.currentEditing} is preparing, time last ${curInRoom.prepare}`
          //     );
          //     break;
          //   case Room.ROUND_STATE.DRAWING:
          //     console.log(
          //       "\x1b[33m%s\x1b[0m",
          //       `players ${curInRoom.currentEditing} is drawing time last ${curInRoom.roundTimer}`
          //     );
          //     break;
          //   default:
          //     console.log(curInRoom.state);
          // }
        }
      }, 1000);
    } catch (err) {
      console.log(err);
      socket.emit("room_feedback", err);
    }
  });



  socket.on("onDraw", (roomid, drawings) => {
    socket.to(roomid).emit('onDraw', JSON.stringify(JSON.parse(drawings)))
  })

  socket.on("disconnect", () => {
    players.delete(socket.id);
    console.log(
      socket.id + " leaves ...  total players in room :" + players.size
    );
    let curInRoom = [...rooms.values()].find((v) =>
      v.players.some((v) => v === socket.id)
    );
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
