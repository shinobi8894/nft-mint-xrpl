const { Client, Wallet, convertStringToHex } = require('xrpl');

async function mintNFT(index) {
  // Connect to the XRPL Mainnet
  const xrplClient = new Client('wss://s1.ripple.com');
  await xrplClient.connect();
  if (index === 2223) {
    return console.log('Mint Ended');
  }
  try {

    const issuerWallet = Wallet.fromSeed('sn6kaC7eCAFfp9qX3PLndrq3EU2k8', {
      masterAddress: "r9FA7ujRpQyKEkbFG4LznukQHVWmSUJ9t9"
    });
    // Get the issuer account's address
    const issuerAddress = issuerWallet.address;

    // Build the transaction

    const metadataURI = 'ipfs://bafybeiauojqkucr2ko5dehsz7pu3ayttaqybkfgmgowmk445sirknpnhte/' + (index) + '.json';

    const transactionBlob = {
      TransactionType: "NFTokenMint",
      Account: issuerAddress,
      TransferFee: 10000,
      NFTokenTaxon: 0,
      Flags: 9,
      URI: convertStringToHex(metadataURI),
    };

    console.log(issuerAddress);
    console.log("Minting " + index + " NFT");

    // Sign the transaction with the issuer account's secret
    const signedTx = await xrplClient.submitAndWait(transactionBlob, {
      wallet: issuerWallet
    });

    console.log(index + ' NFT minted successfully!');
    console.log("Transaction hash : " + signedTx.result.hash);

    await mintNFT(index + 1);
  } catch (error) {
    console.error('Error minting NFT:', error);
  } finally {
    xrplClient.disconnect();
  }
}

mintNFT(2222);