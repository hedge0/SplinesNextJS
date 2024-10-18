'use client';

import dynamic from 'next/dynamic';
import React from 'react';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

export function ChartComponent({ xData, bidData, midData, askData, fineX, interpolatedY, showBid, showAsk, fitChecked }: any) {
    const plotData: Partial<Plotly.Data>[] = [
        {
            x: xData,
            y: midData,
            mode: 'markers',
            marker: { color: '#8884d8', size: 8 },
            name: 'Mid IV',
            type: 'scatter',
        },
    ];

    if (showBid) {
        plotData.push(
            {
                x: xData,
                y: bidData,
                mode: 'markers',
                marker: { color: '#8884d8', size: 6 },
                name: 'Bid IV',
                type: 'scatter',
            }
        );

        xData.forEach((x: any, idx: number) => {
            plotData.push({
                x: [x, x],
                y: [bidData[idx], midData[idx]],
                mode: 'lines',
                line: { color: '#8884d8' },
                name: 'Bid-Mid Line',
                type: 'scatter',
                showlegend: false,
            });
        });
    }

    if (showAsk) {
        plotData.push(
            {
                x: xData,
                y: askData,
                mode: 'markers',
                marker: { color: '#8884d8', size: 6 },
                name: 'Ask IV',
                type: 'scatter',
            }
        );

        xData.forEach((x: any, idx: number) => {
            plotData.push({
                x: [x, x],
                y: [askData[idx], midData[idx]],
                mode: 'lines',
                line: { color: '#8884d8' },
                name: 'Ask-Mid Line',
                type: 'scatter',
                showlegend: false,
            });
        });
    }

    // Conditionally add the line plot using fineX and interpolatedY
    if (fitChecked) {
        plotData.push({
            x: fineX,
            y: interpolatedY,
            mode: 'lines',
            line: { color: '#FFD700', width: 2 },  // Line for interpolation
            name: 'Interpolated Line',
            type: 'scatter',
            showlegend: true,
        });
    }

    return (
        <div className="bg-gray-700 rounded-lg shadow-lg p-8 w-full max-w-6xl">
            <Plot
                data={plotData}
                layout={{
                    paper_bgcolor: 'rgba(0,0,0,0)',
                    plot_bgcolor: 'rgba(0,0,0,0)',
                    title: {
                        text: 'Quote Data',
                        font: { color: '#fff' },
                    },
                    xaxis: {
                        title: 'Strike Price (K)',
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
                    showlegend: false,
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
