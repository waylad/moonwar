import { Drop } from '../../objects/drop'
import { state } from '../../state/state'
import { GameScene } from './gameScene'
import { getRandomItem } from './getRandomItem'

export const checkCollisions = ({ scene }: { scene: GameScene }) => {
  // check collision between enemys and ship's bullets
  if (scene.player && scene.enemy) {
    for (let bullet of scene.player.getBullets()) {
      if (
        bullet.getBody() &&
        scene.enemy.getBody() &&
        Phaser.Geom.Intersects.RectangleToRectangle(bullet.getBody(), scene.enemy.getBody())
      ) {
        bullet.setActive(false)

        // Sparks
        if (scene.collisionSparkEmitter0 && scene.collisionSparkEmitter1) {
          scene.collisionSparkEmitter0.active = true
          scene.collisionSparkEmitter0.setPosition(bullet.getBody().x, bullet.getBody().y)
          scene.collisionSparkEmitter0.explode(10, bullet.getBody().x, bullet.getBody().y)

          scene.collisionSparkEmitter1.active = true
          scene.collisionSparkEmitter1.setPosition(bullet.getBody().x, bullet.getBody().y)
          scene.collisionSparkEmitter1.explode(10, bullet.getBody().x, bullet.getBody().y)
        }

        damageEnemy(scene, 1)
      }
    }

    // check collision between ship and enemy's bullets
    for (let bullet of scene.enemy.getBullets()) {
      if (
        scene.player.getBody() &&
        bullet.getBody() &&
        Phaser.Geom.Intersects.RectangleToRectangle(bullet.getBody(), scene.player.getBody())
      ) {
        // Sparks
        if (scene.collisionSparkEmitter0 && scene.collisionSparkEmitter1) {
          scene.collisionSparkEmitter0.active = true
          scene.collisionSparkEmitter0.setPosition(bullet.getBody().x, bullet.getBody().y)
          scene.collisionSparkEmitter0.explode(10, bullet.getBody().x, bullet.getBody().y)

          scene.collisionSparkEmitter1.active = true
          scene.collisionSparkEmitter1.setPosition(bullet.getBody().x, bullet.getBody().y)
          scene.collisionSparkEmitter1.explode(10, bullet.getBody().x, bullet.getBody().y)
        }
        bullet.setActive(false)
        damagePlayer(scene, 1)
      }
    }

    // check collision between enemy and ship
    if (
      scene.enemy.getBody() &&
      scene.player.getBody() &&
      Phaser.Geom.Intersects.RectangleToRectangle(scene.enemy.getBody(), scene.player.getBody())
    ) {
      // scene.damagePlayer(1)
    }

    // check collision between droped item and ship
    for (let i = 0; i < scene.drops.length; i++) {
      if (
        scene.player.getBody() &&
        scene.drops[i].getBody() &&
        Phaser.Geom.Intersects.RectangleToRectangle(scene.drops[i].getBody(), scene.player.getBody())
      ) {
        state.inventory.push(scene.drops[i].texture.key)
        scene.drops[i].destroy()
        scene.drops.splice(i, 1)
      }
    }

    if (!scene.enemy.active) {
      scene.enemy.destroy()
      // scene.spawnEnemy()
    }
  }
}

const damageEnemy = (scene: GameScene, amount: number): void => {
  state.enemyHealth -= 1
  scene.enemyHealthBar?.update(state.enemyHealth)

  if (state.enemyHealth <= 0) {
    // Explosions
    const explosionConfig = {
      key: 'explosionAnim',
      frames: 'explosion',
      frameRate: 20,
      repeat: 0,
    }
    scene.anims.create(explosionConfig)
    scene.sound.add('explodeSound').play()
    const anim = scene.add.sprite(scene.enemy?.getBody().x, scene.enemy?.getBody().y, 'explosion')
    anim.setDepth(3)
    anim.play('explosionAnim', false)

    // Drop item
    scene.drops.push(
      new Drop({
        scene,
        x: scene.enemy?.getBody().x,
        y: scene.enemy?.getBody().y,
        texture: getRandomItem(),
      }),
    )

    scene.enemy?.setActive(false)
  }
}

const damagePlayer = (scene: GameScene, amount: number): void => {
  state.playerHealth -= 1
  scene.playerHealthBar?.update(state.playerHealth)

  if (state.playerHealth <= 0) {
    if (scene.enemy) scene.enemy.destroy()
    scene.drops.forEach((drop: Drop) => drop.destroy())
    scene.drops = []
    if (scene.player) scene.player.setActive(false)
    scene.scene.start('GameOver')
  }
}
