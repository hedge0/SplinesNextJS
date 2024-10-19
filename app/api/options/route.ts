import { NextResponse } from 'next/server';
import yahooFinance from 'yahoo-finance2';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const ticker = searchParams.get('ticker');

    if (!ticker) {
        return NextResponse.json({ error: 'No ticker provided' }, { status: 400 });
    }

    try {
        const optionsChain = await yahooFinance.options(ticker, {});

        // Convert Date objects to ISO strings and split off the time portion
        const expirationDates = optionsChain.expirationDates.map((date: Date) => date.toISOString().split('T')[0]);

        return NextResponse.json({ expirationDates });
    } catch (error) {
        return NextResponse.json({ error: `Error fetching options chain for ${ticker}` }, { status: 500 });
    }
}
