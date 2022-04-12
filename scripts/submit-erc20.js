const hre = require("hardhat");

async function main() {

  //MAINNET
  const [submitter] = await ethers.getSigners();

  //MAINNET Forking
  //await hre.network.provider.request({
    //method: "hardhat_impersonateAccount",
    //params: ["0x7AaD57c760A49E195340Dae0897f92c2d26b9582"],
  //});
  //const submitter = await ethers.getSigner("0x7AaD57c760A49E195340Dae0897f92c2d26b9582");

  const woxen = await ethers.getContractAt("IERC20Metadata", "0xd1e2d5085b39b80c9948aeb1b9aa83af6756bcc5", submitter);

  console.log("Submitter address: ", submitter.address);
  const balance = await woxen.balanceOf(submitter.address)
  console.log("Submitter erc20 balance: ", ethers.utils.formatUnits(balance.toString(), await woxen.decimals()).toString());
  const ethbalance = await ethers.provider.getBalance(submitter.address)
  console.log("Submitter eth balance: ", ethers.utils.formatUnits(ethbalance.toString(), "ether"));

  const _to = "0x7c8619B5e95BCBF42752d3f2fD297C2aFb4a3B80";
  const _value = ethers.BigNumber.from("19462000000000");
  const options = { nonce: 634, gasPrice: ethers.utils.parseUnits('80.0', 'gwei') };

  // populateTransaction does not send the transaction
  const unsenttx = await woxen.populateTransaction.transfer(_to, _value, options);

  // check that the unsent transaction data matches the original transaction
  if (unsenttx.data == "0xa9059cbb0000000000000000000000007c8619b5e95bcbf42752d3f2fd297c2afb4a3b80000000000000000000000000000000000000000000000000000011b35998bc00")
  {
    console.log("tx data matched!")
    // finally send the transaction
    const tx = await submitter.sendTransaction(unsenttx);
    console.log("Transaction: ", tx);

    console.log("Sanity Check: ", tx.data == "0xa9059cbb0000000000000000000000007c8619b5e95bcbf42752d3f2fd297c2afb4a3b80000000000000000000000000000000000000000000000000000011b35998bc00");
  }
  else 
  {
    console.log("tx data did not match source returned without sending")
  }

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
