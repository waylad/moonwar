export const getRandomSpawnPostion = (aScreenSize: number): number => {
    let rndPos = Phaser.Math.RND.between(0, aScreenSize)

    while (rndPos > aScreenSize / 3 && rndPos < (aScreenSize * 2) / 3) {
      rndPos = Phaser.Math.RND.between(0, aScreenSize)
    }

    return rndPos
  }