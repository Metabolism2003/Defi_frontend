/*  src/app/dashboard/page.tsx  */
'use client';

import { useState } from "react";
import clsx from "clsx";               // tiny helper; already in the Next.js starter

type Row = {
  pair: string;
  venue: string;
  price: number;
  input: string;   // token address or "ETH"
  output: string;  // token address
};

const rows: Row[] = [
  {
    pair: "ETH / DAI",
    venue: "Uniswap",
    price: 2754,
    input: "ETH",
    output: "0x6b175474e89094c44da98b954eedeac495271d0f", // DAI Sepolia
  }
];

export default function Dashboard() {
  const [open, setOpen] = useState(false);
  const [iframeUrl, setIframeUrl] = useState("");

  /** Build swap URL → open modal */
  function handleTrade(row: Row) {
    const url = `https://app.uniswap.org/#/swap?theme=dark&chain=sepolia&inputCurrency=${row.input}&outputCurrency=${row.output}`;
    setIframeUrl(url);
    setOpen(true);
  }

  return (
    <main className="mx-auto max-w-4xl p-6">
      <h1 className="mb-6 text-2xl font-semibold">ETH Price Dashboard</h1>

      {/* ---------- table ---------- */}
      <div className="divide-y divide-gray-700 border border-gray-700 rounded-lg overflow-hidden">
        <div className="grid grid-cols-4 gap-4 bg-indigo-700 px-4 py-3 text-sm font-medium text-white"> 
          <span>Pair</span>
          <span>Exchange</span>
          <span className="text-right">Price</span>
          <span className="text-right">Trade</span>
        </div>

        {rows.map((row) => (
          <div
            key={`${row.pair}-${row.venue}`}
            className="grid grid-cols-4 gap-4 items-center px-4 py-3 text-sm"
          >
            <span>{row.pair}</span>
            <span>{row.venue}</span>
            <span className="text-right">${row.price.toLocaleString()}</span>

            <span className="text-right">
              <button
                onClick={() => handleTrade(row)}
                className="rounded bg-indigo-600 px-3 py-1 text-xs font-semibold hover:bg-indigo-500"
              >
                Trade
              </button>
            </span>
          </div>
        ))}
      </div>

      {/* ---------- modal overlay ---------- */}
      {open && (
        <div
          className={clsx(
            "fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur"
          )}
        >
          <div className="relative w-[440px] max-w-full rounded-xl overflow-hidden shadow-2xl">
            {/* close button */}
            <button
              onClick={() => setOpen(false)}
              className="absolute right-2 top-2 z-10 rounded-full bg-gray-700 p-1 text-sm hover:bg-gray-600"
            >
              ✕
            </button>

            {/* Uniswap iframe */}
            <iframe
              src={iframeUrl}
              title="Uniswap swap"
              className="h-[640px] w-full border-0"
            />
          </div>
        </div>
      )}
    </main>
  );
}
