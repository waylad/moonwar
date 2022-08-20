// import { task } from "@nomiclabs/hardhat-ethers/signers";
import { task } from "hardhat/config";
import { TaskArguments } from "hardhat/types";

import { SpaceShips__factory } from "../../src/types/factories/contracts/SpaceShips__factory";
import { SpaceShips } from "../../src/types/contracts/SpaceShips";

task("deploy:SpaceShips")
  // .addParam("greeting", "Say hello, be nice")
  .setAction(async function (taskArguments: TaskArguments, { ethers }) {
    // const signers: SignerWithAddress[] = await ethers.getSigners();
    const spaceShipsFactory: SpaceShips__factory = <SpaceShips__factory>await ethers.getContractFactory("SpaceShips");
    const spaceShips: SpaceShips = <SpaceShips>await spaceShipsFactory.deploy('SpaceShips', 'SpaceShips');//, { from: signers[0].address });
    await spaceShips.deployed();
    console.log("SpaceShips deployed to: ", spaceShips.address);
  });
