const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('createGame', game => {
      console.log(game)
  })

  socket.on('disconnect', () => {
      console.log(socket.id + " leaves ...")
  })
});

http.listen(8000, () => {
  console.log('listening on *:8000');
});

