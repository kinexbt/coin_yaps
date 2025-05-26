// lib/bsc.ts - BSC blockchain utilities
import Web3 from 'web3';

const web3 = new Web3(process.env.BSC_RPC_URL || 'https://bsc-dataseed.binance.org/');

export interface BSCTokenInfo {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  totalSupply: string;
}

// Standard ERC-20 ABI for basic token info
const ERC20_ABI = [
  {
    constant: true,
    inputs: [],
    name: 'name',
    outputs: [{ name: '', type: 'string' }],
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', type: 'string' }],
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', type: 'uint8' }],
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', type: 'uint256' }],
    type: 'function',
  },
];

export function validateBSCAddress(address: string): boolean {
  return web3.utils.isAddress(address);
}

export async function getBSCTokenInfo(address: string): Promise<BSCTokenInfo | null> {
  try {
    if (!validateBSCAddress(address)) {
      return null;
    }

    const contract = new web3.eth.Contract(ERC20_ABI, address);
    
    const [name, symbol, decimals, totalSupply] = await Promise.all([
      contract.methods.name().call(),
      contract.methods.symbol().call(),
      contract.methods.decimals().call(),
      contract.methods.totalSupply().call(),
    ]);

    return {
      address,
      symbol: symbol as unknown as string,
      name: name as unknown as string,
      decimals: Number(decimals),
      totalSupply: totalSupply as unknown as string,
    };
  } catch (error) {
    console.error('Error fetching BSC token info:', error);
    return null;
  }
}

export async function getBSCTokenPrice(address: string): Promise<number | null> {
  try {

    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/token_price/binance-smart-chain?contract_addresses=${address}&vs_currencies=usd`
    );
    
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    return data[address.toLowerCase()]?.usd || null;
  } catch (error) {
    console.error('Error fetching BSC token price:', error);
    return null;
  }
}






