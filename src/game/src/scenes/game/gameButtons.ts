import { Drop } from "objects/drop"

import { GameScene } from "./gameScene"

export interface IGameButtonsConstructor {
  scene: GameScene
}

export class GameButtons extends Phaser.GameObjects.Container {
  constructor({ scene }: IGameButtonsConstructor) {
    super(scene, 0, 0)

    let buttonMap = scene.add.image(550, scene.sys.canvas.height - 100, 'buttonMap')
    buttonMap.setInteractive({ cursor: 'pointer' })
    buttonMap.on('pointerover', () => buttonMap.setTexture('buttonMapHover'))
    buttonMap.on('pointerout', () => buttonMap.setTexture('buttonMap'))
    buttonMap.on('pointerdown', () => {
      scene.sound.add('clickSound').play()
      this.destroyScene(scene)
      scene.scene.start('Map')
    })

    let buttonInventory = scene.add.image(400, scene.sys.canvas.height - 100, 'buttonInventory')
    buttonInventory.setInteractive({ cursor: 'pointer' })
    buttonInventory.on('pointerover', () => buttonInventory.setTexture('buttonInventoryHover'))
    buttonInventory.on('pointerout', () => buttonInventory.setTexture('buttonInventory'))
    buttonInventory.on('pointerdown', () => {
      scene.sound.add('clickSound').play()
      this.destroyScene(scene)
      scene.scene.start('Inventory')
    })

    let buttonShop = scene.add.image(250, scene.sys.canvas.height - 100, 'buttonShop')
    buttonShop.setInteractive({ cursor: 'pointer' })
    buttonShop.on('pointerover', () => buttonShop.setTexture('buttonShopHover'))
    buttonShop.on('pointerout', () => buttonShop.setTexture('buttonShop'))
    buttonShop.on('pointerdown', () => {
      scene.sound.add('clickSound').play()
      this.destroyScene(scene)
      scene.scene.start('Shop')
    })

    let buttonBack = scene.add.image(100, scene.sys.canvas.height - 100, 'buttonBack')
    buttonBack.setInteractive({ cursor: 'pointer' })
    buttonBack.on('pointerover', () => buttonBack.setTexture('buttonBackHover'))
    buttonBack.on('pointerout', () => buttonBack.setTexture('buttonBack'))
    buttonBack.on('pointerdown', () => {
      scene.sound.add('clickSound').play()
      this.destroyScene(scene)
      scene.scene.start('SelectShip')
    })
  }

  private destroyScene(scene: GameScene) {
    if (scene.enemy) scene.enemy.destroy()
    if (scene.player) scene.player.destroy()
    scene.scene.stop('Dialog');
    scene.drops.forEach((drop: Drop) => drop.destroy())
    scene.drops = []
  }
}
