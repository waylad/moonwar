import { state } from '../state/state'
import { Bullet } from './bullet'

export interface IEnemyConstructor {
  scene: Phaser.Scene;
  x: number;
  y: number;
  enemyShipCode: string;
  enemySpeed: number;
  enemyRateOfFire: number;
  frame?: string | number;
  player: Phaser.GameObjects.Container
}

export class Enemy extends Phaser.GameObjects.Container {
  body: Phaser.Physics.Arcade.Body | Phaser.Physics.Arcade.StaticBody
  private bullets: Bullet[]
  private emitter: Phaser.GameObjects.Particles.ParticleEmitter
  private shootCount: number
  private particles: Phaser.GameObjects.Particles.ParticleEmitterManager
  private enemyShipCode: string
  private enemySpeed: number
  private enemyRateOfFire: number
  private player: Phaser.GameObjects.Container

  public getBullets(): Bullet[] {
    return this.bullets
  }

  public getBody(): any {
    return this.body
  }

  constructor(aParams: IEnemyConstructor) {
    super(aParams.scene, aParams.x, aParams.y)
    this.body = super.body as Phaser.Physics.Arcade.Body | Phaser.Physics.Arcade.StaticBody

    this.enemyShipCode = aParams.enemyShipCode
    this.enemySpeed = aParams.enemySpeed
    this.enemyRateOfFire = aParams.enemyRateOfFire
    this.player = aParams.player

    // variables
    this.bullets = []
    this.shootCount = 0

    // init enemy
    this.initEnemy(aParams.x, aParams.y)
    this.setDepth(2)

    // physics
    this.scene.physics.world.enable(this)
    // this.body.allowGravity = false
    this.body.setSize(state.shipSize * 2, state.shipSize * 2)
    this.body.setOffset(-state.shipSize, -state.shipSize)

    const partCabin = new Phaser.GameObjects.Image(this.scene, 0, 0, `partCabin${aParams.enemyShipCode[0]}`)
    const partEngine = new Phaser.GameObjects.Image(this.scene, 0, 0, `partEngine${aParams.enemyShipCode[1]}`)
    const partWing = new Phaser.GameObjects.Image(this.scene, 0, 0, `partWing${aParams.enemyShipCode[2]}`)
    const partWeapon = new Phaser.GameObjects.Image(this.scene, 0, 0, `partWeapon${aParams.enemyShipCode[3]}`)
    this.add([partWeapon, partWing, partEngine, partCabin])

    // boost particles
    this.particles = this.scene.add.particles('particleRed')
    this.emitter = this.particles.createEmitter({
      speed: 10,
      lifespan: {
        onEmit: () => Phaser.Math.Percent(100, 0, 5) * 2000,
      },
      alpha: {
        onEmit: () => Phaser.Math.Percent(100, 0, 5),
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
    this.particles.setDepth(1)

    this.scene.add.existing(this)
  }

  private initEnemy(x: number, y: number): void {
    // define enemy properties
    this.x = x
    this.y = y
    // this.velocity = new Phaser.Math.Vector2(0, 0)
  }

  update(): void {
    if (this.active && !state.paused) {
      // // create the force in the correct direction
      // let force = new Phaser.Math.Vector2(Math.cos(this.rotation - Math.PI / 2), Math.sin(this.rotation - Math.PI / 2))
      // // reduce the force and apply it to the velocity
      // force.scale(0.2)
      // this.velocity.add(force)
      // // apply velocity to position
      // this.x += this.velocity.x
      // this.y += this.velocity.y
      // this.rotation += 0.01
      // // reduce the velocity
      // this.velocity.scale(0.98)

      // Shoot
      this.shootCount += 1
      if (this.shootCount % (60 / this.enemyRateOfFire) === 0) this.shoot()

      this.checkIfOffScreen()
      this.updateBullets()
      this.emitter.startFollow(
        this,
        -state.shipSize * Math.sin(this.rotation + Math.PI / 2),
        state.shipSize * Math.cos(this.rotation + Math.PI / 2),
      )

      // --- New targeting ---
      const targetAngle = Phaser.Math.Angle.Between(this.x, this.y, this.player.x, this.player.y)
      // clamp to -PI to PI for smarter turning
      let diff = Phaser.Math.Angle.Wrap(targetAngle - this.rotation)

      const turnDegreesPerFrame = this.enemySpeed / 100
      // set to targetAngle if less than turnDegreesPerFrame
      if (Math.abs(diff) < Phaser.Math.DegToRad(turnDegreesPerFrame)) {
        this.rotation = targetAngle
      } else {
        let angle = this.angle
        if (diff > 0) {
          // turn clockwise
          angle += turnDegreesPerFrame
        } else {
          // turn counter-clockwise
          angle -= turnDegreesPerFrame
        }

        this.setAngle(angle)
      }

      // move enemy in direction facing
      const vx = Math.cos(this.rotation) * this.enemySpeed
      const vy = Math.sin(this.rotation) * this.enemySpeed

      this.body.velocity.x = vx
      this.body.velocity.y = vy
    }
  }

  destroy(): void {
    this.bullets.forEach((bullet) => bullet.destroy())
    this.particles.destroy()
    super.destroy()
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
    // this.scene.sound.add('shootSound').play() // Anoying ^^

    let bulletPosition = 25
    if (this.enemyShipCode[3] === '1') bulletPosition = 60
    if (this.enemyShipCode[3] === '2') bulletPosition = 55
    if (this.enemyShipCode[3] === '3') bulletPosition = 50

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
    if (this.enemyShipCode[3] === '3') {
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
