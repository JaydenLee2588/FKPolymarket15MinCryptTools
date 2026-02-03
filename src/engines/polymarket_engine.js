import { ethers } from "ethers";
import { ClobClient, OrderType, Side, Chain } from "../clob_client/dist/index.js";
import { getContractConfig } from "../clob_client/dist/config.js";

// Minimal ABI for redeeming positions
const CTF_ABI = [
    "function redeemPositions(address collateralToken, bytes32 parentCollectionId, bytes32 conditionId, uint[] indexSets)"
];

const COLLATERAL_TOKENS = {
    137: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174", // USDC on Polygon
    80002: "0x9c4e1703476e875070ee25b56a58b008cfb8fa78" // USDC on Amoy
};

export class PolymarketEngine {
    constructor(privateKey, chainId = 80002) {
        this.chainId = chainId;
        this.provider = new ethers.JsonRpcProvider(process.env.RPC_URL || "https://rpc-amoy.polygon.technology"); 
        this.wallet = new ethers.Wallet(privateKey, this.provider);
        this.clobClient = new ClobClient(
            process.env.CLOB_API_URL || "https://clob.polymarket.com",
            this.chainId,
            this.wallet
        );
        this.contractConfig = getContractConfig(this.chainId);
    }

    async init() {
        // Any async initialization if needed
        console.log(`Initialized Polymarket Engine for address: ${this.wallet.address}`);
    }

    async buy(tokenId, amount, priceLimit = null) {
        // amount is in USDC for BUY? Or shares?
        // createMarketOrder: amount is in 'token' (USDC usually for buy?) 
        // Wait, for BUY side=BUY, amount is usually input amount (USDC).
        // For SELL side=SELL, amount is usually number of shares.
        // Let's check clob-client docs/examples.
        // example marketBuyOrder.ts: amount: 100 // $$$ -> USDC
        
        console.log(`Buying ${tokenId}, amount: ${amount} USDC`);
        
        try {
            const order = await this.clobClient.createMarketOrder({
                tokenID: tokenId,
                amount: amount,
                side: Side.BUY,
            });
            
            const resp = await this.clobClient.postOrder(order);
            return resp;
        } catch (error) {
            console.error("Buy error:", error);
            throw error;
        }
    }

    async sell(tokenId, amountShares) {
        console.log(`Selling ${tokenId}, shares: ${amountShares}`);
        
        try {
            const order = await this.clobClient.createMarketOrder({
                tokenID: tokenId,
                amount: amountShares,
                side: Side.SELL,
            });
            
            const resp = await this.clobClient.postOrder(order);
            return resp;
        } catch (error) {
            console.error("Sell error:", error);
            throw error;
        }
    }

    async redeem(conditionId) {
        console.log(`Redeeming positions for conditionId: ${conditionId}`);
        // Index sets for binary markets are usually [1, 2] corresponding to Yes and No?
        // Actually it's bitmask: 1 (binary 01) and 2 (binary 10).
        // For standard binary markets, we redeem both slots?
        // Or if we hold winning shares, we call redeemPositions.
        
        const ctf = new ethers.Contract(this.contractConfig.conditionalTokens, CTF_ABI, this.wallet);
        const collateralToken = COLLATERAL_TOKENS[this.chainId];
        const parentCollectionId = ethers.ZeroHash; // Bytes32(0)
        
        // binary market index sets: [1, 2]
        const indexSets = [1, 2];

        try {
            const tx = await ctf.redeemPositions(
                collateralToken,
                parentCollectionId,
                conditionId,
                indexSets
            );
            console.log("Redeem tx sent:", tx.hash);
            const receipt = await tx.wait();
            return receipt;
        } catch (error) {
            console.error("Redeem error:", error);
            throw error;
        }
    }
}
