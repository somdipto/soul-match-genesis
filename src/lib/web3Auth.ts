
import { ethers } from 'ethers';
import { supabase } from './supabase';

// Function to check if MetaMask is installed
export function isMetaMaskInstalled(): boolean {
  return typeof window !== 'undefined' && 
         typeof window.ethereum !== 'undefined' && 
         window.ethereum.isMetaMask === true;
}

// Function to get a Web3 provider
export async function getWeb3Provider() {
  if (!isMetaMaskInstalled()) {
    throw new Error('MetaMask is not installed');
  }
  
  try {
    // Request account access
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    if (!accounts || accounts.length === 0) {
      throw new Error('No accounts found');
    }
    
    return new ethers.BrowserProvider(window.ethereum);
  } catch (error: any) {
    console.error('Error connecting to MetaMask:', error);
    throw new Error(error.message || 'Failed to connect to MetaMask');
  }
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
    // Check if MetaMask is installed
    if (!isMetaMaskInstalled()) {
      throw new Error('MetaMask is not installed. Please install MetaMask extension and try again.');
    }
    
    // Get wallet address
    const walletAddress = await getCurrentWalletAddress();
    if (!walletAddress) {
      throw new Error('No wallet address found. Please connect your wallet and try again.');
    }
    
    // Generate a nonce (in a real app, this would come from the server)
    const nonce = Math.floor(Math.random() * 1000000).toString();
    
    // Create a message to sign
    const message = `Sign this message to authenticate with Datex: ${nonce}`;
    
    // Sign the message
    const signature = await signMessage(message);
    if (!signature) {
      throw new Error('Failed to sign message. Please try again.');
    }
    
    // Create a deterministic password from the signature (for demo purposes)
    const password = ethers.keccak256(ethers.toUtf8Bytes(signature)).slice(0, 42);
    
    // Authenticate with Supabase using the wallet address and signature
    const { data, error } = await supabase.auth.signInWithPassword({
      email: `${walletAddress.toLowerCase()}@wallet.datex.app`,
      password,
    });
    
    if (error && error.status === 400) {
      // User doesn't exist, sign up
      console.log("User doesn't exist, signing up...");
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: `${walletAddress.toLowerCase()}@wallet.datex.app`,
        password,
        options: {
          data: {
            wallet_address: walletAddress,
          },
        },
      });
      
      // Create profile for new user
      if (signUpData.user) {
        await supabase
          .from('profiles')
          .upsert({
            id: signUpData.user.id,
            wallet_address: walletAddress,
            updated_at: new Date().toISOString(),
          });
      }
      
      return { user: signUpData.user, error: signUpError };
    }
    
    return { user: data?.user || null, error };
  } catch (error: any) {
    console.error('Error authenticating with wallet:', error);
    return { user: null, error: { message: error.message || 'An error occurred during wallet authentication' } };
  }
}
