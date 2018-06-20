import Web3 from 'web3';
import MetamaskInpageProvider from 'metamask-crx/app/scripts/lib/inpage-provider.js';
import PortStream from 'metamask-crx/app/scripts/lib/port-stream.js';

const addr = {};
// All on Ropsten
addr.erik = '0xbD2940e549C38Cc6b201767a0238c2C07820Ef35';
addr.patrik = '0xbcEf85708670FA0127C484Ac649724B8028Ea08b';
addr.jacob = '0xBF9e8395854cE02abB454d5131F45F2bFFB54017';

let web3;

export default class Donate {
  constructor() {
    console.log('in donate constructor');

    const METAMASK_EXTENSION_ID = 'nkbihfbeogaeaoehlefnkodbefgpgknn';
    // TODO: Change to browser.
    const metamaskPort = chrome.runtime.connect(METAMASK_EXTENSION_ID);
    const pluginStream = new PortStream(metamaskPort);
    const web3Provider = new MetamaskInpageProvider(pluginStream);
    web3 = new Web3(web3Provider);

    // We might want to use this for unit testing
    // web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

    console.log('web3:', web3);

    web3.eth.net.getId((err, netId) => {
      if (err) {
        throw 'Could not get network ID';
      }
      // Networks:
      // 1:  Mainnet
      // 2:  Deprecated Morden testnet
      // 3:  Ropsten testnet
      // 4:  Rinkeby testnet
      // 42: Kovan testnet
      if (netId !== 3) {
        // Abort if not connected to Ropsten (testnet)
        web3 = undefined;
        throw 'Not connected to Ropsten, connected to: ' + netId;
      }
      console.log('Connected to Ropsten');
    });

    console.log('Connected to web3');
  }

  _accountsPromise() {
    return Promise((resolve, reject) => {
      web3.eth.getAccounts((err, accounts) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(accounts);
        return;
      });
    });
  }

  donateAll() {
    // TODO: use the web3 initialized above
    // Async is required here
    // https://github.com/MetaMask/faq/blob/master/DEVELOPERS.md#dizzy-all-async---think-of-metamask-as-a-light-client
    this._myAcc(acc => {
      web3.eth.sendTransaction(
        {
          from: acc,
          to: addr.erik,
          value: 1e16,
          gas: 1e6,
        },
        (err, res) => {
          if (err) {
            throw err;
          }
          console.log('Sent money:', res);
        }
      );
    });
  }

  _myAcc(callback) {
    web3.eth.getAccounts((err, accounts) => {
      callback(accounts[0]);
    });
  }
}