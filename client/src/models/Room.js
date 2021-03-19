class Room {
  static GAME_STATE = {
    PREPARE: "PREPARE",
    INGAME : "INGAME"
  }

  constructor(id, timeLimit, name, maxPlayer, roomPassord) {
    this.id = id;
    this.name = name;
    this.isPlaying = false;
    this.timeLimit = timeLimit;
    this.maxPlayer = maxPlayer;
    this.players = [null, null, null, null, null];
    this.totalRound = 0;
    this.curRound = 0;
    this.prepare = 20;
    this.password = roomPassord;
    this.state = Room.GAME_STATE.prepare
  }

  addPlayer = (p) => {
    this.players.forEach((v, i) => {
      if (v === null && !this.isFull) {
        this.players[i] = p;
        return;
      }
    });
    alert("this room is full, please go to another one");
  };

  isFull = () => {
    var total = 5;
    this.players.forEach((v) => {
      if (v === null) {
        total--;
      }
    });
    return total <= this.maxPlayer;
  };

  prepareTimer = async () => {
    return new Promise((resolve) => {
      this.prepare = 5;
      const interval = setInterval(() => {
        this.prepare--;
        //console.log(this.prepare)
        if (this.prepare === 0) {
          clearInterval(interval);
          resolve();
        }
      }, 1000);
    });
  };

  gameTimer = async () => {
    return await new Promise((resolve) => {
      var i = 30;
      const interval = setInterval(() => {
        i++;
        if (i === 34) {
          clearInterval(interval);
          resolve();
        }
      }, 1000);
    });
  };


  gameLoop = async () => {
    await this.prepareTimer()
    await this.gameTimer()
  }

  start = async () => {
    this.totalRound = this.players.filter((v) => v != null).length * 2;
    var index = 0;
    while (index < 1) {
      // alert(1)
      await this.gameLoop();
      index++;
    }
  };

  starts = () => {
    this.prepare++;
    console.log(this.prepare)
  }
}

export default Room;
