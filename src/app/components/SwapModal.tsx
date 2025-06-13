"use client";

import { useState } from "react";
import { useAddress, useContract, useContractWrite } from "@thirdweb-dev/react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  pair: string;                 // e.g. "ETH / DAI"
  input: "ETH";                 // for now we always sell native ETH
  output: string;               // ERC-20 address to buy
};

export default function SwapModal({ isOpen, onClose, pair, output }: Props) {
  const [amount, setAmount] = useState("");   // ETH to sell
  const address = useAddress();

  /* ----- replace with your deployed router ----- */
  const { contract } = useContract("0xYourRouterContract"); // Sepolia addr
  const { mutateAsync: swap, isLoading } = useContractWrite(
    contract,
    "swapExactETHForTokens"          // or whatever your router exposes
  );
  /* --------------------------------------------- */

  async function handleSwap() {
    if (!amount || !contract) return;

    try {
      await swap({
        args: [
          0,                                  // minOut; set slippage later
          [ "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE", output ], // WETH-less path
          address,
          Math.floor(Date.now() / 1000) + 600 // deadline = now + 10 min
        ],
        overrides: { value: BigInt(parseFloat(amount) * 1e18) },
      });
      onClose();          // close on success
    } catch (err) {
      console.error(err);
      // TODO: toast error
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="w-[420px] rounded-xl bg-gray-900 p-6 shadow-xl">
        <h2 className="mb-4 text-lg font-semibold">{pair}</h2>

        {/* Sell box */}
        <label className="block text-sm">Sell (ETH)</label>
        <input
          type="number"
          min="0"
          placeholder="0.0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="mt-1 w-full rounded bg-gray-800 p-3 text-right outline-none"
        />

        {/* Buy box – display-only */}
        <label className="mt-6 block text-sm">Buy ({pair.split(" / ")[1]})</label>
        <input
          disabled
          placeholder="~"
          className="mt-1 w-full rounded bg-gray-800 p-3 text-right text-gray-500"
        />

        {/* buttons */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded bg-gray-700 px-4 py-2 text-sm hover:bg-gray-600"
          >
            Cancel
          </button>

          <button
            disabled={!address || !amount || isLoading}
            onClick={handleSwap}
            className="rounded bg-indigo-600 px-4 py-2 text-sm font-semibold disabled:opacity-40"
          >
            {address ? (isLoading ? "Swapping…" : "Swap") : "Connect wallet"}
          </button>
        </div>
      </div>
    </div>
  );
}
