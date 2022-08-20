export interface IStarFieldConstructor {
  scene: Phaser.Scene
}

export class StarField extends Phaser.GameObjects.Container {
  private activated: boolean

  constructor({ scene }: IStarFieldConstructor) {
    super(scene, 0, 0 )
    this.activated = false
    
  }
}

