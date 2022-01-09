(async function() {
  const {Fetcher, Token, TokenAmount, Trade} = require("@pancakeswap/sdk");
  const {baseCurrencies} = require("./tokens");
  // Pancake Router
  const ROUTER = process.env.ROUTER || '0x10ED43C718714eb63d5aA57B78B54704E256024E';
  const SEED_PHRASE = process.env.SEED_PHRASE || "";
  const FROM_TOKEN = process.env.FROM_TOKEN || "";
  const TO_TOKEN = process.env.TO_TOKEN || "";
  const AMOUNT_IN = process.env.AMOUNT_IN || "100";
  const PAIR_NAME = process.env.PAIR_NAME || "";
  const TICKER_MANAGER = process.env.TICKER_MANAGER || "http://localhost:8000";
  const GAS_PRICE = 5; // 5 gwei

  const ethers = require("ethers");
  const provider = new ethers.providers.JsonRpcProvider("https://bsc-dataseed.binance.org");
  const wallet = new ethers.Wallet.fromMnemonic(SEED_PHRASE);
  const signer = wallet.connect(provider);

  const routerContract = new ethers.Contract(
    ROUTER,
    [
      'function getAmountsOut(uint amountIn, address[] calldata path) external view returns (uint[] memory amounts)',
      'function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)',
      'function swapExactTokensForETH(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)',
      'function swapETHForExactTokens(uint amountOut, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)',
      'function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)',
      'function swapExactTokensForTokensSupportingFeeOnTransferTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline)'
    ],
    signer
  );

  
})()