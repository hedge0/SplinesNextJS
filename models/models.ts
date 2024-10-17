/**
 * Approximation of the error function (erf) using a high-precision method.
 *
 * @param {number} x - The input value.
 * @returns {number} - The calculated error function value.
 */
export function erf(x: number): number {
    const a1 = 0.254829592;
    const a2 = -0.284496736;
    const a3 = 1.421413741;
    const a4 = -1.453152027;
    const a5 = 1.061405429;
    const p = 0.3275911;

    const sign = x >= 0 ? 1 : -1;
    x = Math.abs(x);

    const t = 1.0 / (1.0 + p * x);
    const y =
        1.0 -
        ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) *
        t *
        Math.exp(-x * x);

    return sign * y;
}

/**
 * Approximation of the cumulative distribution function (CDF) for a standard normal distribution.
 *
 * @param {number} x - The input value.
 * @returns {number} - The CDF value.
 */
export function normal_cdf(x: number): number {
    return 0.5 * (1.0 + erf(x / Math.sqrt(2.0)));
}

/**
 * Calculate the price of an American option using the Barone-Adesi Whaley model with dividends.
 *
 * @param {number} S - Current stock price.
 * @param {number} K - Strike price of the option.
 * @param {number} T - Time to expiration in years.
 * @param {number} r - Risk-free interest rate.
 * @param {number} sigma - Implied volatility.
 * @param {number} q - Continuous dividend yield (default: 0.0).
 * @param {string} option_type - Type of option ('calls' or 'puts', default: 'calls').
 * @returns {number} - The calculated option price.
 */
export function barone_adesi_whaley_american_option_price(
    S: number,
    K: number,
    T: number,
    r: number,
    sigma: number,
    q = 0.0,
    option_type = 'calls'
): number {
    const M = (2 * (r - q)) / Math.pow(sigma, 2);
    const n = (2 * (r - q - 0.5 * Math.pow(sigma, 2))) / Math.pow(sigma, 2);
    const q2 = (-(n - 1) - Math.sqrt(Math.pow(n - 1, 2) + 4 * M)) / 2;

    const d1 = (Math.log(S / K) + (r - q + 0.5 * Math.pow(sigma, 2)) * T) / (sigma * Math.sqrt(T));
    const d2 = d1 - sigma * Math.sqrt(T);

    if (option_type === 'calls') {
        const european_price = S * Math.exp(-q * T) * normal_cdf(d1) - K * Math.exp(-r * T) * normal_cdf(d2);
        if (q >= r) return european_price;
        if (q2 < 0) return european_price;

        const S_critical = K / (1 - 1 / q2);
        if (S >= S_critical) {
            return S - K;
        } else {
            const A2 = (S_critical - K) * Math.pow(S_critical, -q2);
            return european_price + A2 * Math.pow(S / S_critical, q2);
        }
    } else if (option_type === 'puts') {
        const european_price = K * Math.exp(-r * T) * normal_cdf(-d2) - S * Math.exp(-q * T) * normal_cdf(-d1);
        if (q >= r) return european_price;
        if (q2 < 0) return european_price;

        const S_critical = K / (1 + 1 / q2);
        if (S <= S_critical) {
            return K - S;
        } else {
            const A2 = (K - S_critical) * Math.pow(S_critical, -q2);
            return european_price + A2 * Math.pow(S / S_critical, q2);
        }
    } else {
        throw new Error("option_type must be 'calls' or 'puts'.");
    }
}

/**
 * Calculate the implied volatility using the Barone-Adesi Whaley model with dividends.
 *
 * @param {number} option_price - Observed option price (mid-price).
 * @param {number} S - Current stock price.
 * @param {number} K - Strike price of the option.
 * @param {number} r - Risk-free interest rate.
 * @param {number} T - Time to expiration in years.
 * @param {number} [q=0.0] - Continuous dividend yield (optional, default: 0.0).
 * @param {string} [option_type='calls'] - Type of option ('calls' or 'puts', default: 'calls').
 * @param {number} [max_iterations=100] - Maximum number of iterations for the bisection method (default: 100).
 * @param {number} [tolerance=1e-8] - Convergence tolerance (default: 1e-8).
 * @returns {number} - The implied volatility.
 */
export function calculate_implied_volatility_baw(
    option_price: number,
    S: number,
    K: number,
    r: number,
    T: number,
    q = 0.0,
    option_type = 'calls',
    max_iterations = 100,
    tolerance = 1e-8
): number {
    let lower_vol = 1e-5;
    let upper_vol = 10.0;

    for (let i = 0; i < max_iterations; i++) {
        const mid_vol = (lower_vol + upper_vol) / 2;
        const price = barone_adesi_whaley_american_option_price(S, K, T, r, mid_vol, q, option_type);

        if (Math.abs(price - option_price) < tolerance) {
            return mid_vol;
        }

        if (price > option_price) {
            upper_vol = mid_vol;
        } else {
            lower_vol = mid_vol;
        }

        if (upper_vol - lower_vol < tolerance) {
            break;
        }
    }

    return (lower_vol + upper_vol) / 2;
}
