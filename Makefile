.PHONY: submit-test submit-main

submit-test:
	npx hardhat run scripts/submit-erc20.js --network hardhat

submit-main:
	npx hardhat run scripts/submit-erc20.js --network mainnet
