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
const { createAccount, users, owners, userExists } = DTwitter.methods;

let usernameHash;

describe("DTwitter contract", function() {

  it("should create an owner for current account", async function() {

    // do the create account
    const result = await createAccount(username, description).send();

    // read from the owners mapping
    usernameHash = await owners(accounts[0]).call();

    // check the return value from owners mapping matches
    assert.equal(usernameHash, web3.utils.keccak256(username));

  });
  
  it("should create a user 'testusername'", async function() {

    // get user details from contract
    const user = await users(usernameHash).call();

    assert.equal(user.username, username);
    assert.equal(user.description, description);
    
  });

  it("should know 'testusername' exists", async function() {
    const exists = await userExists('testusername').call();

    assert.equal(exists, true);
  });

});
