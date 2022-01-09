const {ChainId, Token} = require("@pancakeswap/sdk");

const WBNB = new Token(
  ChainId.MAINNET,
  '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
  18,
  'WBNB',
  'Wrapped BNB',
  'https://www.binance.com/',
);
const CAKE = new Token(
  ChainId.MAINNET,
  '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82',
  18,
  'CAKE',
  'PancakeSwap Token',
  'https://pancakeswap.finance/',
);
const BUSD = new Token(
  ChainId.MAINNET,
  '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
  18,
  'BUSD',
  'Binance USD',
  'https://www.paxos.com/busd/',
);
const USDT = new Token(
  ChainId.MAINNET,
  '0x55d398326f99059fF775485246999027B3197955',
  18,
  'USDT',
  'Tether USD',
  'https://tether.to/',
);
const BTCB = new Token(
  ChainId.MAINNET,
  '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c',
  18,
  'BTCB',
  'Binance BTC',
  'https://bitcoin.org/',
);
const UST = new Token(
  ChainId.MAINNET,
  '0x23396cF899Ca06c4472205fC903bDB4de249D6fC',
  18,
  'UST',
  'Wrapped UST Token',
  'https://mirror.finance/',
);
const ETH = new Token(
  ChainId.MAINNET,
  '0x2170Ed0880ac9A755fd29B2688956BD959F933F8',
  18,
  'ETH',
  'Binance-Peg Ethereum Token',
  'https://ethereum.org/en/',
);
const USDC = new Token(
  ChainId.MAINNET,
  '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
  18,
  'USDC',
  'Binance-Peg USD Coin',
  'https://www.centre.io/usdc',
);

const baseCurrencies = [
  WBNB,
  CAKE,
  BUSD,
  USDT,
  BTCB,
  UST,
  ETH,
  USDC
];

module.exports = {
  WBNB,
  CAKE,
  BUSD,
  USDT,
  BTCB,
  UST,
  ETH,
  USDC,
  baseCurrencies
}