class Room {
  static GAME_STATE = {
    PREPARE: "PREPARE",
    INGAME: "INGAME",
    FINISH: "FINISH",
  };

  static ROUND_STATE = {
    PREPARE: "PREPARE",
    DRAWING: "DRAWING",
  };

  static QUESTION_SETS = [
    {
      question: "布娃娃",
      hint: "三个字，儿童玩具",
    },
    {
      question: "激光",
      hint: "两个字，光学武器",
    },
    {
      question: "餐巾纸",
      hint: "三个字，餐具",
    },
    {
      question: "耳机",
      hint: "两个字，电子产品",
    },
  ];

  constructor(id, timeLimit, name, maxPlayer, owner, password) {
    this.id = id;
    this.name = name;
    this.owner = owner;
    this.currentEditing = owner;
    this.isPlaying = false;
    this.timeLimit = timeLimit;
    this.roundTimer = timeLimit;
    this.maxPlayer = maxPlayer;
    this.players = [null, null, null, null, null];
    this.curPlayers = 0;
    this.totalRound = 0;
    this.curRound = 0;
    this.prepare = 20;
    this.state = Room.GAME_STATE.PREPARE;
    this.round_state = Room.GAME_STATE.PREPARE;
    this.currentQuestion = Room.QUESTION_SETS[0];
    this.curCorrect = 0;
    this.password = password;
  }

  addPlayer = async (p) => {
    return new Promise((resolve, reject) => {
      for (var i = 0; i < this.players.length; i++) {
        if (this.players[i] === null && !this.isFull()) {
          this.players[i] = p;
          this.curPlayers++;
          console.log(this.players);
          return resolve({
            status: "success",
            message: `Joint Room : ${this.name} `,
          });
        }
      }

      return reject({
        status: "false",
        message: "room is full",
      });
    });
  };

  leave = (p, callback) => {
    console.log(1);
    //this.players.find(v => v.id === p) = null
    this.players[this.players.findIndex((v) => v.id === p)] = null;
    this.curPlayers--;
    console.log(this.players);
    callback();
  };

  isFull = () => {
    return this.curPlayers >= this.maxPlayer;
  };

  isEmpty = () => {
    return this.curPlayers === 0;
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
      this.roundTimer = this.timeLimit;
      const interval = setInterval(() => {
        this.roundTimer--;

        if (this.curCorrect === this.curPlayers) {
          this.currentQuestion =
            Room.QUESTION_SETS[
              Math.floor(Math.random() * Room.QUESTION_SETS.length)
            ];

          clearInterval(interval);
          resolve();
        }

        if (this.isEmpty()) {
          this.curRound = this.totalRound + 1;
          clearInterval(interval);
          resolve();
        }

        console.log(this.roundTimer);

        if (this.roundTimer === 0) {
          clearInterval(interval);
          resolve();
        }
      }, 1000);
    });
  };

  gameLoop = async () => {
    this.round_state = Room.ROUND_STATE.PREPARE;
    await this.prepareTimer();
    this.round_state = Room.ROUND_STATE.DRAWING;
    await this.gameTimer();
  };

  canStart = async () => {
    return await new Promise((resolve, reject) => {
      if (this.curPlayers >= 1) {
        return resolve({
          status: "success",
          message: "Start Game !",
        });
      } else {
        return reject({
          status: "false",
          message: "Not enough player",
        });
      }
    });
  };

  start = async () => {
    this.isPlaying = true;
    this.totalRound = this.curPlayers * 2;
    this.state = Room.GAME_STATE.INGAME;
    while (this.curRound <= this.totalRound) {
      // alert(1)
      console.log(`current editing ${this.currentEditing}`);
      await this.gameLoop();
      this.curRound++;

      this.nextPlayer();
      console.log(`current editing ${this.currentEditing}`);
    }
    this.state = Room.GAME_STATE.FINISH;
    this.isPlaying = false;
  };

  starts = () => {
    this.prepare++;
    console.log(this.prepare);
  };

  nextPlayer = () => {
    var curIndex = this.players.findIndex((v) => v.id === this.currentEditing);
    this.players[curIndex].isEditing = false;
    curIndex = (curIndex + 1) % this.players.length;

    while (curIndex < this.players.length) {
      var nextReadyPlayer = this.players[curIndex];
      if (nextReadyPlayer !== null) {
        this.players[curIndex].isEditing = true;
        this.currentEditing = nextReadyPlayer.id;
        return;
      }
      curIndex++;
      if (curIndex === this.players.length) curIndex = 0;
    }
  };
  
}

module.exports = Room;
