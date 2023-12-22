import Grid from "./grid";
import {isqrt, seed_rand, irand} from "./math";

export class RealMap {
    contents: string
    onBoard: boolean
    city: object | null
    piece: object | null

    constructor(contents: string) {
        this.contents = contents
        this.city = null
        this.piece = null
        this.onBoard = true
    }
}

enum Func {
    NOFUNC = -1
}

export const UNOWNED = 0

const NOPIECE = "?"

enum Piece {
    ARMY = 0,
    FIGHTER = 1,
    PATROL = 2,
    DESTROYER = 3,
    SUBMARINE = 4,
    TRANSPORT = 5,
    CARRIER = 6,
    BATTLESHIP = 7,
    SATELLITE = 8
}

export const NUM_OBJECTS = Object.keys(Piece).length

export class CityInfo {
    loc: number
    owner: number
    func: Func[]
    work: number
    prod: string

    constructor(loc: number) {
        this.loc = loc
        this.owner = UNOWNED
        this.func = Array(NUM_OBJECTS).fill(Func.NOFUNC)
        this.work = 0
        this.prod = NOPIECE
    }
}

const DEFAULT_SMOOTH = 5
const DEFAULT_WATER_RATIO = 70

export const MAP_LAND = "+"
export const MAP_SEA = "."
export const MAP_CITY = "*"

export class MapConfig {
    grid: Grid
    smooth: number
    waterRatio: number
    numCity: number     // computed
    minCityDist: number // computed
    irand: (max: number) => number

    // Used to place cities
    land: number[] = []
    city: CityInfo[] = []
    real_map: RealMap[] = []

    constructor(grid : Grid,
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

        this.numCity = Math.floor( (100 * (this.grid.width + this.grid.height)) / 228 )
        let land = this.grid.size * (100 - this.waterRatio) / 100  /* Available land */
        land /= this.numCity /* land per city */
        this.minCityDist = isqrt(land) /* distance between cities */
    }

    get size() {
        return this.grid.size
    }

    get width() {
        return this.grid.width
    }

    get height() {
        return this.grid.height
    }

    get dirOffset() {
        return this.grid.dirOffset
    }
}
