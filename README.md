## MOONWAR

### Demo Video: https://youtu.be/n9K53hpc2qs

### Demo: https://moonwar.io

MOONWAR is a space shooter game on Moonbeam. MOONWAR has upgradable NFT spaceships and a built-in DSL for you to create your own adventures! Let's first look into the game itself then the DSL.

## About the game

MOONWAR is a fully working game available at https://moonwar.io
![](https://moonwar.io/assets/screenshots/level-1.png)

You play the game with your NFT spaceship. Mint a basic ship to start with. Access the game and fight enemy ships. Harvest their parts. Upgrade your ship. Then sell your upgraded NFT ship.
![](https://moonwar.io/assets/screenshots/present-model.png)

We have created an NFT collection of 256 unique spaceships made of a combination of 4 different cabins, 4 wings, 4 engines, and 4 weapons.
![](https://moonwar.io/assets/screenshots/present-parts.png)
![](https://moonwar.io/assets/screenshots/present-possibilities.png)

Make sure you have installed Metamask and connected it to `Moonbase Alpha`, then click "Connect your Wallet".

You are now ready to play MOONWAR!
![](https://moonwar.io/assets/bg-home.png)

Once your wallet is connected, the game will attempt to fetch all your spaceship NFTs from the smart contract. If you do not yet have an spaceship NFT, click "Mint New Ship" and Metamask will open to trigger the mint. You will receive a basic ship with entry-level weapons, wings, engine, and cabin. The ship will appear in your list of ships (if not refresh the page). Select that ship to access the game.
![](https://moonwar.io/assets/screenshots/select-ship-2.png)

You will see a little story at the beginning of every level with multiple choices. Depending on your response, this will display additional stories and/or trigger some effect. Effects can impact your health, thrust and weapon power, or those of your enemy. After the story, you will confront the enemy of the level.

The game is built with PhaserJS, a 2D Javascript game engine that allows you to pilot the ship and fire at enemies. Use the directional arrows to move the ship and press the space bar to fire. Try to kill the enemy ship, but be careful not to get hit. You have 30 health points then it's game over. Enemies have various health points depending on their level and your responses in the stories. When the enemy is destroyed, it drops some loot. Move your ship over it to get it into your inventory.
![](https://moonwar.io/assets/screenshots/level-2.png)

Then open your inventory to see all the parts you have found. Drag and drop a ship part to its corresponding area on your ship to upgrade that part. An Moonbeam transaction opens that will actually modify your NFT metadata and image on-chain with the new part. [You can view the transaction on MoonScan](https://moonbase.moonscan.io/).
![](https://moonwar.io/assets/screenshots/inventory.png)

Each part are more or less powerful. Some engines make you faster, some weapons deal more damages, and so on.

Finally, once you have destroyed the enemy, you can move to the next area. Click the star icon to open the galaxy map. You can fly your ship to the stars in range. Click the one you want to move to and be ready to fight an harder enemy.
![](https://moonwar.io/assets/screenshots/map.png)

Move from one star to another until you reach the boss of the game, an insanely powerful ship with devastating weapons.
![](https://moonwar.io/assets/screenshots/level-4.png)

If you defeat the boss, you win MOONWAR!

## About the DSL (Domain Specific Language)

MOONWAR is not only a game, it's a metaverse! Players can generate their own adventures by editing the configuration file `dsl.json` which lists the whole configuration of the game and levels. You can create your own galaxy and advantures! Everything you see in the game is configurable.

JSON files are part of the `exchange languages` category of DSLs.

Here is the DSL model of a level:

```json
{
  "id": 1, // [!int] Unique ID of the level
  "starX": 1200, // [!int] X coordinate of the star on the map
  "starY": 150, // [!int] Y coordinate of the star on the map
  "background": "bg8", // [!string] Background image of the level. Can be one of "bg1", "bg2", "bg3", "bg4", "bg5", "bg6", "bg7", "bg8", "bg9", "bg10"
  "enemyShipCode": "0001", // [!string] Features code the enemy ship. First digit is the CABIN code between 0 and 3. Second digit is ENGINE code between 0 and 3. Third digit is WINGS code between 0 and 3. Fourth digit is WEAPONS code between 0 and 3.
  "enemySpeed": 100, // [!int] Thrusters speed of the enemy
  "enemyRateOfFire": 1, // [!int] Weapons rate of fire of the enemy
  "enemyHealth": 2, // [!int] Health points of the enemy
  "story": {
    // [!story] Story to show the player when arriving at this level. A story has a statement, an effect and optional responses. Each response can itself contain a story with a statement, an effect and optional responses, and so on in recursive maner.
    "statement": "Want more health points ?", // [!string] Statement of the first story
    "effect": {
      // [?effet] Effect of the story, before choosing a response.
      "addToPlayerHealth": 0, // [?int] Add or remove health points from the player
      "addToEnemyHealth": 0, // [?int] Add or remove health points from the enemy
      "addToPlayerThrust": 0, // [?int] Add or remove engine thrust points from the player
      "addToEnemyThrust": 0, // [?int] Add or remove engine thrust points from the enemy
      "addToPlayerWeaponPower": 0, // [?int] Add or remove weapon power points from the player
      "addToEnemyWeaponPower": 0 // [?int] Add or remove weapon power points from the enemy
    },
    // This second story offers responses, which will trigger a third story.
    "responses": [
      // [?responses[]] Available responses for the player to choose for this first story
      {
        "response": "Yes, I want health points", // [!string] First available response to first story
        "story": {
          // [!story] This response triggers a new story
          "statement": "You gain 3 health points.", // [!string] Statement of the second story
          "effect": {
            // [?effet] Effect of this second story, before choosing a potential response.
            "addToPlayerHealth": 3 // [?int] Add 3 health points to the player
          },
          "responses": [] // [?responses[]] Available responses for the player to choose for the second story. Here, no response are available. End of stories.
        }
      },
      {
        "response": "No thanks, I'm fine", // [!string] Second available response to first story
        "story": {
          // [?story] This response triggers a new story
          "statement": "Ok fine, what about damaging the enemy?",
          "effect": {}, // No effect yet
          // The second story offers responses, which will trigger a third story.
          "responses": [
            {
              "response": "Yes, kill him!", // [!string] First available response to second story
              "story": {
                "statement": "The enemy looses 2 health points.", // [!string] Statement of third story
                "effect": {
                  "addToEnemyHealth": -2 // // [!int] Remove 2 health points from enemy
                },
                "responses": [] // No response offered. End of stories.
              }
            },
            {
              "response": "No, I like a challenge", // [!string] Second available response to second story
              "story": {
                "statement": "Go on then!", // [!string] Statement of third story
                "effect": {}, // No effect
                "responses": [] // No response offered. End of stories.
              }
            }
          ]
        }
      }
    ]
  }
}
```

## How it's built

The GitHub repository is a mono-repo containing :

- The game, located in src/game, built with PhaserJS, a 2D javascript game engine. The DSL is available in `dsl.json` in the `metaverse` folder.

- The images and metadata generator for the NFTs, located in src/generator, a custom script that takes the 4 cabins, 4 wings, 4 engines, and 4 weapons and mixes them together to create the 256 combinations of JSON metadata and png files. Note that the script automatically uploads the images to IPFS using an infura gateway and generates the metadata with the IPFS links.

- The smart contracts for upgradable NFTs in src/contracts, which is a modified ERC721, created with OpenZepellin, Hardhat, and Typechain.

## What's next?

We want to create more spaceship parts and generate a collection of 10,000 unique ships then sell that collection in order to finance the development of the game to build more enemies, worlds, a multiplayer mode, some storytelling, improve the DSL, and so on...

## Any questions?

If you have any questions or need access to the source code on Github, please email me at waylad42@gmail.com
