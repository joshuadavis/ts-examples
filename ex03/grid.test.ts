import Grid, {DEFAULT_HEIGHT, DEFAULT_WIDTH} from "./grid"

test("Height and width defaults", () => {
    const grid = new Grid();
    expect(grid.width).toBe(DEFAULT_WIDTH);
    expect(grid.height).toBe(DEFAULT_HEIGHT);
    expect(grid.size).toBe(DEFAULT_WIDTH * DEFAULT_HEIGHT)
})

test("Test specific height and width", () => {
    const grid = new Grid(140, 70)
    expect(grid.width).toBe(140);
    expect(grid.height).toBe(70);
    expect(grid.size).toBe(140 * 70);
})

test("Check loc_row and loc_col", () => {
    const grid = new Grid();
    expect(grid.loc_col(10)).toBe(10)
    expect(grid.loc_row(10)).toBe(0)
    expect(grid.rc_loc(0,10)).toBe(10)
    expect(grid.loc_col(110)).toBe(10)
    expect(grid.loc_row(110)).toBe(1)
    expect(grid.rc_loc(1, 10)).toBe(110)
})

test("Check dist", () => {
    const grid = new Grid();
    expect(grid.dist(grid.rc_loc(0, 0), grid.rc_loc(5, 5))).toBe(5)
    expect(grid.dist(grid.rc_loc(0, 0), grid.rc_loc(5, 10))).toBe(10)
})
