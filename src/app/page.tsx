"use client";

import React, { useState } from "react";
import { getMarketplaceContract } from "./Utils/getContract";

export default function Page() {
  const [status, setStatus] = useState<string>("");

  const handleBuy = async () => {
    try {
      setStatus("⏳ Waiting for buy tx…");
      const { web3, contract, accounts } = await getMarketplaceContract();
      await contract.methods.buy().send({
        from: accounts[0],
        value: web3.utils.toWei("0.1", "ether"),
      });
      setStatus("✅ Bought for 0.1 ETH!");
    } catch (err: any) {
      console.error(err);
      setStatus(`❌ Buy failed: ${err.message}`);
    }
  };

  const handleFaucet = async () => {
    try {
      setStatus("⏳ Requesting 1 ETH from faucet…");
      const { contract, accounts } = await getMarketplaceContract();
      await contract.methods.faucet().send({ from: accounts[0] });
      setStatus("✅ Received 1 ETH!");
    } catch (err: any) {
      console.error(err);
      setStatus(`❌ Faucet failed: ${err.message}`);
    }
  };

  return (
    <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Decentralized Marketplace</h1>

      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
        <button
          onClick={handleBuy}
          style={{
            padding: "0.75rem 1.5rem",
            fontSize: "1rem",
            borderRadius: "4px",
            border: "none",
            cursor: "pointer",
            background: "#4CAF50",
            color: "white",
          }}
        >
          Buy for 0.1 ETH
        </button>

        <button
          onClick={handleFaucet}
          style={{
            padding: "0.75rem 1.5rem",
            fontSize: "1rem",
            borderRadius: "4px",
            border: "none",
            cursor: "pointer",
            background: "#1976D2",
            color: "white",
          }}
        >
          Get 1 ETH
        </button>
      </div>

      {status && <p>{status}</p>}
    </main>
  );
}
