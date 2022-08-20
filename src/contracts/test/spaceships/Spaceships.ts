import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { artifacts, ethers, waffle } from "hardhat";
import type { Artifact } from "hardhat/types";

import type { SpaceShips } from "../../src/types/contracts/SpaceShips";
import { Signers } from "../types";
import { shouldBehaveLikeSpaceShips } from "./SpaceShips.behavior";

describe("Unit tests", function () {
  before(async function () {
    this.signers = {} as Signers;

    const signers: SignerWithAddress[] = await ethers.getSigners();
    this.signers.admin = signers[0];
    this.signers.alice = signers[1];
    this.signers.bob = signers[2];

  });

  describe("SpaceShips", function () {
    beforeEach(async function () {
      const spaceshipsArtifact: Artifact = await artifacts.readArtifact("SpaceShips");
      this.spaceships = <SpaceShips>await waffle.deployContract(this.signers.admin, spaceshipsArtifact, ['Spaceship', 'WARALPHA']);
    });

    shouldBehaveLikeSpaceShips();
  });
});
