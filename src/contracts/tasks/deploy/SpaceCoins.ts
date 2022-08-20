// import { task } from "@nomiclabs/hardhat-ethers/signers";
import { task } from "hardhat/config";
import { TaskArguments } from "hardhat/types";

import { SpaceCoins } from "../../src/types/contracts/SpaceCoins";
import { SpaceCoins__factory } from "../../src/types/factories/contracts/SpaceCoins__factory";

task("deploy:SpaceCoins")
  // .addParam("greeting", "Say hello, be nice")
  .setAction(async function (taskArguments: TaskArguments, { ethers }) {
    // const signers: SignerWithAddress[] = await ethers.getSigners();
    const spaceCoinsFactory: SpaceCoins__factory = <SpaceCoins__factory>await ethers.getContractFactory("SpaceCoins");
    const spaceCoins: SpaceCoins = <SpaceCoins>await spaceCoinsFactory.deploy();//, { from: signers[0].address });
    await spaceCoins.deployed();
    console.log("SpaceCoins deployed to: ", spaceCoins.address);
  });
