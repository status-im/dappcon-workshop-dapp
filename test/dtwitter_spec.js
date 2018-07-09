const DTwitter = require('Embark/contracts/DTwitter');
let accounts;

config({
  contracts: {
    DTwitter: {
      // pass args here if needed
    }
  }
}, (err, theAccounts) => {
  accounts = theAccounts;
});

const username = 'testusername';
const description = 'test description';
const tweetContent = 'test tweet';
const { createAccount, users, owners, userExists, editAccount, tweet } = DTwitter.methods;

let usernameHash;

describe("DTwitter contract", function() {

  it("should create a dtwitter account using the current address", async function() {

    // do the create account
    const result = await createAccount(username, description).send();

    // read from the owners mapping
    usernameHash = await owners(accounts[0]).call();

    // check the return value from owners mapping matches
    assert.equal(usernameHash, web3.utils.keccak256(username));

  });
  
  it("should have created a user 'testusername'", async function() {

    // get user details from contract
    const user = await users(usernameHash).call();

    assert.equal(user.username, username);
    assert.equal(user.description, description);
    
  });

  it("should know 'testusername' exists", async function() {
    const exists = await userExists(usernameHash).call();

    assert.equal(exists, true);
  });
  
  
  it("should be able to edit account", async function() {
    const updatedDescription = description + ' edited';
    const updatedImageHash = 'QmWvPtv2xVGgdV12cezG7iCQ4hQ52e4ptmFFnBK3gTjnec';
      
    await editAccount(usernameHash, updatedDescription, updatedImageHash).send();
    
    const updatedUserDetails = await users(usernameHash).call();
    
    assert.equal(updatedUserDetails.description, updatedDescription);
    assert.equal(updatedUserDetails.picture, updatedImageHash);
  });

  it("should be able to add a tweet and receive it via contract event", async function() {
    DTwitter.events.NewTweet({
      filter: {_from: usernameHash}, 
      fromBlock: 0
    })
    .on('data', (event) => {
      assert.equal(event.returnValues.tweet, tweetContent);
    });  

    await tweet(usernameHash, tweetContent).send();
  });

});
