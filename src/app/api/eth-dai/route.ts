/* src/app/api/eth-dai/route.ts
   Returns { ethInDai: number }  (price of 1 ETH in DAI) */
   import { NextRequest, NextResponse } from "next/server";

   const ENDPOINT =
     "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2";
   
   const PAIR_ID = "0xa478c2975ab1ea89e8196811f51a7b7ade33eb11"; // WETH/DAI
   
   const query = `
   {
     pair(id: "${PAIR_ID}") {
       token1Price     # DAI per WETH
     }
   }`;
   
   export async function GET(_req: NextRequest) {
     try {
       const res = await fetch(ENDPOINT, {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ query }),
         // Revalidate at edge every 5 s so we don’t hammer The Graph
         next: { revalidate: 5 },
       });
   
       if (!res.ok) throw new Error(`Subgraph ${res.status}`);
   
       const json = (await res.json()) as {
         data?: { pair?: { token1Price: string } };
       };
   
       const priceStr = json.data?.pair?.token1Price;
       if (!priceStr) throw new Error("pair not found");
   
       const ethInDai = Number(priceStr);
   
       return NextResponse.json({ ethInDai });
     } catch (err) {
       console.error("subgraph error", err);
       return NextResponse.json({ error: "failed" }, { status: 502 });
     }
   }
   


