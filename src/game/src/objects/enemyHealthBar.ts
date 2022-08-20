import { state } from '../state/state'

export interface IenemyHealthBarConstructor {
  scene: Phaser.Scene
  health: number
}

export class EnemyHealthBar extends Phaser.GameObjects.Container {
  private health: number
  private graphicBars: Phaser.GameObjects.Image[]

  constructor({ scene, health }: IenemyHealthBarConstructor) {
    super(scene, scene.sys.canvas.width - 40, 40)
    this.health = health
    scene.add.image(scene.sys.canvas.width - 39, 40, 'enemy-healthbar-container').setOrigin(1, 0)

    this.graphicBars = []
    for (let i = 1; i < state.playerMaxHealth; i++) {
      if (i === 1)
        this.graphicBars.push(scene.add.image(scene.sys.canvas.width - 44, 44, 'enemy-healthbar-starter').setOrigin(1, 0))
      else
        this.graphicBars.push(
          scene.add.image(scene.sys.canvas.width - 32 - i * 14, 44, 'enemy-healthbar-bar').setOrigin(1, 0),
        )
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
