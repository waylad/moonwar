import { getShips, mintShip } from '../blockchain/lib'
import { state } from '../state/state'

export class SelectShipScene extends Phaser.Scene {
  private buttonMint: Phaser.GameObjects.Image | null
  private showLoading: boolean
  private showingLoading: boolean

  constructor() {
    super({
      key: 'SelectShip',
    })
    this.buttonMint = null
    this.showLoading = false
    this.showingLoading =false
  }

  init(): void {}

  preload(): void {}

  create(): void {
    this.showLoading = false
    this.showingLoading = false

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

    this.add.image(this.sys.canvas.width / 2, 100, 'titleSelectShip')

    for (let i = 0; i < 4; i++) {
      const bigCell = this.add.image(
        this.sys.canvas.width / 2 - 450 + i * 300,
        this.sys.canvas.height / 2 - 50,
        'bigCell',
      )
      const ship = state.ownedShips[i]

      if (ship && ship.shipCode) {
        const partCabin = this.add.image(0, 0, `partCabin${ship.shipCode[0]}`)
        const partEngine = this.add.image(0, 0, `partEngine${ship.shipCode[1]}`)
        const partWing = this.add.image(0, 0, `partWing${ship.shipCode[2]}`)
        const partWeapon = this.add.image(0, 0, `partWeapon${ship.shipCode[3]}`)
        let container = this.add.container(this.sys.canvas.width / 2 - 450 + i * 300, this.sys.canvas.height / 2 - 50, [
          partWeapon,
          partWing,
          partEngine,
          partCabin,
        ])
        container.setSize(bigCell.width, bigCell.height)
        container.setInteractive({ cursor: 'pointer' })

        container.on('pointerover', () => bigCell.setTexture('bigCellHover'))
        container.on('pointerout', () => bigCell.setTexture('bigCell'))

        container.on('pointerdown', () => {
          this.sound.add('clickSound').play()
          state.currentShip = ship
          console.log(ship)
          this.scene.start('Game')
        })
      }
    }

    this.buttonMint = this.add.image(this.sys.canvas.width / 2, this.sys.canvas.height / 2 + 200, 'buttonMint')
    this.buttonMint.setSize(this.buttonMint.width, this.buttonMint.height)
    this.buttonMint.setInteractive({ cursor: 'pointer' })

    this.buttonMint.on('pointerover', () => this.buttonMint && this.buttonMint.setTexture('buttonMintHover'))
    this.buttonMint.on('pointerout', () => this.buttonMint && this.buttonMint.setTexture('buttonMint'))

    this.buttonMint.on('pointerdown', async () => {
      this.sound.add('clickSound').play()
      this.showLoading = true
      await mintShip()
      await getShips()
      this.scene.restart()
      this.showLoading = false
    })

    let buttonBack = this.add.image(100, this.sys.canvas.height - 100, 'buttonBack')
    buttonBack.setInteractive({ cursor: 'pointer' })
    buttonBack.on('pointerover', () => buttonBack.setTexture('buttonBackHover'))
    buttonBack.on('pointerout', () => buttonBack.setTexture('buttonBack'))
    buttonBack.on('pointerdown', () => {
      this.sound.add('clickSound').play()
      this.scene.start('ConnectWallet')
    })
  }

  update(): void {
    if (this.showLoading && !this.showingLoading) {
      this.showingLoading = true
      if(this.buttonMint) this.buttonMint.setTexture('buttonLoading')
    }

    if (!this.showLoading && this.showingLoading) {
      this.showingLoading = false
      if(this.buttonMint) this.buttonMint.setTexture('buttonMint')
    }
  }
}
