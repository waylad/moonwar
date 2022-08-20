import { state } from '../state/state'

export interface IDropConstructor {
  scene: Phaser.Scene;
  x: number;
  y: number;
  texture: string;
  frame?: string | number;
}

export class Drop extends Phaser.Physics.Arcade.Sprite {
  body: Phaser.Physics.Arcade.Body | Phaser.Physics.Arcade.StaticBody

  public getBody(): any {
    return this.body
  }

  constructor(aParams: IDropConstructor) {
    super(aParams.scene, aParams.x, aParams.y, aParams.texture)
    this.body = super.body

    // init drop
    this.x = aParams.x
    this.y = aParams.y

    this.scene.physics.world.enable(this)
    // this.body.allowGravity = false
    this.body.setSize(state.itemSize, state.itemSize)
    this.body.setOffset(state.itemSize / 2, state.itemSize / 2)

    this.scene.add.existing(this)
  }

  update(): void {}
}
