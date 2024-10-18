import { NextResponse } from 'next/server';

const API_KEY = process.env.FRED_API_KEY;

export async function GET() {
    const url = `https://api.stlouisfed.org/fred/series/observations?series_id=SOFRRATE&api_key=${API_KEY}&file_type=json`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        return NextResponse.json({ data });
    } catch (error) {
        return NextResponse.json({ error: 'Error fetching SOFR data' }, { status: 500 });
    }
}
