import { NextResponse } from 'next/server';
import yahooFinance from 'yahoo-finance2';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const ticker = searchParams.get('ticker');

    if (!ticker) {
        return NextResponse.json({ error: 'No ticker provided' }, { status: 400 });
    }

    try {
        const quote = await yahooFinance.quote(ticker);

        return NextResponse.json({ quote });
    } catch (error) {
        return NextResponse.json({ error: 'Error fetching price for ' + ticker }, { status: 500 });
    }
}
