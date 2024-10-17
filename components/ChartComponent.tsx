'use client'

import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { quoteData } from '@/data/data'
import { calculate_implied_volatility_baw } from '@/models/models'

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
    return (
        <div className="bg-gray-700 rounded-lg shadow-lg p-6 w-full max-w-4xl">
            <h2 className="text-2xl font-bold mb-4 text-white">Quote Data Chart</h2>
            <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#555" />
                        <XAxis
                            type="number"
                            dataKey="x"
                            name="Key"
                            stroke="#fff"
                            domain={['dataMin', 'dataMax']}
                        />
                        <YAxis
                            type="number"
                            dataKey="y"
                            name="Value"
                            stroke="#fff"
                            domain={['dataMin', 'dataMax']}
                        />
                        <Tooltip
                            cursor={{ strokeDasharray: '3 3' }}
                            contentStyle={{ backgroundColor: '#333', border: 'none' }}
                            labelStyle={{ color: '#fff' }}
                            itemStyle={{ color: '#fff' }}
                        />
                        <Scatter name="Quote Data" data={chartData} fill="#8884d8" />
                    </ScatterChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}