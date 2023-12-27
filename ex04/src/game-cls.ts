import Grid from "./grid";
import {CityInfo, RealMap, ViewMap, win_t} from "./types";
import {PieceInfo, PieceInfoOrNull} from "./piece";
import {isqrt, seed_rand, irand} from "./math";

const DEFAULT_SMOOTH = 5
const DEFAULT_WATER_RATIO = 70

export default class Game {
    grid: Grid
    smooth: number
    waterRatio: number
    numCity: number     // computed
    minCityDist: number // computed
    irand: (max: number) => number

    // Used to place cities
    land: number[] = []
    city: CityInfo[] = []

    automove: boolean = false
    resigned: boolean = false
    debug: boolean = false
    print_debug: boolean = false
    print_vmap: boolean = false
    trace_pmap: boolean = false
    save_movie: boolean = false
    win: win_t = win_t.no_win
    date: number = 0
    user_score: number = 0
    comp_score: number = 0
    real_map: RealMap[] = []
    user_map: ViewMap[] = []
    comp_map: ViewMap[] = []
    user_obj: PieceInfoOrNull[] = []
    comp_obj: PieceInfoOrNull[] = []
    object: PieceInfo[] = []
    free_list: PieceInfoOrNull = null

    constructor(grid: Grid,
                seed: number,
                smooth: number = DEFAULT_SMOOTH,
                waterRatio: number = DEFAULT_WATER_RATIO) {
        this.grid = grid
        // Create a pseudo-random function based on the seed.
        let rand_fun = seed_rand(seed)
        // Wrap it with 'irand' (integer random) behavior.
        this.irand = (high: number): number => {
            return irand(high, rand_fun)
        }
        this.smooth = smooth
        this.waterRatio = waterRatio

        this.numCity = Math.floor((100 * (this.grid.width + this.grid.height)) / 228)
        let land = this.grid.size * (100 - this.waterRatio) / 100  /* Available land */
        land /= this.numCity /* land per city */
        this.minCityDist = isqrt(land) /* distance between cities */
    }


    get real_map_rows() {
        let output: string[] = []
        let prev_row = 0
        let row_string = ""
        for (let i = 0; i < this.grid.size; i++) {
            let row = this.grid.loc_row(i)
            if (row != prev_row) {
                output.push(row_string);
                row_string = ""
                prev_row = row;
            }
            row_string += this.real_map[i].contents
        }
        return output;
    }
}