
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';

const connection = new Connection(
  process.env.SOLANA_RPC_URL || clusterApiUrl('mainnet-beta')
);

export interface SolanaTokenInfo {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  supply: number;
  logoURI?: string;
}

export async function validateSolanaAddress(address: string): Promise<boolean> {
  try {
    const publicKey = new PublicKey(address);
    return PublicKey.isOnCurve(publicKey);
  } catch {
    return false;
  }
}

export async function getSolanaTokenInfo(address: string): Promise<SolanaTokenInfo | null> {
  try {
    if (!await validateSolanaAddress(address)) {
      return null;
    }

    // Here you would typically call a token metadata service like:
    // - Solana Labs Token List
    // - Jupiter API
    // - Metaplex Token Metadata
    
    // For now, we'll return a placeholder structure
    // In production, integrate with actual Solana token metadata services
    
    const response = await fetch(`https://api.solscan.io/token/meta?token=${address}`);
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    
    return {
      address,
      symbol: data.symbol || 'UNKNOWN',
      name: data.name || 'Unknown Token',
      decimals: data.decimals || 9,
      supply: data.supply || 0,
      logoURI: data.icon,
    };
  } catch (error) {
    console.error('Error fetching Solana token info:', error);
    return null;
  }
}

export async function getSolanaTokenPrice(address: string): Promise<number | null> {
  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/token_price/solana?contract_addresses=${address}&vs_currencies=usd`
    );
    
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    return data[address]?.usd || null;
  } catch (error) {
    console.error('Error fetching Solana token price:', error);
    return null;
  }
}