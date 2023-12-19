import {seed_rand} from "./math";

export const DEFAULT_WIDTH = 100
export const DEFAULT_HEIGHT = 60

export default class Grid {

    width: number
    height: number
    size: number        // computed
    dirOffset: number[] // computed

    constructor(width: number = DEFAULT_WIDTH,
                height: number = DEFAULT_HEIGHT) {
        this.height = height
        this.width = width
        this.size = width * height
        this.dirOffset = [
            -this.width, /* north */
            -this.width + 1, /* northeast */
            1, /* east */
            this.width + 1, /* southeast */
            this.width, /* south */
            this.width - 1, /* southwest */
            -1, /* west */
            -this.width - 1 /* northwest */
        ]
    }

    loc_col(loc: number): number {
        return loc % this.width;
    }

    loc_row(loc: number): number {
        return Math.floor(loc / this.width)
    }

    rc_loc(row:number, col:number) {
        return row * this.width + col;
    }

    /**
     * Weird distance calculation
     *
     * @param {number} a - The 'location' of the first point in the grid.
     * @param {number} b - The 'location' of the second point in the grid.
     * @return {number} The distance between the two points in the grid (according the game)
     */
    dist(a: number, b: number): number {
        let ax = this.loc_row(a)
        let ay = this.loc_col(a)
        let bx = this.loc_row(b)
        let by = this.loc_col(b)
        return Math.max(Math.abs(ax - bx), Math.abs(ay - by))
    }
}
