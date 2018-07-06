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

    await createAccount(username, description).send();

    const user = await users(username);

    assert.equal(user.username, username);
    assert.equal(user.description, description);
  });

  it("should know 'testusername' exists", async function() {
    const exists = await DTwitter.methods.userExists('testusername').send();
    assert.equal(exists, true);
  });

});
