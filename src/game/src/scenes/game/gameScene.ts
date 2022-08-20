import { Enemy } from '../../objects/enemy'
import { Ship } from '../../objects/ship'
import { state } from '../../state/state'
import { Drop } from '../../objects/drop'
import { levels } from '../../dsl/dsl.json' assert { type: 'json' }
import { PlayerHealthBar } from '../../objects/playerHealthBar'
import { EnemyHealthBar } from '../../objects/enemyHealthBar'
import { Level } from 'state/stateTypes'
import { getRandomSpawnPostion } from './getRandomSpawnPostion'
import { GameButtons } from './gameButtons'
import { checkCollisions } from './checkCollisions'

export class GameScene extends Phaser.Scene {
  public player: Ship | null
  public enemy: Enemy | null
  public collisionSparkEmitter0: Phaser.GameObjects.Particles.ParticleEmitter | null
  public collisionSparkEmitter1: Phaser.GameObjects.Particles.ParticleEmitter | null
  public drops: Drop[]
  public playerHealthBar: PlayerHealthBar | null
  public enemyHealthBar: EnemyHealthBar | null

  constructor() {
    super({
      key: 'Game',
    })
    this.player = null
    this.enemy = null
    this.collisionSparkEmitter0 = null
    this.collisionSparkEmitter1 = null
    this.drops = []
    this.playerHealthBar = null
    this.enemyHealthBar = null
  }

  private preload(): void {}

  private create(): void {
    const currentLevel: Level = levels[state.currentLevelIndex] as Level
    state.playerHealth = state.playerStartingHealth
    state.enemyHealth = currentLevel.enemyHealth

    this.cameras.main.setRoundPixels(true)

    this.player = new Ship({
      scene: this,
      x: this.sys.canvas.width / 2,
      y: this.sys.canvas.height / 2,
      shipCode: state.currentShip ? state.currentShip.shipCode : '0000',
    })

    this.enemy = new Enemy({
      scene: this,
      x: getRandomSpawnPostion(this.sys.canvas.width),
      y: getRandomSpawnPostion(this.sys.canvas.height),
      enemyShipCode: currentLevel.enemyShipCode,
      enemySpeed: currentLevel.enemySpeed,
      enemyRateOfFire: currentLevel.enemyRateOfFire,
      player: this.player,
    })

    const bg = this.add.tileSprite(
      this.sys.canvas.width / 2,
      this.sys.canvas.height / 2,
      this.sys.canvas.width,
      this.sys.canvas.height,
      levels[state.currentLevelIndex].background,
    )
    bg.setDepth(-1)

    // Sparks
    this.collisionSparkEmitter0 = this.add.particles('spark0').createEmitter({
      x: 400,
      y: 300,
      speed: { min: -800, max: 800 },
      angle: { min: 0, max: 360 },
      scale: { start: 0.5, end: 0 },
      blendMode: 'SCREEN',
      active: false,
      lifespan: 600,
      gravityY: 800,
    })

    this.collisionSparkEmitter1 = this.add.particles('spark1').createEmitter({
      x: 400,
      y: 300,
      speed: { min: -800, max: 800 },
      angle: { min: 0, max: 360 },
      scale: { start: 0.3, end: 0 },
      blendMode: 'SCREEN',
      active: false,
      lifespan: 300,
      gravityY: 800,
    })

    new GameButtons({ scene: this })
    this.playerHealthBar = new PlayerHealthBar({ scene: this, health: state.playerHealth })
    this.enemyHealthBar = new EnemyHealthBar({ scene: this, health: state.enemyHealth })

    state.paused = true
    console.log('Launch Dialog')
    //this.scene.launch('Dialog')
    this.scene.run('Dialog');

  }

  public update(time: number, delta: number): void {
    if (this.player) this.player.update(time, delta)
    if (this.enemy) this.enemy.update()

    checkCollisions({ scene: this })
  }
}
