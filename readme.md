# BEP20 Ticker

This repo includes docker compose configuration and bep20 image code. It can be used to set up a bep20 token container for price feeds.

## Development

Install dependencies:
```
yarn install 
```

Setup Environment:

1. create a file in root named as `env`
2. add following variables according your setup
```
export FROM_TOKEN="0x0b15Ddf19D47E6a86A56148fb4aFFFc6929BcB89"
export TO_TOKEN="0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56"
export AMOUNT_IN="500"
export PAIR_NAME="IDIABUSD"
export TICKER_MANAGER="http://localhost:8000"
```

**Hint:** `AMOUNT_IN` means how many units it will try to check rate, its required because pancake router increases/decrease rate according units you want to sell or buy.

## To use Docker build:

1. copy/rename `docker-compose.yml.example` as `docker-compose.yml`
2. change contract addresses according your tokens/pair and ticker manager url.
3. run ``docker-compose up -d``

**OPTIONAL:** Please support me by contributing to project or to following BSC/ERC/TRC address.
`0x200753090BC55A39Ff790150143D28635f0E87bb`