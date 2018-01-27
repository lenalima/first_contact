import StoryAction from './StoryAction'

export default class extends StoryAction {
  constructor({ game, data }) {
    super(game, data)

    this.prompt = data.prompt
    this.choices = data.choices
    
    var gameState = this.game.state.states[this.game.state.current]
    this.terminal = gameState.terminal

    this.choiceChar = '>'
  }

  onEnable() {
    super.onEnable()

    this.terminal.onBufferEmptySignal.addOnce(this.addClickListeners, this)
    
    this.terminal.addText(this.prompt)

    this.choices.forEach(function(choice) {
      this.terminal.addText("\n\n" + this.choiceChar + " " + choice + "")
    }, this)

    this.terminal.addText("\n")
  }

  onComplete() {
    this.terminal.lines.forEach(function(line) {
      line.events.onInputDown.removeAll()
      line.inputEnabled = false
    }, this)

    super.onComplete()
  }

  addClickListeners() {
    var currentChoice = 0

    this.terminal.lines.forEach(function(line) {
      if(line.text[0] == this.choiceChar) {
        currentChoice++
      }
      
      if(currentChoice > 0 && line.text != '') {
        line.inputEnabled = true
        line.events.onInputDown.addOnce(
          this.onChoiceClick, this, 0, { choice: currentChoice }
        )
      }
    }, this)
  }

  onChoiceClick(choiceText, pointer, option) {
    console.log(option)

    // TODO: record choice somewhere
    
    this.onComplete()
  }
}
