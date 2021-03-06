import Phaser from 'phaser'
import AdvancingText from '../ui/AdvancingText'

export default class extends Phaser.Group {
  constructor({ game, onClick, onClickContext }) {
    super(game)
    
    this.modal = game.add.graphics(0, 0);
    this.modal.beginFill(0xFFFF00, 0);
    this.modal.bounds = new PIXI.Rectangle(0, 0, game.world.width, game.world.height);
    this.modal.drawRect(0, 0, game.world.width, game.world.height);
    this.modal.boundsPadding = 0;
    this.modal.inputEnabled = true
    this.modal.events.onInputDown.add(
      onClick, onClickContext, 0
    )
    this.add(this.modal)

    this.text = new AdvancingText({
      game: game,
      y: game.world.height - 50
    })
    this.text.x = game.world.width * 0.5
  }

  destroy() {
    this.modal.destroy()
    this.text.destroy()
  }
  
  setText(line) {
    this.text.setText(line)
  }

  update() {
    this.text.next()
  }
}
