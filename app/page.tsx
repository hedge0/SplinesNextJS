'use client';

import React, { useEffect, useState } from 'react';
import InteractiblePlot from "@/components/InteractiblePlot";

export default function Home() {
  const S = 566.345;
  const T = 0.015708354371353372;
  const q = 0.0035192;
  const r = 0.0486;
  const option_type = 'calls';

  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [ticker, setTicker] = useState<string>('AAPL');

  useEffect(() => {
    async function fetchStockPrice() {
      try {
        // Pass the ticker as a query parameter to the API
        const response = await fetch(`/api/quotes?ticker=${ticker}`);
        const data = await response.json();

        console.log(data);

        // Log and set the current price
        const price = data?.quote?.regularMarketPrice;
        if (price !== undefined) {
          console.log(`Current price of ${ticker}:`, price);
          setCurrentPrice(price);
        } else {
          console.error(`Error: Price for ${ticker} is undefined`);
        }
      } catch (error) {
        console.error(`Error fetching price for ${ticker}:`, error);
      }
    }

    fetchStockPrice();
  }, [ticker]);

  return (
    <div className="flex flex-col items-center justify-start min-h-[95vh] py-4 mt-10">
      <h1>{ticker} Current Price: {currentPrice !== null ? `$${currentPrice}` : 'Loading...'}</h1>
      <InteractiblePlot S={S} T={T} q={q} r={r} option_type={option_type} />
    </div>
  );
}
