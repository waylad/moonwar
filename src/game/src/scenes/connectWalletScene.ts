import { connectWallet, getShips } from '../blockchain/lib'
import { state } from '../state/state'

export class ConnectWalletScene extends Phaser.Scene {
  private buttonConnectWallet: Phaser.GameObjects.Image | null
  private showLoading: boolean
  private showingLoading: boolean

  constructor() {
    super({
      key: 'ConnectWallet',
    })
    this.buttonConnectWallet = null
    this.showLoading = false
    this.showingLoading = false
  }

  init(): void {}

  preload(): void {}

  create(): void {
    this.showLoading = false
    this.showingLoading = false

    const bg = this.add.image(
      this.sys.canvas.width / 2,
      this.sys.canvas.height / 2,
      'bgHome',
    ).setScale(0.5)

    this.buttonConnectWallet = this.add.image(
      this.sys.canvas.width / 2,
      this.sys.canvas.height / 2 + 300,
      'buttonConnectWallet',
    )
    this.buttonConnectWallet.setSize(this.buttonConnectWallet.width, this.buttonConnectWallet.height)
    this.buttonConnectWallet.setInteractive({ cursor: 'pointer' })
    this.buttonConnectWallet.on(
      'pointerover',
      () => !this.showingLoading && this.buttonConnectWallet && this.buttonConnectWallet.setTexture('buttonConnectWalletHover'),
    )
    this.buttonConnectWallet.on(
      'pointerout',
      () => !this.showingLoading && this.buttonConnectWallet && this.buttonConnectWallet.setTexture('buttonConnectWallet'),
    )
    this.buttonConnectWallet.on('pointerdown', async () => {
      this.sound.add('clickSound').play()
      this.showLoading = true
      await connectWallet()
      await getShips()
      this.scene.start('SelectShip')
    })

    this.sound.add('backgroundMusic').play({ loop: true })
  }

  update(): void {
    if (this.showLoading && !this.showingLoading &&  this.buttonConnectWallet) {
      this.showingLoading = true
      this.buttonConnectWallet.setTexture('buttonLoading')
    }
  }
}
