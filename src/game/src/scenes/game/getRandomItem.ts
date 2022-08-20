export const getRandomItem = () => {
    const items = [
      'itemCabin1',
      'itemCabin2',
      'itemCabin3',
      'itemWeapon1',
      'itemWeapon2',
      'itemWeapon3',
      'itemWing1',
      'itemWing2',
      'itemWing3',
      'itemEngine1',
      'itemEngine2',
      'itemEngine3',
    ]
    const random = Phaser.Math.RND.between(0, items.length - 1)
    return items[random]
  }