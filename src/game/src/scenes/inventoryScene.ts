import { upgradeShip } from '../blockchain/lib'
import { state } from '../state/state'

export class InventoryScene extends Phaser.Scene {
  private counter = 0

  constructor() {
    super({
      key: 'Inventory',
    })
  }

  replaceAt = function (original: string, index: number, replacement: string) {
    return original.substring(0, index) + replacement + original.substring(index + replacement.length)
  }

  init(): void {}

  preload(): void {
  }

  create(): void {
    this.add.tileSprite(
      this.sys.canvas.width / 2,
      this.sys.canvas.height / 2,
      this.sys.canvas.width,
      this.sys.canvas.height,
      'background',
    )

    this.add.tileSprite(
      this.sys.canvas.width / 2,
      this.sys.canvas.height / 2,
      this.sys.canvas.width,
      this.sys.canvas.height,
      'bgFlare2',
    )

    this.add.image(this.sys.canvas.width / 2, 80, 'titleInventory')

    const currentShip = state.currentShip || {
      tokenId: 0,
      shipCode: '0000'
    }

    const bigCell = this.add.image(0, 0, 'bigCell')
    const partCabin = this.add.image(0, 0, `partCabin${currentShip.shipCode[0]}`)
    const partEngine = this.add.image(0, 0, `partEngine${currentShip.shipCode[1]}`)
    const partWing = this.add.image(0, 0, `partWing${currentShip.shipCode[2]}`)
    const partWeapon = this.add.image(0, 0, `partWeapon${currentShip.shipCode[3]}`)
    let container = this.add.container(320, 435, [bigCell, partWeapon, partWing, partEngine, partCabin])
    container.setSize(bigCell.width, bigCell.height)

    const cellCabin = this.add.image(350, 220, 'cell')
    const cellEngine = this.add.image(350, 650, 'cell')
    const cellWing = this.add.image(560, 540, 'cell')
    const cellWeapon = this.add.image(560, 330, 'cell')

    const itemCabin = this.add.image(350, 220, `itemCabin${currentShip.shipCode[0]}`)
    const itemEngine = this.add.image(350, 650, `itemEngine${currentShip.shipCode[1]}`)
    const itemWing = this.add.image(560, 540, `itemWing${currentShip.shipCode[2]}`)
    const itemWeapon = this.add.image(560, 330, `itemWeapon${currentShip.shipCode[3]}`)

    for (let j = 0; j < 4; j++) {
      for (let i = 0; i < 6; i++) {
        const cell = this.add.image(800 + i * 130, 250 + j * 130, 'cell')
        const itemName = state.inventory[i + 6 * j]

        if (itemName) {
          const item = this.add.image(800 + i * 130, 250 + j * 130, itemName)
          item.setInteractive({ cursor: 'move' })
          item.setDepth(2)
          let targetCell: Phaser.GameObjects.Image

          if (itemName.indexOf('Cabin') >= 0) targetCell = cellCabin
          if (itemName.indexOf('Weapon') >= 0) targetCell = cellWeapon
          if (itemName.indexOf('Wing') >= 0) targetCell = cellWing
          if (itemName.indexOf('Engine') >= 0) targetCell = cellEngine

          item.on('pointerover', () => {
            cell.setTexture('cellHover')
            targetCell.setTexture('cellHover')
          })
          item.on('pointerout', () => {
            cell.setTexture('cell')
            targetCell.setTexture('cell')
          })
          this.input.setDraggable(item)
          this.input.on('drag', (pointer: Phaser.Input.Pointer, gameObject: any, dragX: number, dragY: number) => {
            gameObject.x = dragX
            gameObject.y = dragY
            this.counter = 0
          })
          this.input.on('dragend', (pointer: Phaser.Input.Pointer, gameObject: any) => {
            this.counter += 1
            if (gameObject.texture.key.indexOf('Cabin') >= 0 && this.counter <= 1) {
              currentShip.shipCode = this.replaceAt(
                currentShip.shipCode,
                0,
                gameObject.texture.key.replace('itemCabin', ''),
              )
              itemCabin.setTexture(`itemCabin${currentShip.shipCode[0]}`)
              partCabin.setTexture(`partCabin${currentShip.shipCode[0]}`)
              upgradeShip(currentShip)
            }
            if (gameObject.texture.key.indexOf('Engine') >= 0 && this.counter <= 1) {
              currentShip.shipCode = this.replaceAt(
                currentShip.shipCode,
                1,
                gameObject.texture.key.replace('itemEngine', ''),
              )
              itemEngine.setTexture(`itemEngine${currentShip.shipCode[1]}`)
              partEngine.setTexture(`partEngine${currentShip.shipCode[1]}`)
              upgradeShip(currentShip)
            }
            if (gameObject.texture.key.indexOf('Wing') >= 0 && this.counter <= 1) {
              currentShip.shipCode = this.replaceAt(
                currentShip.shipCode,
                2,
                gameObject.texture.key.replace('itemWing', ''),
              )
              itemWing.setTexture(`itemWing${currentShip.shipCode[2]}`)
              partWing.setTexture(`partWing${currentShip.shipCode[2]}`)
              upgradeShip(currentShip)
            }
            if (gameObject.texture.key.indexOf('Weapon') >= 0 && this.counter <= 1) {
              currentShip.shipCode = this.replaceAt(
                currentShip.shipCode,
                3,
                gameObject.texture.key.replace('itemWeapon', ''),
              )
              itemWeapon.setTexture(`itemWeapon${currentShip.shipCode[3]}`)
              partWeapon.setTexture(`partWeapon${currentShip.shipCode[3]}`)
              upgradeShip(currentShip)
            }

            gameObject.x = -100
            gameObject.y = -100
          })
        }
      }
    }

    let buttonBack = this.add.image(100, this.sys.canvas.height - 100, 'buttonBack')
    buttonBack.setInteractive({ cursor: 'pointer' })
    buttonBack.on('pointerover', () => buttonBack.setTexture('buttonBackHover'))
    buttonBack.on('pointerout', () => buttonBack.setTexture('buttonBack'))
    buttonBack.on('pointerdown', () => {
      this.sound.add('clickSound').play()
      this.scene.start('Game')})
  }

  update(): void {}
}
