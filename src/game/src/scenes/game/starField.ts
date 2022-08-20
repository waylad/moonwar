export interface IStarFieldConstructor {
  scene: Phaser.Scene
}

export class StarField extends Phaser.GameObjects.Container {
  private activated: boolean
  private distance: number = 300
  private enemySpeed: number = 6
  private stars: Phaser.GameObjects.Sprite[] = []
  private max: number = 400
  private starX: number[] = []
  private starY: number[] = []
  private starZ: number[] = []

  constructor({ scene }: IStarFieldConstructor) {
    super(scene, 0, 0 )
    this.activated = false
    
    for (let i = 0; i < this.max; i++) {
        this.stars.push(scene.add.sprite(scene.sys.canvas.width / 2, scene.sys.canvas.height / 2, 'star'))
        this.starX[i] = Math.floor(Math.random() * 800) - 400
        this.starY[i] = Math.floor(Math.random() * 600) - 300
        this.starZ[i] = Math.floor(Math.random() * 1700) - 100
      }
  }

  public update() {
    for (let i = 0; i < this.max; i++) {
      const perspective = this.distance / (this.distance - this.starZ[i])
      const x_coord = this.scene.sys.canvas.width / 2 + this.starX[i] * perspective
      const y_coord = this.scene.sys.canvas.height / 2 + this.starY[i] * perspective

      this.starZ[i] += this.enemySpeed

      if (this.starZ[i] > 300) {
        this.starZ[i] -= 600
      }

      this.stars[i].setPosition(x_coord, y_coord)
    }
  }
}

