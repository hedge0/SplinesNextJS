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

        return NextResponse.json(optionsChain);
    } catch (error) {
        return NextResponse.json({ error: `Error fetching options chain for ${ticker}` }, { status: 500 });
    }
}
