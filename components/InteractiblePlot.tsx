'use client';

import { useState, useEffect } from 'react';
import { quoteData } from '@/data/data';
import { calculate_implied_volatility_baw } from '@/models/models';
import React from 'react';
import { ChartComponent } from '@/components/ChartComponent';
import { Checkbox, FormControlLabel, Box, TextField, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { Interpolations } from '@/interpolations/interpolations';

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
    const [fineX, setFineX] = useState<number[]>([]);
    const [interpolatedY, setInterpolatedY] = useState<number[]>([]);
    const [bidChecked, setBidChecked] = useState(false);
    const [askChecked, setAskChecked] = useState(false);
    const [pennyChecked, setPennyChecked] = useState(false);
    const [inputValue, setInputValue] = useState<string>('1.25');
    const [selectedModel, setSelectedModel] = useState<'RFV' | 'SLV' | 'SABR' | 'SVI'>('RFV');

    useEffect(() => {
        function parseStandardDeviation(inputValue: string): number {
            let input = inputValue.trim();

            if (input === '') {
                input = '0.0';
            }

            const isValidFloat = /^-?(0|[1-9]\d*)(\.\d*)?$/.test(input);

            if (!isValidFloat) {
                alert("Please enter a valid number for the standard deviation.");
                setInputValue('1.25');
                return 1.25;
            }

            return parseFloat(input);
        }

        const stdevValue = parseStandardDeviation(inputValue);

        let chartData = Object.entries(quoteData)
            .filter(([_, value]) => !(pennyChecked && value[0] === 0.0))
            .map(([key, value]) => {
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

        const filteredChartData = stdevValue === 0.0 ? chartData : filterChartData(chartData, S, stdevValue);

        const x = filteredChartData.map((data) => data.strike);
        const bid_iv = filteredChartData.map((data) => data.bid_iv);
        const ask_iv = filteredChartData.map((data) => data.ask_iv);
        const mid_iv = filteredChartData.map((data) => data.mid_iv);

        const x_min = Math.min(...x);
        const x_max = Math.max(...x);
        const x_normalized = x.map(value => {
            let normalizedValue = (value - x_min) / (x_max - x_min);
            normalizedValue += 0.5;
            return normalizedValue;
        });

        const params = Interpolations.fit_model(x_normalized, mid_iv, bid_iv, ask_iv, selectedModel);

        const fine_x_min = Math.min(...x_normalized);
        const fine_x_max = Math.max(...x_normalized);
        const fine_x_normalized = Array.from({ length: 800 }, (_, i) =>
            fine_x_min + (i * (fine_x_max - fine_x_min) / 799)
        );

        const modelFunction = {
            'RFV': Interpolations.rfv_model,
            'SLV': Interpolations.slv_model,
            'SABR': Interpolations.sabr_model,
            'SVI': Interpolations.svi_model,
        }[selectedModel];

        if (modelFunction) {
            const interpolated_y = modelFunction(fine_x_normalized.map(Math.log), params);
            const fine_x = Array.from({ length: 800 }, (_, i) =>
                x_min + (i * (x_max - x_min) / 799)
            );

            setFineX(fine_x);
            setInterpolatedY(interpolated_y);
        } else {
            console.error("Model function is undefined.");
        }

        setXData(x);
        if (bidChecked) {
            setBidData(bid_iv);
        } else {
            setBidData([]);
        }
        setMidData(mid_iv);
        if (askChecked) {
            setAskData(ask_iv);
        } else {
            setAskData([]);
        }
    }, [pennyChecked, bidChecked, askChecked, inputValue, selectedModel]);

    return (
        <div style={{ width: '100%' }}>
            <Box display="flex" justifyContent="center" mb={3}>
                <ChartComponent
                    xData={xData}
                    bidData={bidData}
                    midData={midData}
                    askData={askData}
                    fineX={fineX}
                    interpolatedY={interpolatedY}
                    showBid={bidChecked}
                    showAsk={askChecked}
                />
            </Box>
            <Box display="flex" justifyContent="center" mb={2}>
                <FormControl variant="outlined" size="small" sx={{ marginRight: 2, width: '100px' }}>
                    <InputLabel
                        id="model-select-label"
                        sx={{
                            color: 'white',
                            '&.Mui-focused': {
                                color: 'white',
                            },
                        }}
                    >
                        Model
                    </InputLabel>
                    <Select
                        labelId="model-select-label"
                        id="model-select"
                        value={selectedModel}
                        label="Model"
                        onChange={(e) => setSelectedModel(e.target.value as 'RFV' | 'SLV' | 'SABR' | 'SVI')}
                        sx={{
                            '& .MuiOutlinedInput-notchedOutline': { borderColor: '#8884d8' },
                            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#8884d8' },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#8884d8' },
                            '& .MuiSelect-icon': { color: 'white' },
                            '& .MuiInputBase-input': { color: 'white' },
                            '& .MuiInputLabel-root': { color: 'white' },
                            '& .MuiInputLabel-root.Mui-focused': { color: 'white' },
                        }}
                    >
                        <MenuItem value="RFV">RFV</MenuItem>
                        <MenuItem value="SLV">SLV</MenuItem>
                        <MenuItem value="SABR">SABR</MenuItem>
                        <MenuItem value="SVI">SVI</MenuItem>
                    </Select>
                </FormControl>
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
                            borderColor: '#8884d8',
                        },
                        '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#8884d8',
                        },
                        '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#8884d8',
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
                            style={{ color: '#8884d8' }}
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
                            style={{ color: '#8884d8' }}
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
                            style={{ color: '#8884d8' }}
                        />
                    }
                    label="Ask"
                    sx={{ color: 'white' }}
                />
            </Box>
        </div>
    );
}
