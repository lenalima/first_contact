import Phaser from 'phaser'
import CloseBtn from '../sprites/CloseButton'
import SignalDial from '../sprites/SignalDial'

export default class extends Phaser.Group {
  constructor({ game }) {
    super(game)

    this.signalDial = new SignalDial({
      game: this.game,
      x: 300,
      y: 150
    })
    this.add(this.signalDial)
    this.signalDial.inputEnabled = true
    this.signalDial.events.onInputDown.add(this.onSignalDialClick, this)

    this.closeBtn = new CloseBtn({
      game: game,
      x: 580,
      y: 0
    })
    this.add(this.closeBtn)
    this.closeBtn.inputEnabled = true
    this.closeBtn.events.onInputDown.add(this.onCloseClick, this)
    this.onCloseSignal = new Phaser.Signal()

    this.signalSettings = ["12.3", "45.6", "78.9", "99.8"]
    this.currentSetting = 0
    
    this.onSettingChangeSignal = new Phaser.Signal()
  }

  onCloseClick() {
    this.onCloseSignal.dispatch()
  }

  onSignalDialClick() {
    this.signalDial.rotation = (this.currentSetting * 90) % 360
    
    this.currentSetting = (this.currentSetting + 1) % this.signalSettings.length
    var currentSetting = this.signalSettings[this.currentSetting]

    this.onSettingChangeSignal.dispatch(currentSetting)
  }
}
