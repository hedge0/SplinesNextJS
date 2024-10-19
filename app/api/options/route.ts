import { NextResponse } from 'next/server';
import yahooFinance from 'yahoo-finance2';

/**
 * Handles the GET request to fetch the options chain for a given ticker symbol.
 * The function uses Yahoo Finance to retrieve the expiration dates of the options chain.
 *
 * @param {Request} request - The incoming request object containing the query parameter 'ticker'.
 * @returns {NextResponse} - A JSON response with the expiration dates of the options chain,
 *                           or an error message if the ticker is invalid or data could not be retrieved.
 * 
 * Possible responses:
 * - 200: Success, returns the expiration dates for the options chain.
 * - 400: No ticker provided in the query parameters.
 * - 500: Error fetching the options chain for the ticker.
 */
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const ticker = searchParams.get('ticker');

    if (!ticker) {
        return NextResponse.json({ error: 'No ticker provided' }, { status: 400 });
    }

    try {
        const optionsChain = await yahooFinance.options(ticker, {});

        const expirationDates = optionsChain.expirationDates.map((date: Date) => date.toISOString().split('T')[0]);

        return NextResponse.json({ expirationDates });
    } catch (error) {
        return NextResponse.json({ error: `Error fetching options chain for ${ticker}` }, { status: 500 });
    }
}
