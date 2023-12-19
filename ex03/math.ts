// Integer math functions

/**
 * Returns a random number generator function based on a seed value.
 * The function uses a very simple linear congruential method.
 *
 * @param {number} seed - The seed value used to generate the random number.
 * @return {function(): number} - The random number generator function.
 */
export function seed_rand(seed: number) : () => number {
    seed = Math.abs(seed);
    return function() : number {
        seed = (seed * 9301 + 49297) % 233280;
        return seed / 233280;
    }
}

/**
 * Generates a random integer between 0 and high (inclusive).
 *
 * @param {number} high - The upper bound of the random integer.
 * @param {function} rand - Optional. The custom random number generator function. Defaults to Math.random.
 * @returns {number} - A random integer between 0 and high (inclusive).
 */
export function irand(high: number, rand: () => number = Math.random): number {
    if (high < 2) {
        return 0
    }
    return Math.floor(rand() * (high + 1))
}

export function isqrt(n: number): number {
    let guess = 0;

    if (n <= 1) return n; /* do easy cases and avoid div by zero */

    guess = 2; /* gotta start somewhere */
    guess = (guess + n/guess) / 2;
    guess = (guess + n/guess) / 2;
    guess = (guess + n/guess) / 2;
    guess = (guess + n/guess) / 2;
    guess = (guess + n/guess) / 2;

    guess = Math.floor(guess)

    if (guess * guess > n) guess -= 1; /* take floor */

    return guess
}
