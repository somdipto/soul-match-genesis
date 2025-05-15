
import { ethers } from 'ethers';
import { supabase } from './supabase';

// Function to check if MetaMask is installed
export function isMetaMaskInstalled(): boolean {
  return typeof window !== 'undefined' && window.ethereum !== undefined;
}

// Function to get a Web3 provider
export async function getWeb3Provider() {
  if (!isMetaMaskInstalled()) {
    throw new Error('MetaMask is not installed');
  }
  
  await window.ethereum.request({ method: 'eth_requestAccounts' });
  return new ethers.BrowserProvider(window.ethereum);
}

// Function to get current wallet address
export async function getCurrentWalletAddress(): Promise<string | null> {
  try {
    if (!isMetaMaskInstalled()) return null;
    
    const provider = await getWeb3Provider();
    const signer = await provider.getSigner();
    return await signer.getAddress();
  } catch (error) {
    console.error('Error getting wallet address:', error);
    return null;
  }
}

// Function to sign a message for authentication
export async function signMessage(message: string): Promise<string | null> {
  try {
    if (!isMetaMaskInstalled()) return null;
    
    const provider = await getWeb3Provider();
    const signer = await provider.getSigner();
    return await signer.signMessage(message);
  } catch (error) {
    console.error('Error signing message:', error);
    return null;
  }
}

// Function to authenticate with wallet
export async function authenticateWithWallet(): Promise<{ user: any, error: any }> {
  try {
    // Get wallet address
    const walletAddress = await getCurrentWalletAddress();
    if (!walletAddress) {
      throw new Error('No wallet address found');
    }
    
    // Generate a nonce (in a real app, this would come from the server)
    const nonce = Math.floor(Math.random() * 1000000).toString();
    
    // Create a message to sign
    const message = `Sign this message to authenticate with Datex: ${nonce}`;
    
    // Sign the message
    const signature = await signMessage(message);
    if (!signature) {
      throw new Error('Failed to sign message');
    }
    
    // Authenticate with Supabase using the wallet address and signature
    // In a real app, you'd validate the signature on the server side
    const { data, error } = await supabase.auth.signInWithPassword({
      email: `${walletAddress.toLowerCase()}@wallet.datex.app`,
      password: signature.substring(0, 20), // Using part of the signature as password for demo
    });
    
    if (error && error.status === 400) {
      // User doesn't exist, sign up
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: `${walletAddress.toLowerCase()}@wallet.datex.app`,
        password: signature.substring(0, 20),
        options: {
          data: {
            wallet_address: walletAddress,
          },
        },
      });
      
      return { user: signUpData.user, error: signUpError };
    }
    
    return { user: data.user, error };
  } catch (error) {
    console.error('Error authenticating with wallet:', error);
    return { user: null, error };
  }
}
