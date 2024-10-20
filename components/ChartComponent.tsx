import dynamic from 'next/dynamic';
import React from 'react';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

/**
 * Renders a chart displaying bid, mid, and ask implied volatilities, with an optional fitted line.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {number[]} props.xData - The x-axis data representing the strike prices.
 * @param {number[]} props.bidData - The bid implied volatility values.
 * @param {number[]} props.midData - The mid implied volatility values.
 * @param {number[]} props.askData - The ask implied volatility values.
 * @param {number[]} props.fineX - The x-axis data for the interpolated line.
 * @param {number[]} props.interpolatedY - The y-axis data for the interpolated line.
 * @param {boolean} props.showBid - Whether to show the bid implied volatility data.
 * @param {boolean} props.showAsk - Whether to show the ask implied volatility data.
 * @param {boolean} props.fitChecked - Whether to show the interpolated fit line.
 * @param {string} props.optionType - The type of options (calls or puts).
 * @param {string} props.ticker - The stock ticker symbol.
 * @param {string} props.expirationDate - The option's expiration date.
 * @param {number} props.S - The current stock price.
 * @returns {JSX.Element} - The rendered chart component.
 */
export function ChartComponent({ xData, bidData, midData, askData, fineX, interpolatedY, showBid, showAsk, fitChecked, optionType, ticker, expirationDate, S }: any) {
    const plotData: Partial<Plotly.Data>[] = [
        {
            x: xData,
            y: midData,
            mode: 'markers',
            marker: { color: '#8884d8', size: 8 },
            name: `Mid IV`,
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
                name: `Bid IV`,
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
                name: `Ask IV`,
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

    if (fitChecked) {
        plotData.push({
            x: fineX,
            y: interpolatedY,
            mode: 'lines',
            line: { color: '#FFD700', width: 2 },
            name: 'Interpolated Line',
            type: 'scatter',
            showlegend: false,
            hoverinfo: 'skip',
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
                        text: `${ticker.toUpperCase()}: $${S}  -  (${optionType.toUpperCase()}, Exp. ${expirationDate})`,
                        font: { color: '#fff' },
                    },
                    xaxis: {
                        title: 'Strike (K)',
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
                        l: 60,
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
