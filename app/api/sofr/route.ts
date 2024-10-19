import { NextResponse } from 'next/server';

const API_KEY = process.env.FRED_API_KEY;

/**
 * Handles the GET request to fetch the latest SOFR (Secured Overnight Financing Rate) data from the FRED API.
 * The function retrieves the most recent observation and returns the rate as a decimal.
 *
 * @returns {NextResponse} - A JSON response with the latest SOFR rate or an error message if data could not be retrieved.
 * 
 * Possible responses:
 * - 200: Success, returns the latest SOFR rate.
 * - 404: No SOFR data available or no observations found.
 * - 500: Error fetching SOFR data from the API.
 */
export async function GET() {
    const url = `https://api.stlouisfed.org/fred/series/observations?series_id=SOFR&api_key=${API_KEY}&file_type=json`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data && data.observations && data.observations.length > 0) {
            const latestObservation = data.observations[data.observations.length - 1];
            return NextResponse.json({ rate: (latestObservation.value / 100) });
        } else {
            return NextResponse.json({ error: 'No SOFR data available' }, { status: 404 });
        }
    } catch (error) {
        return NextResponse.json({ error: 'Error fetching SOFR data' }, { status: 500 });
    }
}
