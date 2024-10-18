import { minimize } from './minimize';
import * as math from 'mathjs';

export class Interpolations {

    /**
     * Objective function for model fitting, calculates the weighted sum of squared residuals.
     *
     * @param {number[]} params - Model parameters.
     * @param {number[]} k - Log-moneyness of the options.
     * @param {number[]} y_mid - Mid prices of the options.
     * @param {number[]} y_bid - Bid prices of the options.
     * @param {number[]} y_ask - Ask prices of the options.
     * @param {function} model - Volatility model function.
     * @returns {number} - Weighted sum of squared residuals.
     */
    static objective_function(
        params: number[],
        k: number[],
        y_mid: number[],
        y_bid: number[],
        y_ask: number[],
        model: (k: number[], params: number[]) => number[]
    ): number {
        const spread = math.subtract(y_ask, y_bid) as number[];
        const epsilon = 1e-8;
        const weights = spread.map((val) => 1 / (val + epsilon));
        const model_values = model(k, params);
        const residuals = model_values.map((val, idx) => val - y_mid[idx]);
        const residuals_squared = residuals.map((val) => val * val);
        const weighted_residuals = weights.map((weight, idx) => weight * residuals_squared[idx]);

        return math.sum(weighted_residuals) as number;
    }

    /**
     * RFV model function.
     *
     * @param {number[]} k - Log-moneyness of the options.
     * @param {number[]} params - Parameters [a, b, c, d, e] for the RFV model.
     * @returns {number[]} - The calculated RFV model values.
     */
    static rfv_model(k: number[], params: number[]): number[] {
        const [a, b, c, d, e] = params;
        const numerator = k.map((val) => a + b * val + c * val ** 2);
        const denominator = k.map((val) => 1 + d * val + e * val ** 2);
        return numerator.map((num, idx) => num / denominator[idx]);
    }

    /**
     * SLV model function.
     *
     * @param {number[]} k - Log-moneyness of the options.
     * @param {number[]} params - Parameters [a, b, c, d, e] for the SLV model.
     * @returns {number[]} - The calculated SLV model values.
     */
    static slv_model(k: number[], params: number[]): number[] {
        const [a, b, c, d, e] = params;
        return k.map((val) => a + b * val + c * val ** 2 + d * val ** 3 + e * val ** 4);
    }

    /**
     * SABR model function.
     *
     * @param {number[]} k - Log-moneyness of the options.
     * @param {number[]} params - Parameters [alpha, beta, rho, nu, f0] for the SABR model.
     * @returns {number[]} - The calculated SABR model values.
     */
    static sabr_model(k: number[], params: number[]): number[] {
        const [alpha, beta, rho, nu, f0] = params;
        return k.map((val) => alpha * (1 + beta * val + rho * val ** 2 + nu * val ** 3 + f0 * val ** 4));
    }

    /**
     * SVI model function.
     *
     * @param {number[]} k - Log-moneyness of the options.
     * @param {number[]} params - Parameters [a, b, rho, m, sigma] for the SVI model.
     * @returns {number[]} - The calculated SVI model values.
     */
    static svi_model(k: number[], params: number[]): number[] {
        const [a, b, rho, m, sigma] = params;
        return k.map(val => a + b * (rho * (val - m) + Math.sqrt((val - m) ** 2 + sigma ** 2)));
    }

    /**
     * Fit the selected volatility model to the market data.
     *
     * @param {number[]} x - Strikes of the options.
     * @param {number[]} y_mid - Mid prices of the options.
     * @param {number[]} y_bid - Bid prices of the options.
     * @param {number[]} y_ask - Ask prices of the options.
     * @param {'RFV' | 'SLV' | 'SABR' | 'SVI'} selectedModel - The chosen model for fitting.
     * @returns {number[]} - The optimized parameters.
     */
    static fit_model(
        x: number[],
        y_mid: number[],
        y_bid: number[],
        y_ask: number[],
        selectedModel: 'RFV' | 'SLV' | 'SABR' | 'SVI'
    ): number[] {
        const k = x.map((val) => Math.log(val));
        const initial_guess = [0.2, 0.3, 0.1, 0.2, 0.1];
        const bounds: Array<[number, number]> = Array(5).fill([-Infinity, Infinity]);

        const model = {
            'RFV': Interpolations.rfv_model,
            'SLV': Interpolations.slv_model,
            'SABR': Interpolations.sabr_model,
            'SVI': Interpolations.svi_model,
        }[selectedModel];

        const func_grad = (params: number[], grad: number[]): number => {
            const f = Interpolations.objective_function(params, k, y_mid, y_bid, y_ask, model);

            const epsilon = 1e-8;
            const n_params = params.length;
            for (let i = 0; i < n_params; ++i) {
                const params_eps = [...params];
                params_eps[i] += epsilon;
                const f_eps = Interpolations.objective_function(params_eps, k, y_mid, y_bid, y_ask, model);
                grad[i] = (f_eps - f) / epsilon;
            }
            return f;
        };

        const result = minimize(func_grad, initial_guess, bounds);

        if (result.status !== 0) {
            console.error("Optimization failed:", result.message);
        }

        return result.x;
    }
}
