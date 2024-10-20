# SplinesNextJS Application

This is a **Next.js** application designed to fetch and display financial quote data for options in an interactive chart format. Users can enter a stock ticker, select an option's expiration date, and choose between calls or puts. The app then fetches real-time financial data and displays implied volatilities for bid, ask, and mid prices in a dynamic chart.

## Features

- Real-time data fetching for stock prices and options.
- Implied volatility calculations using the **Barone-Adesi Whaley** method.
- Interactive plotting of bid, ask, and mid implied volatilities.
- Interpolation options using models like **RFV**, **SLV**, **SABR**, and **SVI**.
- Responsive UI built with **Material-UI** and **Plotly.js** for charts.
- Full support for **Next.js** features such as client-side rendering and dynamic imports.

## Getting Started

### Prerequisites

Make sure you have **Node.js** installed on your system. This project uses `npm`, but it can also be run with `yarn`, `pnpm`, or `bun`.

### Install Dependencies

Run the following command to install the required packages:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

The app will be available at [http://localhost:3000](http://localhost:3000) after running the development server. To start the development server, use the following command:

```bash
npm run dev
```

## Usage

1. Enter a stock ticker symbol.
2. Select an expiration date for the options.
3. Choose between calls or puts.
4. Click on "Enter" to see the implied volatility chart for the selected option.

The chart displays:
- **Bid IV** (Implied Volatility for Bid Prices)
- **Mid IV** (Implied Volatility for Mid Prices)
- **Ask IV** (Implied Volatility for Ask Prices)

You can also apply filtering for penny options and strike filtering.

## Environment Variables

Make sure to set up the following environment variables in a `.env` file at the root of the project:

```env
FRED_API_KEY=your_fred_api_key
```

This key is used to fetch financial data, such as the risk-free rate, for implied volatility calculations.

## Technologies Used

- **Next.js**: For server-side rendering and static generation.
- **React**: For building the user interface.
- **Material-UI**: For the modern and responsive design.
- **Plotly.js**: For interactive charting and plotting.
- **Luxon**: For date and time manipulation.
- **Yahoo Finance API**: For fetching real-time financial data.

## Learn More

To learn more about **Next.js**, check out the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - An interactive Next.js tutorial.

## Deploying the Application

You can easily deploy this application using [Vercel](https://vercel.com), the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
