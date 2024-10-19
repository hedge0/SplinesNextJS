import { Box, Typography, ListItem, ListItemText } from '@mui/material';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

/**
 * Models component that displays information about various financial models with corresponding mathematical formulas.
 * Uses KaTeX to render math equations.
 *
 * @returns {JSX.Element} - The rendered component displaying different models.
 */
export default function Models() {
    return (
        <Box className="bg-gray-700 rounded-lg shadow-lg p-6">
            <Typography variant="h5" sx={{ color: 'white', marginBottom: 2, textAlign: 'center' }}>
                Overview of Volatility Models
            </Typography>
            <Typography variant="body1" sx={{ color: 'white', marginBottom: 3 }}>
                In financial markets, various models are used to capture and interpolate the implied volatility surfaces
                across different strike prices and maturities. These models provide a framework for estimating the prices
                of options based on the volatility smile and are essential tools for traders, quants, and analysts. The
                models below—RFV, SLV, SABR, and SVI—are some of the commonly used models for such purposes, each with
                its own structure, assumptions, and parameters.
            </Typography>
            <Box display="flex" alignItems="center">
                <ListItem sx={{ width: 'auto', padding: 0 }}>
                    <ListItemText primary="•" sx={{ color: 'white', marginRight: '8px' }} />
                </ListItem>
                <Typography variant="h6" sx={{ color: 'white', marginBottom: 1 }}>
                    RFV Model
                </Typography>
            </Box>
            <Box sx={{ marginLeft: '24px' }}>
                <Typography variant="body1" sx={{ color: 'white', marginBottom: 2 }}>
                    The RFV (Rational Function Volatility) model is a flexible model designed for interpolation of volatility smiles. It is particularly useful for fitting implied volatility surfaces where simplicity and computational efficiency are desired. The model represents the implied volatility as a rational function of log-moneyness, making it adaptable to various market conditions and different strike prices. It is parameterized by five variables: <InlineMath>a</InlineMath>, <InlineMath>b</InlineMath>, <InlineMath>c</InlineMath>, <InlineMath>d</InlineMath>, and <InlineMath>e</InlineMath>.
                </Typography>
                <Typography variant="body2" sx={{ color: 'white' }}>
                    The formula for the RFV model is:
                </Typography>
                <BlockMath math={`\\text{RFV}(k) = \\frac{a + b \\cdot k + c \\cdot k^2}{1 + d \\cdot k + e \\cdot k^2}`} />
                <Typography variant="body2" sx={{ color: 'white', marginTop: 2 }}>
                    where:
                </Typography>
                <Typography variant="body2" sx={{ color: 'white', marginBottom: 3 }}>
                    - <InlineMath>k</InlineMath> is the log-moneyness <br />
                    - <InlineMath>a</InlineMath>, <InlineMath>b</InlineMath>, <InlineMath>c</InlineMath>, <InlineMath>d</InlineMath>, and <InlineMath>e</InlineMath> are model parameters.
                </Typography>
            </Box>
            <Box display="flex" alignItems="center">
                <ListItem sx={{ width: 'auto', padding: 0 }}>
                    <ListItemText primary="•" sx={{ color: 'white', marginRight: '8px' }} />
                </ListItem>
                <Typography variant="h6" sx={{ color: 'white', marginBottom: 1 }}>
                    SLV Model
                </Typography>
            </Box>
            <Box sx={{ marginLeft: '24px' }}>
                <Typography variant="body1" sx={{ color: 'white', marginBottom: 2 }}>
                    The SLV (Simple Linear Volatility) model represents the implied volatility surface using a polynomial function with log-moneyness. This model is ideal for simpler markets where volatility behavior is smooth and can be well-approximated by a polynomial curve, making it a popular choice in less volatile markets. The model uses parameters <InlineMath>a</InlineMath>, <InlineMath>b</InlineMath>, <InlineMath>c</InlineMath>, <InlineMath>d</InlineMath>, and <InlineMath>e</InlineMath> to describe the curvature.
                </Typography>
                <Typography variant="body2" sx={{ color: 'white' }}>
                    The formula for the SLV model is:
                </Typography>
                <BlockMath math={`\\text{SLV}(k) = a + b \\cdot k + c \\cdot k^2 + d \\cdot k^3 + e \\cdot k^4`} />
                <Typography variant="body2" sx={{ color: 'white', marginTop: 2 }}>
                    where:
                </Typography>
                <Typography variant="body2" sx={{ color: 'white', marginBottom: 3 }}>
                    - <InlineMath>k</InlineMath> is the log-moneyness <br />
                    - <InlineMath>a</InlineMath>, <InlineMath>b</InlineMath>, <InlineMath>c</InlineMath>, <InlineMath>d</InlineMath>, and <InlineMath>e</InlineMath> are model parameters.
                </Typography>
            </Box>
            <Box display="flex" alignItems="center">
                <ListItem sx={{ width: 'auto', padding: 0 }}>
                    <ListItemText primary="•" sx={{ color: 'white', marginRight: '8px' }} />
                </ListItem>
                <Typography variant="h6" sx={{ color: 'white', marginBottom: 1 }}>
                    SABR Model
                </Typography>
            </Box>
            <Box sx={{ marginLeft: '24px' }}>
                <Typography variant="body1" sx={{ color: 'white', marginBottom: 2 }}>
                    The SABR (Stochastic Alpha Beta Rho) model is a well-established model in financial markets for pricing options. It is particularly popular in interest rate derivatives and FX markets. The model assumes that the asset&apos;s volatility follows a stochastic process, making it suitable for markets where volatility dynamics are complex and driven by random factors. The SABR model has been widely adopted due to its ability to capture the volatility smile in options pricing, using parameters like <InlineMath>alpha</InlineMath>, <InlineMath>beta</InlineMath>, <InlineMath>rho</InlineMath>, <InlineMath>nu</InlineMath>, and <InlineMath>f_0</InlineMath>.
                </Typography>
                <Typography variant="body2" sx={{ color: 'white' }}>
                    The formula for the SABR model is:
                </Typography>
                <BlockMath math={`\\text{SABR}(k) = \\alpha \\cdot (1 + \\beta \\cdot k + \\rho \\cdot k^2 + \\nu \\cdot k^3 + f_0 \\cdot k^4)`} />
                <Typography variant="body2" sx={{ color: 'white', marginTop: 2 }}>
                    where:
                </Typography>
                <Typography variant="body2" sx={{ color: 'white', marginBottom: 3 }}>
                    - <InlineMath>k</InlineMath> is the log-moneyness <br />
                    - <InlineMath>alpha</InlineMath>, <InlineMath>beta</InlineMath>, <InlineMath>rho</InlineMath>, <InlineMath>nu</InlineMath>, and <InlineMath>f_0</InlineMath> are model parameters.
                </Typography>
            </Box>
            <Box display="flex" alignItems="center">
                <ListItem sx={{ width: 'auto', padding: 0 }}>
                    <ListItemText primary="•" sx={{ color: 'white', marginRight: '8px' }} />
                </ListItem>
                <Typography variant="h6" sx={{ color: 'white', marginBottom: 1 }}>
                    SVI Model
                </Typography>
            </Box>
            <Box sx={{ marginLeft: '24px' }}>
                <Typography variant="body1" sx={{ color: 'white', marginBottom: 2 }}>
                    The SVI (Stochastic Volatility Inspired) model is one of the most widely used models for fitting implied volatility surfaces, particularly in equity and commodity markets. Its popularity stems from its ability to accurately capture the volatility smile using a relatively simple five-parameter form. The SVI model is highly flexible and can model complex volatility behavior across different strike prices. Its parameters—<InlineMath>a</InlineMath>, <InlineMath>b</InlineMath>, <InlineMath>rho</InlineMath>, <InlineMath>m</InlineMath>, and <InlineMath>sigma</InlineMath>—allow traders to easily calibrate the model to market data, making it an industry standard.
                </Typography>
                <Typography variant="body2" sx={{ color: 'white' }}>
                    The formula for the SVI model is:
                </Typography>
                <BlockMath math={`\\text{SVI}(k) = a + b \\cdot (\\rho \\cdot (k - m) + \\sqrt{(k - m)^2 + \\sigma^2})`} />
                <Typography variant="body2" sx={{ color: 'white', marginTop: 2 }}>
                    where:
                </Typography>
                <Typography variant="body2" sx={{ color: 'white', marginBottom: 3 }}>
                    - <InlineMath>k</InlineMath> is the log-moneyness <br />
                    - <InlineMath>a</InlineMath>, <InlineMath>b</InlineMath>, <InlineMath>rho</InlineMath>, <InlineMath>m</InlineMath>, and <InlineMath>sigma</InlineMath> are model parameters.
                </Typography>
            </Box>
            <Typography variant="h5" sx={{ color: 'white', marginTop: 6, marginBottom: 2, textAlign: 'center' }}>
                Overview of Pricing Models
            </Typography>
            <Typography variant="body1" sx={{ color: 'white', marginBottom: 3 }}>
                Pricing models are essential for determining the fair value of options, incorporating factors such as the
                stock price, strike price, time to expiration, volatility, and dividend yield. These models allow traders
                to evaluate American options with early exercise features.
            </Typography>
            <Box display="flex" alignItems="center">
                <ListItem sx={{ width: 'auto', padding: 0 }}>
                    <ListItemText primary="•" sx={{ color: 'white', marginRight: '8px' }} />
                </ListItem>
                <Typography variant="h6" sx={{ color: 'white', marginBottom: 1 }}>
                    Barone-Adesi Whaley
                </Typography>
            </Box>
            <Box sx={{ marginLeft: '24px' }}>
                <Typography variant="body1" sx={{ color: 'white', marginBottom: 2 }}>
                    The Barone-Adesi Whaley model is used for pricing American options, accounting for dividends and early exercise.
                    It approximates the price of an American option and adjusts the classic Black-Scholes model to handle
                    dividend-paying assets.
                </Typography>
                <Typography variant="body2" sx={{ color: 'white' }}>
                    The formula for the Barone-Adesi Whaley model (for calls) is:
                </Typography>
                <BlockMath math={`\\text{Price}_{calls} = S \\cdot e^{-qT} \\cdot N(d_1) - K \\cdot e^{-rT} \\cdot N(d_2)`} />
                <Typography variant="body2" sx={{ color: 'white', marginTop: 2 }}>
                    and for puts is:
                </Typography>
                <BlockMath math={`\\text{Price}_{puts} = K \\cdot e^{-rT} \\cdot N(-d_2) - S \\cdot e^{-qT} \\cdot N(-d_1)`} />
                <Typography variant="body2" sx={{ color: 'white', marginTop: 2 }}>
                    where:
                </Typography>
                <Typography variant="body2" sx={{ color: 'white', marginBottom: 3 }}>
                    - <InlineMath>S</InlineMath> is the current stock price <br />
                    - <InlineMath>K</InlineMath> is the strike price <br />
                    - <InlineMath>T</InlineMath> is the time to expiration <br />
                    - <InlineMath>r</InlineMath> is the risk-free interest rate <br />
                    - <InlineMath>q</InlineMath> is the continuous dividend yield <br />
                    - <InlineMath>N()</InlineMath> represents the cumulative normal distribution function.
                </Typography>
            </Box>
        </Box>
    );
}
