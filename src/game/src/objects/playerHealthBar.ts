import { state } from '../state/state'

export interface IplayerHealthBarConstructor {
  scene: Phaser.Scene
  health: number
}

export class PlayerHealthBar extends Phaser.GameObjects.Container {
  private health: number
  private graphicBars: Phaser.GameObjects.Image[]

  constructor({ scene, health }: IplayerHealthBarConstructor) {
    super(scene, 40, 40)
    this.health = health
    scene.add.image(39, 40, 'player-healthbar-container').setOrigin(0)

    this.graphicBars = []
    for (let i = 1; i < state.playerMaxHealth; i++) {
      if (i === 1) this.graphicBars.push(scene.add.image(44, 44, 'player-healthbar-starter').setOrigin(0))
      else this.graphicBars.push(scene.add.image(32 + i * 14, 44, 'player-healthbar-bar').setOrigin(0))
    }

    this.draw()
  }

  public update(health: number): void {
    this.health = health
    this.draw()
  }

  public draw(): void {
    for (let i = 1; i < state.playerMaxHealth; i++) {
      if (i <= this.health) this.graphicBars[i - 1].visible = true
      else this.graphicBars[i - 1].visible = false
    }
  }
}
