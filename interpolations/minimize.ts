interface MinimizeResult {
    x: number[];
    fun: number;
    nfev: number;
    nit: number;
    status: number;
    message: string;
}

/**
 * Perform bound-constrained minimization using the L-BFGS-B algorithm.
 *
 * @param {function} funcGrad - Function that computes the objective function and its gradient.
 * @param {number[]} x0 - Initial guess for the variables.
 * @param {Array<[number, number]>} bounds - Vector of pairs specifying the lower and upper bounds for each variable.
 * @param {number} [maxiter=15000] - Maximum number of iterations allowed.
 * @param {number} [ftol=1e-8] - Relative tolerance for the function value convergence criterion.
 * @param {number} [gtol=1e-5] - Tolerance for the gradient norm convergence criterion.
 * @returns {MinimizeResult} - The result of the optimization, including the solution, function value, and status.
 */
export function minimize(
    funcGrad: (x: number[], grad: number[]) => number,
    x0: number[],
    bounds: Array<[number, number]>,
    maxiter = 15000,
    ftol = 1e-8,
    gtol = 1e-5
): MinimizeResult {
    const n = x0.length;
    let x = [...x0];
    let grad = new Array(n).fill(0);
    let f: number = funcGrad(x, grad);

    const m = 10;
    let iter = 0;
    let nfev = 1;
    let status = 0;
    let message = "Optimization terminated successfully.";
    let prev_f = f;

    const s_list: number[][] = [];
    const y_list: number[][] = [];
    const rho_list: number[] = [];

    while (iter < maxiter) {
        let q = [...grad];
        const k = s_list.length;
        const alpha = new Array(k).fill(0);

        for (let i = k - 1; i >= 0; --i) {
            alpha[i] = rho_list[i] * dot(s_list[i], q);
            q = subtract(q, scale(y_list[i], alpha[i]));
        }

        let r = [...q];

        for (let i = 0; i < k; ++i) {
            const beta = rho_list[i] * dot(y_list[i], r);
            r = add(r, scale(s_list[i], alpha[i] - beta));
        }

        let p = scale(r, -1);

        for (let i = 0; i < n; ++i) {
            if (bounds[i][0] === bounds[i][1]) {
                p[i] = 0.0;
            } else {
                if (x[i] <= bounds[i][0] && p[i] < 0) p[i] = 0.0;
                if (x[i] >= bounds[i][1] && p[i] > 0) p[i] = 0.0;
            }
        }

        let alpha_step = 1.0;
        const c1 = 1e-4;
        const c2 = 0.9;
        const max_linesearch = 20;
        let success = false;
        let x_new = [...x];
        let f_new: number = f;
        let grad_new = new Array(n).fill(0);

        for (let ls_iter = 0; ls_iter < max_linesearch; ++ls_iter) {
            x_new = add(x, scale(p, alpha_step));

            for (let i = 0; i < n; ++i) {
                if (bounds[i][0] > -Infinity) x_new[i] = Math.max(x_new[i], bounds[i][0]);
                if (bounds[i][1] < Infinity) x_new[i] = Math.min(x_new[i], bounds[i][1]);
            }

            f_new = funcGrad(x_new, grad_new) ?? f_new;
            nfev++;

            if (f_new <= f + c1 * alpha_step * dot(grad, p)) {
                if (dot(grad_new, p) >= c2 * dot(grad, p)) {
                    success = true;
                    break;
                }
            }

            alpha_step *= 0.5;
        }

        if (!success) {
            status = 1;
            message = "Line search failed.";
            break;
        }

        const s = subtract(x_new, x);
        const y = subtract(grad_new, grad);
        const ys = dot(y, s);

        if (ys > 1e-10) {
            if (s_list.length === m) {
                s_list.shift();
                y_list.shift();
                rho_list.shift();
            }
            s_list.push([...s]);
            y_list.push([...y]);
            rho_list.push(1.0 / ys);
        }

        x = [...x_new];
        f = f_new;
        grad = [...grad_new];

        if (Math.max(...grad.map(Math.abs)) < gtol) {
            status = 0;
            message = "Optimization terminated successfully (gtol).";
            break;
        }

        if (Math.abs(f - prev_f) < ftol * (1.0 + Math.abs(f))) {
            status = 0;
            message = "Optimization terminated successfully (ftol).";
            break;
        }

        prev_f = f;
        iter++;
    }

    if (iter >= maxiter) {
        status = 1;
        message = "Maximum number of iterations exceeded.";
    }

    return {
        x: [...x],
        fun: f,
        nfev,
        nit: iter,
        status,
        message,
    };
}

/**
 * Perform dot product of two vectors.
 *
 * @param {number[]} a - First vector.
 * @param {number[]} b - Second vector.
 * @returns {number} - The dot product of vectors `a` and `b`.
 */
function dot(a: number[], b: number[]): number {
    return a.reduce((sum, ai, i) => sum + ai * b[i], 0);
}

/**
 * Element-wise addition of two vectors.
 *
 * @param {number[]} a - First vector.
 * @param {number[]} b - Second vector.
 * @returns {number[]} - Resultant vector after adding `a` and `b` element-wise.
 */
function add(a: number[], b: number[]): number[] {
    return a.map((ai, i) => ai + b[i]);
}

/**
 * Element-wise subtraction of two vectors.
 *
 * @param {number[]} a - First vector.
 * @param {number[]} b - Second vector.
 * @returns {number[]} - Resultant vector after subtracting `b` from `a` element-wise.
 */
function subtract(a: number[], b: number[]): number[] {
    return a.map((ai, i) => ai - b[i]);
}

/**
 * Element-wise scaling of a vector by a scalar value.
 *
 * @param {number[]} a - Vector to be scaled.
 * @param {number} scalar - Scalar multiplier.
 * @returns {number[]} - Scaled vector.
 */
function scale(a: number[], scalar: number): number[] {
    return a.map((ai) => ai * scalar);
}
