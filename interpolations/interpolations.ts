import { minimize } from './minimize';
import * as math from 'mathjs';

export class Interpolations {
    static objective_function(
        params: number[],
        k: number[],
        y_mid: number[],
        y_bid: number[],
        y_ask: number[]
    ): number {
        const spread = math.subtract(y_ask, y_bid) as number[];  // Ensure spread is an array of numbers
        const epsilon = 1e-8;

        // Element-wise division for weights
        const weights = spread.map((val) => 1 / (val + epsilon));

        // Calculate model values and residuals
        const model_values = Interpolations.rfv_model(k, params);
        const residuals = model_values.map((val, idx) => val - y_mid[idx]);  // Element-wise subtraction

        // Element-wise square of residuals and weight multiplication
        const residuals_squared = residuals.map((val) => val * val);
        const weighted_residuals = weights.map((weight, idx) => weight * residuals_squared[idx]);

        return math.sum(weighted_residuals) as number;  // Sum of weighted residuals
    }

    static rfv_model(k: number[], params: number[]): number[] {
        const [a, b, c, d, e] = params;

        // Calculate numerator and denominator element-wise using `map`
        const numerator = k.map((val) => a + b * val + c * val ** 2);
        const denominator = k.map((val) => 1 + d * val + e * val ** 2);

        // Element-wise division of numerator and denominator
        const result = numerator.map((num, idx) => num / denominator[idx]);

        return result;
    }

    static fit_model(
        x: number[],
        y_mid: number[],
        y_bid: number[],
        y_ask: number[]
    ): number[] {
        const k = x.map((val) => Math.log(val));

        const initial_guess = [0.2, 0.3, 0.1, 0.2, 0.1];
        const bounds: Array<[number, number]> = Array(5).fill([-Infinity, Infinity]);

        const func_grad = (params: number[], grad: number[]): number => {
            const f = Interpolations.objective_function(params, k, y_mid, y_bid, y_ask);

            const epsilon = 1e-8;
            const n_params = params.length;
            for (let i = 0; i < n_params; ++i) {
                const params_eps = [...params];
                params_eps[i] += epsilon;
                const f_eps = Interpolations.objective_function(params_eps, k, y_mid, y_bid, y_ask);
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
