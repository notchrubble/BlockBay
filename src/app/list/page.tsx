"use client";

import { useState } from "react";
import { getMarketplaceContract } from "../Utils/getContract";
import { v4 as uuidv4 } from "uuid";
import { addProduct } from "../Utils/productStorage";


export default function ListItemPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [saleType, setSaleType] = useState<"fixed" | "auction">("fixed");
  const [price, setPrice] = useState("");
  const [startingBid, setStartingBid] = useState("");
  const [endDate, setEndDate] = useState("");
  const [category, setCategory] = useState("Electronics");
  const [image, setImage] = useState<File | null>(null);
  const [status, setStatus] = useState("");

  const convertToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
    });

  const handleListItem = async () => {
    try {
      if (!name || !description) return setStatus("❌ Name and description required.");
      if (saleType === "fixed" && !price) return setStatus("❌ Price is required.");
      if (saleType === "auction" && (!startingBid || !endDate)) {
        return setStatus("❌ Starting bid and end date/time are required for auction.");
      }

      setStatus("⏳ Listing item…");
      const { web3, contract, accounts } = await getMarketplaceContract();
      const seller = accounts[0];
      const imageData = image ? await convertToBase64(image) : "";
      const id = uuidv4();

      if (saleType === "fixed") {
        const priceInWei = web3.utils.toWei(price, "ether");
        console.log("✅ Simulating successful contract call for fixed listing");


          addProduct({
            name,
            description,
            price: priceInWei,
            seller,
            imageUrl: imageData,
            isAuction: false,
          }, id);

        setStatus(`✅ Item "${name}" listed for ${price} ETH.`);
      } else {
        const bidInWei = web3.utils.toWei(startingBid, "ether");
        const endTime = Math.floor(new Date(endDate).getTime() / 1000);
        console.log("✅ Simulating successful contract call for auction listing");


          addProduct({
            name,
            description,
            price: bidInWei,
            seller,
            imageUrl: imageData,
            endTime,
            isAuction: true,
          }, id);

        setStatus(`✅ Auction for "${name}" listed (ends at ${new Date(endDate).toLocaleString()})`);
      }

      // Reset form
      setName("");
      setDescription("");
      setSaleType("fixed");
      setPrice("");
      setStartingBid("");
      setEndDate("");
      setCategory("Electronics");
      setImage(null);
    } catch (err: any) {
      console.error(err);
      setStatus(`❌ Failed to list item: ${err.message}`);
    }
  };

  return (
    <main className="max-w-2xl mx-auto mt-10 px-6">
      <h1 className="text-3xl font-bold mb-6 text-center">📦 List an Item</h1>

      <div className="flex flex-col gap-4 bg-base-200 p-6 rounded-xl shadow-md">
        <input
          type="text"
          placeholder="Item Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input input-bordered w-full"
        />

        <textarea
          placeholder="Item Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="textarea textarea-bordered w-full"
        />

        <div className="flex flex-col gap-2">
          <label className="label-text font-semibold">Sale Type:</label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="saleType"
              value="fixed"
              checked={saleType === "fixed"}
              onChange={() => setSaleType("fixed")}
              className="radio"
            />
            Fixed Price
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="saleType"
              value="auction"
              checked={saleType === "auction"}
              onChange={() => setSaleType("auction")}
              className="radio"
            />
            Auction
          </label>
        </div>

        {saleType === "fixed" && (
          <input
            type="number"
            placeholder="Price in ETH"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="input input-bordered w-full"
          />
        )}

        {saleType === "auction" && (
          <>
            <input
              type="number"
              placeholder="Starting Bid in ETH"
              value={startingBid}
              onChange={(e) => setStartingBid(e.target.value)}
              className="input input-bordered w-full"
            />
            <label className="label-text text-sm">Auction End Date/Time:</label>
            <input
              type="datetime-local"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="input input-bordered w-full"
            />
          </>
        )}

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="select select-bordered w-full"
        >
          <option>Electronics</option>
          <option>Books</option>
          <option>Clothing</option>
          <option>Home</option>
          <option>Other</option>
        </select>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
          className="file-input file-input-bordered w-full"
        />

        <button onClick={handleListItem} className="btn btn-primary w-full">
          {saleType === "fixed" ? "List Item" : "Start Auction"}
        </button>

        {status && <p className="text-sm text-center">{status}</p>}
      </div>
    </main>
  );
}