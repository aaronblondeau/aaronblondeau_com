---
layout: blog_post.njk
tags: ['post', 'technology', 'hashgraph']
title: Hedera Smart Contracts - Part 2
teaser: I feel like I didn't do it right, but I got it to work!
cover: /assets/images/guess-it-1.jpg
date: 2022-04-23
---

I feel like I didn't do it right, but I got it to work!  As a developer this sure happens to me a lot.

In order to explore how smart contracts work on Hedera I wanted to make a simple guessing game:

- The smart contract contains a secret phrase.  You can call a function on the smart contract to guess what it is.
- Each guess costs 5 HBAR (you can send more if you want to show off)
- If you guess correctly you will receive all the HBAR collected so far.

The repo is here [https://github.com/aaronblondeau/guess-it](https://github.com/aaronblondeau/guess-it).

I have very limited knowledge of solidity or even smart contracts so this was all new territory for me.

Here is what I came up with for the contract:

```solidity
// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.11;
pragma experimental ABIEncoderV2;

// Compile with:
// npm install -g solc
// solcjs --bin GuessIt.sol
contract GuessIt {

    string private secretPhrase;
    address public owner;
    uint pot = 0;

    event GuessAtttempt(address indexed from, string guess, bool success, uint pot);

    constructor (string memory _phrase) {
        owner = msg.sender;
        secretPhrase = _phrase;
    }

    function setPhrase(string memory _phrase) public {
        // Only contract owner can update phrase
        require(msg.sender == owner);
        secretPhrase = _phrase;
    }

    function guessPhrase(string memory _guess) public payable returns (bool) {
        // Make sure caller has sent at least 5 HBAR
        require (msg.value >= 500000000, "insufficient payable");

        // Add funds to the pot (why doesn't this show in contract balance on dragonglass?)
        pot += msg.value;

        if (keccak256(abi.encodePacked((_guess))) != keccak256(abi.encodePacked((secretPhrase)))) {
            emit GuessAtttempt(msg.sender, _guess, false, pot);
            return false;
        }
        
        // Guess was correct, transfer pot to caller
        emit GuessAtttempt(msg.sender, _guess, true, pot);
        payable(msg.sender).transfer(pot);
        pot = 0;
        return true;
    }

    function contractVersion() public pure returns (uint) {
        return 9;
    }
}
```

Some of the key takeaways are:
- Since secretPhrase is marked private I am assuming that there isn't a way to extract it from the network. This very well could be an incorrect assumption.
- I needed the payable keyword on my function in order to allow callers to send funds.  Also had to wrap the sender with a payable function call to be able to send the reward.
- I kept track of the amount sent in the "pot" variable.  However, it is still unclear to me where the funds were actually stored.  The contract itself always showed a 0 balance even though payouts successfully occur.
- It took me quite some time to figure out how to get the return value of the function after calling it.  [Using the getRecord function finally did the trick.](https://github.com/aaronblondeau/guess-it/blob/master/makeGuess.js#L44)

One of my biggest questions from this exercise is how do you rapidly iterate while developing a smart contract? I debugged mine by sending the contract to the testnet over and over (sorry testnet).  Next I plan on figuring out how to unit test the contract as I think that will resolve the iteration issue and probably uncover some lovely bugs that I missed.



