import Phaser from 'phaser'

export default class extends Phaser.Sprite {
  constructor ({ game, x, y }) {
    super(game, x, y, "terminal_icon")

    this.scale.x = 0.1
    this.scale.y = 0.1
    this.anchor.setTo(0.5)
  }
}
