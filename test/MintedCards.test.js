const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ElementalCard", function () {
  let ElementalCard;
  let elementalCard;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    ElementalCard = await ethers.getContractFactory("ElementalCard");
    elementalCard = await ElementalCard.deploy();
  });

  describe("Minting", function () {
    it("Should mint a new card", async function () {
      await elementalCard.mintCard("Fire", 50, 50, "Flame Thrower", 3);
      expect(await elementalCard.balanceOf(owner.address, 0)).to.equal(1);
    });

    it("Should mint multiple cards of the same type", async function () {
      await elementalCard.mintBatch(
        owner.address,
        [0], // tokenIds
        [5],  // amounts
        "0x"  // data
      );
      expect(await elementalCard.balanceOf(owner.address, 0)).to.equal(5);
    });
  });

  describe("Starter Pack", function () {
    it("Should claim starter pack once", async function () {
      await elementalCard.connect(addr1).claimStarterPack();
      expect(await elementalCard.hasClaimedStarterPack(addr1.address)).to.be.true;
    });

    it("Should not allow claiming starter pack twice", async function () {
      await elementalCard.connect(addr1).claimStarterPack();
      await expect(
        elementalCard.connect(addr1).claimStarterPack()
      ).to.be.revertedWith("Starter pack already claimed");
    });
  });

  describe("Card Attributes", function () {
    it("Should return correct card attributes", async function () {
      await elementalCard.mintCard("Water", 60, 40, "Hydro Pump", 4);
      const attributes = await elementalCard.getCardAttributes(0);
      expect(attributes.element).to.equal("Water");
      expect(attributes.power).to.equal(60);
      expect(attributes.defense).to.equal(40);
      expect(attributes.special).to.equal("Hydro Pump");
      expect(attributes.rarity).to.equal(4);
    });
  });
});