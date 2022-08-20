import { Bullet } from './bullet'
import { state } from '../state/state'

export interface IShipConstructor {
  scene: Phaser.Scene
  x: number
  y: number
  shipCode: string
  frame?: string | number
}

export class Ship extends Phaser.GameObjects.Container {
  body: Phaser.Physics.Arcade.Body | Phaser.Physics.Arcade.StaticBody
  private velocity: Phaser.Math.Vector2
  private cursors: any
  private bullets: Bullet[]
  private shootKey: Phaser.Input.Keyboard.Key
  private isShooting: boolean
  private emitter: Phaser.GameObjects.Particles.ParticleEmitter
  private partWeapon: Phaser.GameObjects.Image
  private partWing: Phaser.GameObjects.Image
  private partEngine: Phaser.GameObjects.Image
  private partCabin: Phaser.GameObjects.Image
  private engineSound: Phaser.Sound.BaseSound
  private shipCode: string

  public getBullets(): Bullet[] {
    return this.bullets
  }

  public getBody(): any {
    return this.body
  }

  constructor(aParams: IShipConstructor) {
    super(aParams.scene, aParams.x, aParams.y)
    this.body = super.body as Phaser.Physics.Arcade.Body | Phaser.Physics.Arcade.StaticBody
    this.velocity = new Phaser.Math.Vector2(0, 0)
    this.shipCode = aParams.shipCode

    this.engineSound = this.scene.sound.add('engineSound')
    this.engineSound.play({ volume: 0, loop: true })

    // variables
    this.bullets = []
    this.isShooting = false

    // init ship
    this.initShip()
    this.setDepth(2)

    // input
    this.cursors = this.scene.input.keyboard.createCursorKeys()
    this.shootKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)

    // physics
    this.scene.physics.world.enable(this)
    // this.body.allowGravity = false
    this.body.setSize(state.shipSize * 2, state.shipSize * 2)
    this.body.setOffset(-state.shipSize, -state.shipSize)

    this.partCabin = new Phaser.GameObjects.Image(this.scene, 0, 0, `partCabin${aParams.shipCode[0]}`)
    this.partEngine = new Phaser.GameObjects.Image(this.scene, 0, 0, `partEngine${aParams.shipCode[1]}`)
    this.partWing = new Phaser.GameObjects.Image(this.scene, 0, 0, `partWing${aParams.shipCode[2]}`)
    this.partWeapon = new Phaser.GameObjects.Image(this.scene, 0, 0, `partWeapon${aParams.shipCode[3]}`)
    this.add([this.partWeapon, this.partWing, this.partEngine, this.partCabin])

    // boost particles
    const particles = this.scene.add.particles('particleBlue')
    this.emitter = particles.createEmitter({
      speed: 100,
      lifespan: {
        onEmit: () => {
          const speed = Math.sqrt(Math.pow(this.velocity.x, 2) + Math.pow(this.velocity.y, 2))
          return Phaser.Math.Percent(speed, 0, 5) * 2000
        },
      },
      alpha: {
        onEmit: () => {
          const speed = Math.sqrt(Math.pow(this.velocity.x, 2) + Math.pow(this.velocity.y, 2))
          return Phaser.Math.Percent(speed, 0, 5)
        },
      },
      angle: {
        onEmit: () => {
          var v = Phaser.Math.Between(-10, 10)
          return Phaser.Math.RadToDeg(this.rotation) + v
        },
      },
      scale: { start: 0.6, end: 0 },
      blendMode: 'ADD',
    })

    this.emitter.active = true
    particles.setDepth(1)

    this.scene.add.existing(this)
  }

  private initShip(): void {
    // define ship properties
    this.x = this.scene.sys.canvas.width / 2
    this.y = this.scene.sys.canvas.height / 2
    this.velocity = new Phaser.Math.Vector2(0, 0)
  }

  update(time: number, delta: number): void {
    if (this.active && !state.paused) {
      this.handleInput()
    }
    this.applyEffects(time)
    this.applyForces()
    this.checkIfOffScreen()
    this.updateBullets()
    this.emitter.startFollow(
      this,
      -state.shipSize * Math.sin(this.rotation + Math.PI / 2),
      state.shipSize * Math.cos(this.rotation + Math.PI / 2),
    )
  }

  private applyEffects(time: number): void {
    if (this.cursors.up.isDown || this.cursors.down.isDown) {
      this.partEngine.x = (time % 2) - 1
      this.partEngine.y = (time % 2) - 1
    }

    if (this.isShooting && this.partWeapon.y < 20) {
      this.partWeapon.x -= 2
    } else {
      this.partWeapon.x = 0
    }

    if (this.cursors.right.isDown || this.cursors.left.isDown) {
      if (this.cursors.right.isDown && this.partWing.angle > -6) this.partWing.angle -= 1
      if (this.cursors.left.isDown && this.partWing.angle < 6) this.partWing.angle += 1
    } else {
      if (this.partWing.angle > -6 && this.partWing.angle < 0) this.partWing.angle += 1
      if (this.partWing.angle < 6 && this.partWing.angle > 0) this.partWing.angle -= 1
    }

    const speed = Math.sqrt(Math.pow(this.velocity.x, 2) + Math.pow(this.velocity.y, 2))
    //@ts-ignore
    this.engineSound.volume = speed / 15
  }

  private handleInput(): void {
    if (this.cursors.up.isDown) {
      this.boost()
    }

    if (this.cursors.right.isDown) {
      this.rotation += 0.05
    } else if (this.cursors.left.isDown) {
      this.rotation -= 0.05
    }

    if (this.shootKey.isDown && !this.isShooting) {
      this.shoot()
      this.recoil()
      this.isShooting = true
    }

    if (this.shootKey.isUp) {
      this.isShooting = false
    }
  }

  private boost(): void {
    // create the force in the correct direction
    let force = new Phaser.Math.Vector2(Math.cos(this.rotation), Math.sin(this.rotation))

    // reduce the force and apply it to the velocity
    force.scale(0.3)
    this.velocity.add(force)
  }

  private applyForces(): void {
    // apple velocity to position
    this.x += this.velocity.x
    this.y += this.velocity.y

    // reduce the velocity
    this.velocity.scale(0.98)
  }

  private checkIfOffScreen(): void {
    // horizontal check
    if (this.x > this.scene.sys.canvas.width) {
      this.x = 0
    } else if (this.x < 0) {
      this.x = this.scene.sys.canvas.width
    }

    // vertical check
    if (this.y > this.scene.sys.canvas.height) {
      this.y = 0
    } else if (this.y < 0) {
      this.y = this.scene.sys.canvas.height
    }
  }

  private shoot(): void {
    this.scene.sound.add('shootSound').play()

    let bulletPosition = 25
    if (this.shipCode[3] === '1') bulletPosition = 60
    if (this.shipCode[3] === '2') bulletPosition = 55
    if (this.shipCode[3] === '3') bulletPosition = 50

    this.bullets.push(
      new Bullet({
        scene: this.scene,
        x: this.x + bulletPosition * Math.cos(this.rotation + Math.PI / 2),
        y: this.y + bulletPosition * Math.sin(this.rotation + Math.PI / 2),
        rotation: this.rotation + Math.PI / 2,
        texture: 'bullet',
      }),
      new Bullet({
        scene: this.scene,
        x: this.x - bulletPosition * Math.cos(this.rotation + Math.PI / 2),
        y: this.y - bulletPosition * Math.sin(this.rotation + Math.PI / 2),
        rotation: this.rotation + Math.PI / 2,
        texture: 'bullet',
      }),
    )
    if (this.shipCode[3] === '3') {
      this.bullets.push(
        new Bullet({
          scene: this.scene,
          x: this.x + (bulletPosition + 15) * Math.cos(this.rotation + Math.PI / 2),
          y: this.y + (bulletPosition + 15) * Math.sin(this.rotation + Math.PI / 2),
          rotation: this.rotation + Math.PI / 2,
          texture: 'bullet',
        }),
        new Bullet({
          scene: this.scene,
          x: this.x - (bulletPosition + 15) * Math.cos(this.rotation + Math.PI / 2),
          y: this.y - (bulletPosition + 15) * Math.sin(this.rotation + Math.PI / 2),
          rotation: this.rotation + Math.PI / 2,
          texture: 'bullet',
        }),
      )
    }
  }

  private recoil(): void {
    // create the force in the correct direction
    let force = new Phaser.Math.Vector2(-Math.cos(this.rotation), -Math.sin(this.rotation))

    // reduce the force and apply it to the velocity
    force.scale(0.2)
    this.velocity.add(force)
  }

  private updateBullets(): void {
    for (let i = 0; i < this.bullets.length; i++) {
      if (this.bullets[i].active) {
        this.bullets[i].update()
      } else {
        this.bullets[i].destroy()
        this.bullets.splice(i, 1)
      }
    }
  }
}
