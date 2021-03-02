class Room {
  constructor(id, timeLimit, name, maxPlayer) {
    this.id = id;
    this.name = name;
    this.isPlaying = false;
    this.timeLimit = timeLimit 
    this.maxPlayer = maxPlayer
    this.players = [null, null, null, null, null];
  }

  addPlayer = (p) => {
      this.players.forEach((v, i) => {
          if (v === null && !this.isFull) {
              this.players[i] = p;
              return;
          }
      })
      alert("this room is full, please go to another one");
  }

  isFull = () => {
    var total = 5;
    this.players.forEach(v => {
        if (v === null) {
            total--;
        }
    })
    return total <= this.maxPlayer;
  }
}

export default Room;
