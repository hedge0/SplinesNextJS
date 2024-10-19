import { NextResponse } from 'next/server';
import yahooFinance from 'yahoo-finance2';

/**
 * Handles the GET request to fetch market price and dividend yield for a given ticker symbol.
 * The function uses Yahoo Finance to retrieve the stock quote data.
 *
 * @param {Request} request - The incoming request object containing the query parameter 'ticker'.
 * @returns {NextResponse} - A JSON response with the market price and dividend yield of the ticker,
 *                           or an error message if the ticker is invalid or data could not be retrieved.
 * 
 * Possible responses:
 * - 200: Success, returns the market price and dividend yield.
 * - 400: No ticker provided in the query parameters.
 * - 404: No data found for the provided ticker.
 * - 500: Error fetching the price and dividend for the ticker.
 */
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const ticker = searchParams.get('ticker');

    if (!ticker) {
        return NextResponse.json({ error: 'No ticker provided' }, { status: 400 });
    }

    try {
        const quote = await yahooFinance.quote(ticker);

        if (!quote) {
            return NextResponse.json({ error: `No data found for ticker: ${ticker}` }, { status: 404 });
        }

        const marketPrice = quote.regularMarketPrice;
        const dividendYield = quote.trailingAnnualDividendYield;

        return NextResponse.json({ marketPrice, dividendYield });
    } catch (error) {
        console.error('Error fetching data for', ticker, error);
        return NextResponse.json({ error: 'Error fetching price and dividend for ' + ticker }, { status: 500 });
    }
}
