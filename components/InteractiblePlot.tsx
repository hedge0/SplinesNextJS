'use client';

import { quoteData } from '@/data/data';
import { calculate_implied_volatility_baw } from '@/models/models';
import React from 'react';
import { ChartComponent } from '@/components/ChartComponent';

const S = 566.345;
const T = 0.015708354371353372;
const q = 0.0035192;
const r = 0.0486;

export default function InteractiblePlot() {
    // Process the data for mids, asks, and bids
    const chartData = Object.entries(quoteData).map(([key, value]) => {
        const K = parseFloat(key);
        const bid_price = value[0]; // Bid price
        const ask_price = value[1]; // Ask price
        const mid_price = value[2]; // Mid price
        const option_type = 'calls';

        const bid_iv = calculate_implied_volatility_baw(bid_price, S, K, r, T, q, option_type);
        const mid_iv = calculate_implied_volatility_baw(mid_price, S, K, r, T, q, option_type);
        const ask_iv = calculate_implied_volatility_baw(ask_price, S, K, r, T, q, option_type);

        return {
            strike: K,
            bid_iv,
            mid_iv,
            ask_iv,
        };
    });

    // Extract x, bid, mid, and ask data
    const xData = chartData.map((data) => data.strike);
    const bidData = chartData.map((data) => data.bid_iv);
    const midData = chartData.map((data) => data.mid_iv);
    const askData = chartData.map((data) => data.ask_iv);

    // Set showBid and showAsk to false by default
    const showBid = false;
    const showAsk = false;

    // Pass the processed data and booleans to the ChartComponent
    return (
        <ChartComponent
            xData={xData}
            bidData={bidData}
            midData={midData}
            askData={askData}
            showBid={showBid}
            showAsk={showAsk}
        />
    );
}
