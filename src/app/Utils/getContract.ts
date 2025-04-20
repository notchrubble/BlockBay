
import Web3 from "web3";
import Marketplace from "../../../build/contracts/Marketplace.json";

export interface MarketplaceContext {
  web3: Web3;
  contract: any;
  accounts: string[];
}

export async function getMarketplaceContract(): Promise<MarketplaceContext> {
  // 1. Make sure we’re in the browser and MetaMask is available
  if (typeof window === "undefined" || !window.ethereum) {
    throw new Error(
      "MetaMask not detected. Please install MetaMask and refresh the page."
    );
  }

  // 2. Request account access if needed
  await window.ethereum.request({ method: "eth_requestAccounts" });

  // 3. Create a Web3 instance using MetaMask’s provider
  const web3 = new Web3(window.ethereum as any);

  // 4. Figure out which network we’re on, and grab the deployed network info
  const networkId = await web3.eth.net.getId();
  const deployedNetwork = (Marketplace.networks as any)[networkId.toString()];
  if (!deployedNetwork) {
    throw new Error(
      `Marketplace contract not deployed to network ID ${networkId}. ` +
      `Please make sure Ganache (or your target network) is running and ` +
      `you’ve migrated your contracts.`
    );
  }

  // 5. Create the contract instance
  const contract = new web3.eth.Contract(
    Marketplace.abi as any,
    deployedNetwork.address as string
  );

  // 6. Get user accounts
  const accounts = await web3.eth.getAccounts();

  return { web3, contract, accounts };
}