const express = require('express')
const { ethers, JsonRpcProvider } = require("ethers");
require('dotenv').config()
const contract = require("../artifacts/contracts/MyNFT.sol/MyNFT.json");

const app = express();
const port = 3000;

app.use(express.json());

const provider = new JsonRpcProvider(process.env.JSON_RPC_URL);

const privateKey = process.env.PRIVATE_KEY;
const signer = new ethers.Wallet(privateKey, provider);

const contractAddress = process.env.CONTRACT_ADDRESS;
const nftContract = new ethers.Contract(contractAddress, contract.abi, signer);

app.post('/mint', async (req, res) => {
    const {address, tokenURI} = req.body;

    if (!address || !tokenURI) {
        return res.status(400).send('Missing address or tokenURI');
    }

    try {
        const transaction = await nftContract.awardItem(address, tokenURI);
        await transaction.wait();

        res.json({
            success: true,
            transactionHash: transaction.hash,
            message: `Minted NFT successfully. Transaction hash: ${transaction.hash}`
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error minting NFT');
    }
});

app.listen(port, () => {
  console.log(`Minting app listening at http://localhost:${port}`);
});
