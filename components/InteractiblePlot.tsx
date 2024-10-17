'use client';

import { useState, useEffect } from 'react';
import { quoteData } from '@/data/data';
import { calculate_implied_volatility_baw } from '@/models/models';
import React from 'react';
import { ChartComponent } from '@/components/ChartComponent';
import { Checkbox, FormControlLabel, Box, Button, TextField } from '@mui/material';

const S = 566.345;
const T = 0.015708354371353372;
const q = 0.0035192;
const r = 0.0486;

function filterChartData(chartData: any[], S: number, numStdev: number, twoSigmaMove: boolean = false) {
    const strikes = chartData.map(data => data.strike);
    const stdev = Math.sqrt(strikes.reduce((acc, val) => acc + Math.pow(val - S, 2), 0) / strikes.length);
    let lowerBound = S - numStdev * stdev;
    let upperBound = S + numStdev * stdev;

    if (twoSigmaMove) {
        upperBound = S + 2 * stdev;
    }

    return chartData.filter(data => data.strike >= lowerBound && data.strike <= upperBound);
}

export default function InteractiblePlot() {
    const [xData, setXData] = useState<number[]>([]);
    const [bidData, setBidData] = useState<number[]>([]);
    const [midData, setMidData] = useState<number[]>([]);
    const [askData, setAskData] = useState<number[]>([]);
    const [showBid, setShowBid] = useState(false);
    const [showAsk, setShowAsk] = useState(false);
    const [bidChecked, setBidChecked] = useState(false);
    const [askChecked, setAskChecked] = useState(false);
    const [pennyChecked, setPennyChecked] = useState(false);
    const [numStdev, setNumStdev] = useState<number>(1.25);
    const [inputValue, setInputValue] = useState<string>('1.25');

    const handleEnter = () => {
        const input = inputValue.trim();
        const isValidFloat = /^-?\d+(\.\d+)?$/.test(input);

        if (!isValidFloat) {
            alert("Please enter a valid number for the standard deviation.");
            return;
        }

        const stdevValue = parseFloat(input);

        setNumStdev(stdevValue);
        setShowBid(bidChecked);
        setShowAsk(askChecked);
    };

    useEffect(() => {
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

        const filteredChartData = filterChartData(chartData, S, numStdev);

        setXData(filteredChartData.map((data) => data.strike));
        setBidData(filteredChartData.map((data) => data.bid_iv));
        setMidData(filteredChartData.map((data) => data.mid_iv));
        setAskData(filteredChartData.map((data) => data.ask_iv));
    }, [showBid, showAsk, numStdev]);

    return (
        <div style={{ width: '100%' }}>
            <Box display="flex" justifyContent="center" mb={3}>
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
                <TextField
                    label="Strike Filter"
                    variant="outlined"
                    size="small"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    type="text"
                    sx={{
                        marginRight: 2,
                        width: '100px',
                        '& .MuiInputBase-input': {
                            color: 'white',
                        },
                        '& .MuiInputLabel-root': {
                            color: 'white',
                        },
                        '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'white',
                        },
                        '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'white',
                        },
                        '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'white',
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                            color: 'white',
                        },
                    }}
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={pennyChecked}
                            onChange={(e) => setPennyChecked(e.target.checked)}
                            style={{ color: '#FFD700' }}
                        />
                    }
                    label="Penny Filter"
                    sx={{ color: 'white' }}
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={bidChecked}
                            onChange={(e) => setBidChecked(e.target.checked)}
                            style={{ color: '#3CB371' }}
                        />
                    }
                    label="Bid"
                    sx={{ color: 'white' }}
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={askChecked}
                            onChange={(e) => setAskChecked(e.target.checked)}
                            style={{ color: '#FF6347' }}
                        />
                    }
                    label="Ask"
                    sx={{ color: 'white' }}
                />
                <Button
                    variant="outlined"
                    size="small"
                    onClick={handleEnter}
                    sx={{
                        color: 'white',
                        borderColor: 'white',
                        '&:hover': {
                            borderColor: 'white',
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        }
                    }}
                >
                    Enter
                </Button>
            </Box>
        </div>
    );
}
