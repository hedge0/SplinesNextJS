'use client';

import { useState } from 'react';
import { quoteData } from '@/data/data';
import { calculate_implied_volatility_baw } from '@/models/models';
import React from 'react';
import { ChartComponent } from '@/components/ChartComponent';
import { Checkbox, FormControlLabel, Box } from '@mui/material';

const S = 566.345;
const T = 0.015708354371353372;
const q = 0.0035192;
const r = 0.0486;

export default function InteractiblePlot() {
    const chartData = Object.entries(quoteData).map(([key, value]) => {
        const K = parseFloat(key);
        const bid_price = value[0];
        const ask_price = value[1];
        const mid_price = value[2];
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

    const xData = chartData.map((data) => data.strike);
    const bidData = chartData.map((data) => data.bid_iv);
    const midData = chartData.map((data) => data.mid_iv);
    const askData = chartData.map((data) => data.ask_iv);

    const [showBid, setShowBid] = useState(false);
    const [showAsk, setShowAsk] = useState(false);

    const handleBidChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setShowBid(event.target.checked);
    };

    const handleAskChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setShowAsk(event.target.checked);
    };

    return (
        <div style={{ width: '100%' }}>
            <Box display="flex" justifyContent="center">
                <ChartComponent
                    xData={xData}
                    bidData={bidData}
                    midData={midData}
                    askData={askData}
                    showBid={showBid}
                    showAsk={showAsk}
                />
            </Box>
            <Box display="flex" justifyContent="center" mb={2}>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={showBid}
                            onChange={handleBidChange}
                            style={{ color: '#3CB371' }}
                        />
                    }
                    label="Show Bid"
                    sx={{ color: 'white' }}
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={showAsk}
                            onChange={handleAskChange}
                            style={{ color: '#FF6347' }}
                        />
                    }
                    label="Show Ask"
                    sx={{ color: 'white' }}
                />
            </Box>
        </div>
    );
}
