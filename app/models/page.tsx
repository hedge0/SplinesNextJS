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
                    The SLV (Simple Linear Volatility) model is a polynomial model used to describe the implied volatility surface as a function of log-moneyness. This model is often employed when a simpler, more intuitive representation is needed, allowing for smooth fits across strike prices. The SLV model is ideal for scenarios where volatility behavior across strikes follows a polynomial pattern, often seen in less volatile or highly liquid markets. The parameters <InlineMath>a</InlineMath>, <InlineMath>b</InlineMath>, <InlineMath>c</InlineMath>, <InlineMath>d</InlineMath>, and <InlineMath>e</InlineMath> control the curvature of the implied volatility curve.
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
        </Box>
    );
}
