
const OpenPunks = artifacts.require("OpenPunks");
const { expect } = require("chai");

contract("OpenPunks", (accounts) => {
  let contract;
  const owner = accounts[0];
  const notOwner = accounts[1];
  const name = "OpenPunks";
  const symbol = "OP";
  const cost = 0;
  const maxSupply = 249;
  const allowMintingOn = 0;
  const baseURI = "https://openpunks.com/tokens/";
  const notRevealedUri = "https://openpunks.com/tokens/not-revealed.json";

  before(async () => {
    contract = await OpenPunks.new(
      name,
      symbol,
      cost,
      maxSupply,
      allowMintingOn,
      baseURI,
      notRevealedUri,
      { from: owner }
    );
  });

  it("should allow the owner to mint a token", async () => {
    const result = await contract.mint(1, { from: owner, value: cost });
    expect(result.receipt.status).to.equal(true);
  });

  it("should not allow non-owners to mint a token", async () => {
    try {
      await contract.mint(1, { from: notOwner, value: cost });
    } catch (error) {
      expect(error.message).to.include("Only the contract owner can call this function");
    }
  });

  it("should not allow minting if the total supply exceeds the maximum supply", async () => {
    try {
      await contract.mint(maxSupply, { from: owner, value: cost });
    } catch (error) {
      expect(error.message).to.include("Minting would exceed the maximum total supply");
    }
  });
});
