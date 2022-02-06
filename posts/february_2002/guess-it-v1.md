---
layout: blog_post.njk
tags: ['post', 'technology', 'hashgraph']
title: Hedera
teaser: I had never written a smart contract before.  Trying it out on Hedera was surprising!
cover: /assets/images/guess-it-1.jpg
date: 2022-02-05
---

I have missed the boat on blockchain.
I've never learned Ethereum or Bitcoin.
I've only dabbled with Solana and Stellar.
It's 2022 and it would be a better investment to focus on what comes after.
I think that may be hashgraph.

I have been following Hedera for the past few months and they just put out a few videos on how to build smart contracts:

[Part 1](https://www.youtube.com/watch?v=L9Tm6yn_ayY), 
[Part 2](https://www.youtube.com/watch?v=QK7FfeNHMSQ)

Part 2 was very interesting to me because the contract that Ed creates has functions to [mint and transfer](https://github.com/ed-marquez/hedera-example-contract-mint-associate-transfer-hts/blob/main/MintAssociateTransferHTS.sol#L33) a custom token.
Can anyone in the world call the contract to mint tokens and transfer tokens to themselves?

To answer this I had to find out how smart contracts work.
I came up with an idea to build a simple guessing game.
It will be a smart contract that allows you to make attempts at guessing a secret passphrase.
Each guess will cost a certain amount of tokens.
The first person to guess the passphrase gets all the tokens.

I have no idea if all of that is possible:
1) Can a passphrase be kept secret in the contract?
2) Can I write a function that allows guess attempts?
3) Can a smart contract charge and collect a pot of funds from guess attempts?
4) Can the smart contract distribute funds to a winner?

I decided to tackle the first two questions with the first version of my code : [https://github.com/aaronblondeau/guess-it](https://github.com/aaronblondeau/guess-it)

### 1. Can a passphrase be kept secret in the contract?

After some research I decided to only viable options I have for keeping the passphrase secret is to give it private access.

```
string private secretPhrase;
```

I did not provide a getter for the phrase.  I could not find a way to otherwise retrieve the internal private [state of a contract](https://docs.hedera.com/guides/docs/sdks/smart-contracts/get-smart-contract-info) on Hedera.  I know that the contract state lives in memory on a machine somewhere so it may be discoverable.  Marking question #1 as a maybe.

### 2. Can I write a function that allows guess attempts?

Having never used Solidity before, I ran into some surprises on this question.
My first attempt looked like this:

```
function guessPhrase(string memory _guess) public view returns (bool) {
    return _guess == secretPhrase;
}
```

I promptly got red squiggly lines under the ==.  *There is no built-in way to compare two strings in solidity!*

Try two looked like this.  I'll compare the guess with the stored secretPhrase using some fancy crypto and return a boolean:

```
function guessPhrase(string memory _guess) public view returns (bool) {
    return (keccak256(abi.encodePacked((_guess))) == keccak256(abi.encodePacked((secretPhrase))));
}
```

This would've been great - if only I could get that return value from where I invoke the contract.
Now, there is a way to ["Get"](https://docs.hedera.com/guides/docs/sdks/smart-contracts/call-a-smart-contract-function-1) a smart contract function.
But that only works if you are not changing the state of the contract.  For questions 3 and 4 above I will need to make changes.

My current iteration of the function looks like this.  Since the goal of the function is to indicate success or failure, returning an error is just as good.

```
function guessPhrase(string memory _guess) public view returns (bool) {
    require (keccak256(abi.encodePacked((_guess))) == keccak256(abi.encodePacked((secretPhrase))));
    return true;
}
```

This is how naive I am about smart contracts.  I thought you could simply push new code and update them.
*I may not be able to modify a smart contract's code - I may have to make a whole new contract for each update!*

This was a great discovery because it'll inform how I think about future projects.
It makes sense that you shouldn't be able to just change the code in a contract arbitrarily.
However, if you can't deploy new code to a contract, how do you think about maintaining code that is in a contract?
How do you roll out a new contract when one is needed?

Other interesting notes:
- If you do not provide an admin key you cannot even delete a contract.
- You can invoke a contract after deleting the file that it was created from.
- Updating the file for a contract does not update the contract.
