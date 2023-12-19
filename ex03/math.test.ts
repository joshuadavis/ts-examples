import {irand, isqrt, seed_rand} from "./math"

test("irand produces even random number distribution", () => {
    let counts : number[] = []
    const iterations = 100000;
    const maxValue = 10;
    for(let i = 0; i < iterations; i++) {
        const num = irand(maxValue);
        counts[num] = (counts[num] || 0) + 1;
    }

    // There should be somewhere around iterations/maxValue
    // in each bucket.
    let avg = iterations / maxValue

    for (let i = 0; i < counts.length; i++) {
        const count = counts[i];
        let diff = Math.abs(count - avg)/avg
        expect(diff).toBeLessThan(0.2)
    }
})

test("seed_rand returns consistent values for a given seed", () => {
    let rand = seed_rand(1234)
    expect(rand()).toBeCloseTo(0.4115697873799726);
    expect(rand()).toBeCloseTo(0.21881901892828634);
    expect(rand()).toBeCloseTo(0.22953103566529492);
    expect(rand()).toBeCloseTo(0.07948388203017832);
    expect(rand()).toBeCloseTo(0.4909079218106996);
    expect(rand()).toBeCloseTo(0.14590192043895747);
})

test("isqrt does some square-rooty thing", () => {
    expect(isqrt(4)).toBe(2);
    expect(isqrt(9)).toBe(3);
    expect(isqrt(16)).toBe(4);
    expect(isqrt(25)).toBe(5);
    expect(isqrt(36)).toBe(6);
})
