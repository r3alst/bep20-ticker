const {ChainId, Fetcher, Percent, currencyEquals, Token, JSBI, TokenAmount, Trade} = require("@pancakeswap/sdk");
const {baseCurrencies} = require("./tokens");
const FROM_TOKEN = process.env.FROM_TOKEN || "";
const TO_TOKEN = process.env.TO_TOKEN || "";
const AMOUNT_IN = process.env.AMOUNT_IN || "100";
const PAIR_NAME = process.env.PAIR_NAME || "";
const TICKER_MANAGER = process.env.TICKER_MANAGER || "http://localhost:8000";

const ZERO_PERCENT = new Percent('0')
const ONE_HUNDRED_PERCENT = new Percent('1')
const MAX_HOPS = 3

// used to ensure the user doesn't send so much BNB so they end up with <.01
const MIN_BNB = JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(16)) // .01 BNB
const BETTER_TRADE_LESS_HOPS_THRESHOLD = new Percent(JSBI.BigInt(50), JSBI.BigInt(10000))

const ethers = require("ethers");
const axios = require("axios");
const provider = new ethers.providers.JsonRpcProvider("https://bsc-dataseed.binance.org");

function isTradeBetter(tradeA, tradeB, minimumDelta) {
  if(!minimumDelta)
    minimumDelta = ZERO_PERCENT;

  if (tradeA && !tradeB) return false
  if (tradeB && !tradeA) return true
  if (!tradeA || !tradeB) return undefined

  if (
    tradeA.tradeType !== tradeB.tradeType ||
    !currencyEquals(tradeA.inputAmount.currency, tradeB.inputAmount.currency) ||
    !currencyEquals(tradeB.outputAmount.currency, tradeB.outputAmount.currency)
  ) {
    throw new Error('Trades are not comparable')
  }

  if (minimumDelta.equalTo(ZERO_PERCENT)) {
    return tradeA.executionPrice.lessThan(tradeB.executionPrice)
  }
  return tradeA.executionPrice.raw.multiply(minimumDelta.add(ONE_HUNDRED_PERCENT)).lessThan(tradeB.executionPrice)
}

const createPossibleBasePairs = () => {
  return baseCurrencies.map((base) => {
    return baseCurrencies.map((otherBase) => [base, otherBase])
  })
}

const getAllPossiblePairCombinations = async (currencyA, currencyB, provider) => {
  const basePairs = createPossibleBasePairs();
  const possiblePairs = [
    // the direct pair
    [currencyA, currencyB],
    // currency A against all bases
    ...baseCurrencies.map((base) => [currencyA, base]),
    // currency B against all bases
    ...baseCurrencies.map((base) => [currencyB, base]),
    // each base against all bases
    ...basePairs,
  ].filter((tokens) => Boolean(tokens[0] && tokens[1])) // Both Tokens Exists
   .filter(([t0, t1]) => t0.address !== t1.address); // Both are not equal

  const existingPairs = [];
  for(let i = 0; i < possiblePairs.length; i++) {
    try {
      const pair = await Fetcher.fetchPairData(possiblePairs[i][0], possiblePairs[i][1], provider);
      existingPairs.push(pair);
    } catch (e) {}
  }
  return existingPairs;
}

const findBestTrade = async (currencyAmountIn, currencyOut, provider) => {
  if(!provider)
    provider = require("@ethersproject/providers").BaseProvider;

  const allowedPairs = await getAllPossiblePairCombinations(currencyAmountIn.token, currencyOut, provider);
  if(!allowedPairs.length) return false;

  let bestTradeSoFar = null;
  for (let i = 1; i <= MAX_HOPS; i++) {
    const currentTrade =
      Trade.bestTradeExactIn(allowedPairs, currencyAmountIn, currencyOut, { maxHops: i, maxNumResults: 1 })[0] ??
      null
    // if current trade is best yet, save it
    if (isTradeBetter(bestTradeSoFar, currentTrade, BETTER_TRADE_LESS_HOPS_THRESHOLD)) {
      bestTradeSoFar = currentTrade
    }
  }
  return bestTradeSoFar
}

const fromToken = new Token(
  ChainId.MAINNET,
  FROM_TOKEN,
  18,
  "ERC20",
  "ERC20"
);

const toToken = new Token(
  ChainId.MAINNET,
  TO_TOKEN,
  18,
  "BEP20",
  "BEP20"
);

(async function() {

  const getRate = async (fromCurrency, toCurrency) => {
    const amountIn = new TokenAmount(fromCurrency, JSBI.BigInt(ethers.utils.parseUnits(AMOUNT_IN, 18).toString()) );
    const _amountIn = parseFloat(AMOUNT_IN);
    const bestTrade = await findBestTrade(amountIn, toCurrency, provider);
    if(bestTrade instanceof Trade) {
      return parseFloat(ethers.utils.formatUnits(bestTrade.outputAmount.raw.toString(), 18))/_amountIn;
    }
    return null;
  }

  const rateChecker = async function() {
    try {
      // Sending getRate
      const currentRate = await getRate(fromToken, toToken)
      if(currentRate) {
        axios({
          method: "POST",
          baseURL: TICKER_MANAGER,
          url: "/api/v1/ticker",
          data: {
            rate: currentRate,
            pair: PAIR_NAME
          }
        }).then(function(response) {
          setTimeout(rateChecker, 1000);
        });
      }
    } catch (e) {
      setTimeout(rateChecker, 1000);
    }
  }
  await rateChecker();

})()