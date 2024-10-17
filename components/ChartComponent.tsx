'use client'

import dynamic from 'next/dynamic';
import { quoteData } from '@/data/data';
import { calculate_implied_volatility_baw } from '@/models/models';
import React from 'react';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

const S = 566.345;
const T = 0.015708354371353372;
const q = 0.0035192;
const r = 0.0486;

const chartData = Object.entries(quoteData).map(([key, value]) => {
    const K = parseFloat(key);
    const option_price = value[2];
    const option_type = 'calls';

    const implied_volatility = calculate_implied_volatility_baw(option_price, S, K, r, T, q, option_type);

    return {
        x: K,
        y: implied_volatility,
    };
});

export function ChartComponent() {
    const xData = chartData.map((data) => data.x);
    const yData = chartData.map((data) => data.y);

    return (
        <div className="bg-gray-700 rounded-lg shadow-lg p-8 w-full max-w-6xl">
            <h2 className="text-2xl font-bold mb-4 text-white">Quote Data Chart</h2>
            <Plot
                data={[
                    {
                        x: xData,
                        y: yData,
                        mode: 'markers',
                        marker: { color: '#8884d8' },
                        type: 'scatter',
                    },
                ]}
                layout={{
                    paper_bgcolor: 'rgba(0,0,0,0)',
                    plot_bgcolor: 'rgba(0,0,0,0)',
                    title: {
                        text: 'Quote Data',
                        font: { color: '#fff' },
                    },
                    xaxis: {
                        title: 'Key (K)',
                        color: '#fff',
                        showgrid: true,
                        gridcolor: '#555',
                    },
                    yaxis: {
                        title: 'Implied Volatility',
                        color: '#fff',
                        showgrid: true,
                        gridcolor: '#555',
                    },
                    margin: {
                        t: 40,
                        r: 20,
                        b: 40,
                        l: 40,
                    },
                    dragmode: 'pan',
                    modebar: {
                        orientation: 'h',
                        bgcolor: 'transparent',
                    },
                }}
                config={{
                    responsive: true,
                    displayModeBar: true,
                    modeBarButtonsToRemove: ['select2d', 'lasso2d'],
                    scrollZoom: true,
                    modeBarButtonsToAdd: ['zoom2d', 'pan2d', 'resetScale2d'],
                    displaylogo: false,
                }}
                style={{ width: '100%', height: '650px' }}
            />
        </div>
    );
}
