const {
    time,
    loadFixture,
  } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
  const { expect } = require("chai");
  const web3 = require("web3");
  
  describe("ExchangeOffice", function () {
    async function exchangeOfficeFixture() {
      const [owner, otherAccount] = await ethers.getSigners();
  
      const ExchangeOffice = await ethers.getContractFactory("ExchangeOffice");
      const exchangeOffice = await ExchangeOffice.deploy();
  
      return { exchangeOffice, owner, otherAccount };
    }

    it("Should set the right owner", async function () {
        const { exchangeOffice, owner } = await loadFixture(exchangeOfficeFixture);

        expect(await exchangeOffice.owner()).to.equal(owner);
    });

    it("Should allow the owner to change token balances", async function () {
        const { exchangeOffice, owner } = await loadFixture(exchangeOfficeFixture);
        const amountOfTokens = 100;

        await exchangeOffice.refill(amountOfTokens, { from: owner });

        expect(await exchangeOffice.getAmountOfTokens()).to.equal(amountOfTokens);
    });

    it("Non-owners should not be allowed to change token balances", async function () {
        const { exchangeOffice, otherAccount } = await loadFixture(exchangeOfficeFixture);
        const amountOfTokens = 100;

        await expect(exchangeOffice.connect(otherAccount).refill(amountOfTokens)).to.be.revertedWith('Only the owner can refill.');
    });

    it("Should allow users to buy tokens", async function () {
        const { exchangeOffice, owner, otherAccount } = await loadFixture(exchangeOfficeFixture);
        const baseAmountOfTokens = 100;
        const amountOfTokensToBuy = 50;
        const amountOfCoins = web3.utils.toWei("50", "ether");

        await exchangeOffice.refill(baseAmountOfTokens, { from: owner });
        await exchangeOffice.connect(otherAccount).buyTokens(amountOfTokensToBuy, { value: amountOfCoins });

        expect(await exchangeOffice.tokenBalances(otherAccount)).to.equal(amountOfTokensToBuy);
        expect(await exchangeOffice.getAmountOfTokens()).to.equal(baseAmountOfTokens - amountOfTokensToBuy);
    });

    it("Users should not be allowed to buy tokens unless they have enough money", async function () {
        const { exchangeOffice, owner, otherAccount } = await loadFixture(exchangeOfficeFixture);
        const baseAmountOfTokens = 100;
        const amountOfTokensToBuy = 50;
        const amountOfCoins = web3.utils.toWei("49", "ether");

        await exchangeOffice.refill(baseAmountOfTokens, { from: owner });

        await expect(exchangeOffice.connect(otherAccount).buyTokens(amountOfTokensToBuy, { value: amountOfCoins })).to.be.revertedWith('You must pay at least 1 ETH per token');
    });

    it("Users should not be allowed to buy more tokens than they have", async function () {
        const { exchangeOffice, owner, otherAccount } = await loadFixture(exchangeOfficeFixture);
        const baseAmountOfTokens = 100;
        const amountOfTokensToBuy = 101;
        const amountOfCoins = web3.utils.toWei("101", "ether");

        await exchangeOffice.refill(baseAmountOfTokens, { from: owner });

        await expect(exchangeOffice.connect(otherAccount).buyTokens(amountOfTokensToBuy, { value: amountOfCoins })).to.be.revertedWith('Not enough tokens in stock to complete this purchase');
    });

    it("Should allow users to sell tokens", async function () {
        const { exchangeOffice, owner, otherAccount } = await loadFixture(exchangeOfficeFixture);
        const baseAmountOfTokens = 100;
        const amountOfTokensToBuy = 50;
        const amountOfTokensToSell = 30;
        const amountOfCoinsToBuy = web3.utils.toWei("50", "ether");

        await exchangeOffice.refill(baseAmountOfTokens, { from: owner });
        await exchangeOffice.connect(otherAccount).buyTokens(amountOfTokensToBuy, { value: amountOfCoinsToBuy });
        await exchangeOffice.connect(otherAccount).sellTokens(amountOfTokensToSell);

        expect(await exchangeOffice.tokenBalances(otherAccount)).to.equal(amountOfTokensToBuy - amountOfTokensToSell);
        expect(await exchangeOffice.getAmountOfTokens()).to.equal(baseAmountOfTokens - (amountOfTokensToBuy - amountOfTokensToSell));
    });

    it("Users should not be allowed to sell more tokens than they have", async function () {
        const { exchangeOffice, owner, otherAccount } = await loadFixture(exchangeOfficeFixture);
        const baseAmountOfTokens = 100;
        const amountOfTokensToBuy = 50;
        const amountOfTokensToSell = 51;
        const amountOfCoinsToBuy = web3.utils.toWei("50", "ether");

        await exchangeOffice.refill(baseAmountOfTokens, { from: owner });
        await exchangeOffice.connect(otherAccount).buyTokens(amountOfTokensToBuy, { value: amountOfCoinsToBuy });

        await expect(exchangeOffice.connect(otherAccount).sellTokens(amountOfTokensToSell)).to.be.revertedWith('Not enough tokens in stock to complete this purchase');
    });
  });
  