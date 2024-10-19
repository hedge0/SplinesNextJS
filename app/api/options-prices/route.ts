import { NextResponse } from 'next/server';
import yahooFinance from 'yahoo-finance2';

/**
 * Handles the GET request to fetch options chain data for a given ticker symbol.
 * The function retrieves the options chain with an optional expiration date and filters 
 * it based on the option type (either "calls" or "puts").
 *
 * @param {Request} request - The incoming request containing 'ticker', 'expirationDate', and 'optionType'.
 * @returns {NextResponse} - A JSON response with the filtered options (calls or puts), or an error message.
 * 
 * Possible responses:
 * - 200: Success, returns the filtered options chain data.
 * - 400: Invalid request parameters, including missing ticker or invalid option type.
 * - 404: No options available for the provided ticker and date.
 * - 500: Error fetching the options chain.
 */
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const ticker = searchParams.get('ticker');
    const expirationDate = searchParams.get('expirationDate');
    const optionType = searchParams.get('optionType');

    if (!ticker) {
        return NextResponse.json({ error: 'No ticker provided' }, { status: 400 });
    }

    if (optionType !== 'calls' && optionType !== 'puts') {
        return NextResponse.json({ error: 'Invalid or missing option type. Must be "calls" or "puts".' }, { status: 400 });
    }

    try {
        const optionsChain = await yahooFinance.options(ticker, {
            date: expirationDate ? new Date(expirationDate) : undefined,
        });

        if (!optionsChain.options || optionsChain.options.length === 0) {
            return NextResponse.json({ error: 'No options available for the provided ticker and date.' }, { status: 404 });
        }

        const firstOptionsEntry = optionsChain.options[0];
        const filteredOptions = firstOptionsEntry[optionType] || [];

        return NextResponse.json({ options: filteredOptions });

    } catch (error) {
        return NextResponse.json({ error: `Error fetching options chain for ${ticker}` }, { status: 500 });
    }
}
