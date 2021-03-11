class Player {
  constructor(id, name) {
    this.id = id;
    this.points = 0;
    this.name = name;
    this.isEditing = false;
    this.prepare = false;
  }
}

module.exports = Player;
