# Exchange office smart contract

Developing own version of currency exchange office based on [vending machine contract](https://ethereum.org/en/developers/docs/smart-contracts/)\
Functional requirements: at least one your token vs Ether, both directions
of exchange need to be supported)

## Contract description
**tokenBalances** - number of tokens on different accounts\
**owner** - the contract owner's address\
**refill** - the function allows users to increase the number of tokens available for buying. Available only for the owner\
**buyTokens** - the function allows users to buy tokens\
**sellTokens** - the function allows users to sell tokens\
**getAmountOfTokens** - the function allows users to get amount of tokens available for buying

## Testing the smart contract
1. Download this repository
2. Open "smart-contract" folder using VS Code
3. Launch "npm install" in order to install necessary dependencies
4. Launch "npx hardhat test" in order to test the smart contract

## Verification and deploy
The smart contract is deployed with address: **0xC7F63964eEDfE8deAc716e684abe3Eed5EB3e1b7**\
You can check it at [the link](https://sepolia.etherscan.io/address/0xC7F63964eEDfE8deAc716e684abe3Eed5EB3e1b7)
