import Web3 from "web3";
import Marketplace from "../../../build/contracts/Marketplace.json";

declare global {
  interface Window {
    ethereum?: any;
    web3?: Web3;
  }
}

const getMarketplaceContract = async () => {
  if (typeof window.ethereum === "undefined") {
    throw new Error("MetaMask not detected. Please install MetaMask.");
  }

  // Create a Web3 instance
  const web3 = new Web3(window.ethereum);

  // Request wallet access
  await window.ethereum.request({ method: "eth_requestAccounts" });

  const accounts = await web3.eth.getAccounts();
  const networkId = await web3.eth.net.getId();

  const deployedNetwork = Marketplace.networks[networkId];
  if (!deployedNetwork) {
    throw new Error("Smart contract not deployed to the detected network.");
  }

  const contract = new web3.eth.Contract(
    Marketplace.abi,
    deployedNetwork.address
  );

  return { web3, contract, accounts }; // ✅ Make sure web3 is returned
};

export { getMarketplaceContract };