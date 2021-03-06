import StoryAction from './StoryAction'

export default class extends StoryAction {
  constructor({ game, data }) {
    super(game, data)

    this.password = this.data.password

    this.choices = [
      "abc123",
      "boop",
      "yeah"
    ]

    this.unlockers = data.unlockers

    var gameState = this.game.state.states[this.game.state.current]
    this.terminal = gameState.desktop.terminal
    this.storyEngine = gameState.storyEngine

    this.choiceChar = '>'
  }

  onEnable() {
    super.onEnable()
    
    Object.keys(this.unlockers).forEach(function(unlocker) {
      var node = this.storyEngine.getNode(unlocker)
      node.onCompleteSignal.addOnce(this.onUnlockerNodeComplete, this)
    }, this)
    
    this.showPrompt();
  }

  onComplete() {
    this.terminal.unlock()
    
    this.removeClickListeners()

    super.onComplete()
  }

  showPrompt() {
    this.terminal.onBufferEmptySignal.addOnce(this.addClickListeners, this)

    this.terminal.addText("Enter password:\n\n")
    
    this.choices.forEach(function(choice) {
      this.terminal.addText(this.choiceChar + " " + choice + "\n\n")
    }, this)

    this.terminal.addText("\n")
  }
  
  addClickListeners() {
    var currentChoice = 0

    this.terminal.lines.forEach(function(line) {
      if(line.text[0] == this.choiceChar) {
        currentChoice++
      }
      
      if(currentChoice > 0 && line.text != '') {
        var choiceText = line.text.substring(2, line.text.length)
        
        line.inputEnabled = true
        line.events.onInputDown.addOnce(
          this.onChoiceClick, this, 0, choiceText
        )
      }
    }, this)
  }

  removeClickListeners() {
    this.terminal.lines.forEach(function(line) {
      line.events.onInputDown.removeAll()
      line.inputEnabled = false
    }, this)
  }

  onChoiceClick(choiceText, pointer, password) {
    if(password == this.password) {
      this.onComplete()
    } else {
      this.removeClickListeners();
      this.showPrompt();
    }
  }

  onUnlockerNodeComplete(node) {
    var index = Object.keys(this.unlockers).indexOf(node.id)
    this.choices[index] = this.unlockers[node.id]
  }
}
