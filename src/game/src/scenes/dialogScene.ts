import { state } from '../state/state'
import { levels } from '../dsl/dsl.json' assert { type: 'json' }
import { Level, Response, Story } from 'state/stateTypes'

export class DialogScene extends Phaser.Scene {
  private storyText: Phaser.GameObjects.Text | null
  private responseTexts: Phaser.GameObjects.Text[]
  private dialogPadding: number
  private dialogWidth: number
  private dialogHeight: number

  constructor() {
    super({
      key: 'Dialog',
    })
    this.storyText = null
    this.responseTexts = []
    this.dialogPadding = 40
    this.dialogWidth = 900
    this.dialogHeight = 500
  }

  init(): void {}

  preload(): void {}

  create(): void {
    const currentLevel: Level = levels[state.currentLevelIndex] as Level

    this.cameras.main.setBackgroundColor('rgba(0,0,0,0.5)')
    this.add.image(this.sys.canvas.width / 2, this.sys.canvas.height / 2, 'dialog')

    this.displayStoryRecursively(currentLevel.story)
  }

  private displayStoryRecursively(story?: Story): void {
    // Apply effects
    if (story?.effect) {
      if (story.effect.addToPlayerHealth) state.playerHealth += story.effect.addToPlayerHealth
      if (story.effect.addToPlayerThrust) state.playerThrust += story.effect.addToPlayerThrust
      if (story.effect.addToPlayerWeaponPower) state.playerWeaponPower += story.effect.addToPlayerWeaponPower
      if (story.effect.addToEnemyHealth) state.enemyHealth += story.effect.addToEnemyHealth
      if (story.effect.addToEnemyThrust) state.enemyThrust += story.effect.addToEnemyThrust
      if (story.effect.addToEnemyWeaponPower) state.enemyWeaponPower += story.effect.addToEnemyWeaponPower
    }

    // Display Story
    this.storyText = this.add.text(
      this.sys.canvas.width / 2 + this.dialogPadding - this.dialogWidth / 2,
      this.sys.canvas.height / 2 + this.dialogPadding - this.dialogHeight / 2,
      `${story?.statement || 'Nothing happening here.'}`,
      {
        fontFamily: 'Ethnocentric',
        wordWrap: { width: this.dialogWidth - this.dialogPadding * 2 },
      },
    )
    this.storyText.updateText()

    // If no response available, add a simple 'Continue...' response
    if (!(story?.responses?.length && story?.responses?.length > 0)) {
      story = {
        responses: [
          {
            response: 'Continue...',
          },
        ],
      }
    }

    // Display Responses
    story?.responses?.forEach((response: Response, i: number) => {
      const responseText = this.add.text(
        this.sys.canvas.width / 2 + this.dialogPadding - this.dialogWidth / 2,
        this.sys.canvas.height / 2 +
          this.dialogPadding -
          this.dialogHeight / 2 +
          (this.storyText?.height || 50) +
          50 * (i + 1),
        `${i + 1}- ${response.response}`,
        {
          fontFamily: 'Ethnocentric',
          wordWrap: { width: this.dialogWidth - this.dialogPadding * 2 },
        },
      )
      this.responseTexts.push(responseText)
      responseText.updateText()
      responseText.setInteractive({ cursor: 'pointer' })
      responseText.on('pointerover', () => responseText.setTint(0x6155ff))
      responseText.on('pointerout', () => responseText.setTint(0xffffff))
      responseText.on('pointerdown', async () => {
        this.storyText?.destroy()
        this.responseTexts.forEach((responseText) => responseText.destroy())
        if (!!response.story) {
          this.displayStoryRecursively(response.story)
        } else {
          this.scene.stop('Dialog');
          state.paused = false
        }
      })
    })
  }

  update(): void {}
}
