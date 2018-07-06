const DTwitter = require('Embark/contracts/DTwitter');

config({
  contracts: {
    DTwitter: {
      // pass args here if needed
    }
  }
});

describe("DTwitter contract", function() {

  it("should create a user 'testusername'", async function() {

    const username = 'testusername';
    const description = 'test description';
    const { createAccount, users } = DTwitter.methods;

    const result = await createAccount(username, description).send();
    console.log('result returned from createAccount: ' + JSON.stringify(result));

    const user = await users(username);
    console.log('user returned from contract: ' + JSON.stringify(user));

    assert.equal(user.username, username);
    assert.equal(user.description, description);
  });

  it("should know 'testusername' exists", async function() {
    const exists = await DTwitter.methods.userExists('testusername').send();
    assert.equal(exists, true);
  });

});
