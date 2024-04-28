// SPDX-License-Identifier: MIT

pragma solidity ^0.8.24;

// Exchange rate - 1 token vs 1 ETH
contract ExchangeOffice {
    mapping (address => uint256) public tokenBalances;
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    function refill(uint amount) public {
        require(msg.sender == owner, "Only the owner can refill.");
        tokenBalances[address(this)] += amount;
    }

    function buyTokens(uint256 amount) public payable {
        require(msg.value >= amount * 1 ether, "You must pay at least 1 ETH per token");
        require(tokenBalances[address(this)] >= amount, "Not enough tokens in stock to complete this purchase");

        uint256 leftover = msg.value - amount * 1 ether;
        tokenBalances[address(this)] -= amount;
        tokenBalances[msg.sender] += amount;

        payable(msg.sender).transfer(leftover);
    }

    function sellTokens(uint256 amount) public {
        require(tokenBalances[msg.sender] >= amount, "Not enough tokens in stock to complete this purchase");

        tokenBalances[address(this)] += amount;
        tokenBalances[msg.sender] -= amount;
        
        payable(msg.sender).transfer(amount);
    }

    function getAmountOfTokens() public view returns(uint256) {
        return tokenBalances[address(this)];
    }
}