module.exports = {
  // default applies to all enviroments
  default: {
    // rpc to deploy the contracts
    deployment: {
      protocol: 'http',
      host: "localhost",
      port: 8545,
      type: "rpc"
    },
    // order of connections the dapp should connect to
    dappConnection: [
      "$WEB3",  // uses pre existing web3 object if available (e.g in Mist)
      "ws://localhost:8546",
      "http://localhost:8545"
    ],
    gas: "auto",
    contracts: {
      DTwitter: {
        args: [ ]
      }
    },
    gasLimit: 9000000
  },
  testnet: {
    deployment:{
      accounts: [
        {
          "mnemonic": "wave pigeon sustain sock boring monitor left sight hedgehog weapon champion session",
          "addressIndex": "0", // Optional. The index to start getting the address
          "numAddresses": "2", // Optional. The number of addresses to get
          "hdpath": "m/44'/60'/0'/0/" // Optional. HD derivation path
        }
      ],
      host: "rinkeby.infura.io/nmY8WtT4QfEwz2S7wTbl",
      port: false,
      protocol: 'https',
      type: "rpc"
    }
  }
}
