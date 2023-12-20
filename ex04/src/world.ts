
import {irand, isqrt, seed_rand} from "./math";
import Grid from "./grid"

const DEFAULT_SMOOTH = 5
const DEFAULT_WATER_RATIO = 70
const MAX_HEIGHT = 999
const MAP_LAND = "+"
const MAP_SEA = "."
const MAP_CITY = "*"

class RealMap {
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

const UNOWNED = 0

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

const NUM_OBJECTS = Object.keys(Piece).length

enum Func {
    NOFUNC = -1
}

class CityInfo {
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

class MapConfig {
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

function remove_land(conf: MapConfig, loc: number, num_land: number): number {
    let n = 0 /* nothing kept yet */
    for (let i = 0; i < num_land; i++) {
        if (conf.grid.dist(loc, conf.land[i]) >= conf.minCityDist) {
            conf.land[n] = conf.land[i]
            n++
        }
    }
    return n
}

function regen_land(conf: MapConfig, placed: number): number {
    let num_land = 0

    for(let i = 0; i < conf.size; i++) {
        if (conf.real_map[i].onBoard && conf.real_map[i].contents == MAP_LAND) {
            conf.land[num_land] = i
            num_land++
        }
    }

    if (placed > 0) {
        conf.minCityDist -= 1
        if (!(conf.minCityDist >= 0)) { throw new Error("minCityDist must be >= 0!") }
    }
    for (let i = 0; i < placed; i++) {
        num_land = remove_land(conf, conf.city[i].loc, num_land)
    }
    return num_land
}

function place_cities(conf: MapConfig) {
    console.log("place_cities " + conf.numCity)
    let num_land = 0
    let placed = 0
    while (placed < conf.numCity) {
        while (num_land == 0) num_land = regen_land(conf, placed)
        let i = conf.irand(num_land - 1) /* select random piece of land */
        let loc = conf.land[i]
        conf.city[placed] = new CityInfo(loc)
        // conf.city[placed].loc = loc
        // conf.city[placed].owner = UNOWNED
        // conf.city[placed].work = 0
        // conf.city[placed].prod = NOPIECE
        // for (let i = 0; i < NUM_OBJECTS; ) {
        //     conf.city[placed].func[i] = Func.NOFUNC /* no function */
        // }

        conf.real_map[loc].contents = MAP_CITY
        conf.real_map[loc].city = conf.city[placed]
        placed++

        /* Now remove any land too close to the selected land. */
        num_land = remove_land(conf, loc, num_land)
    }
}

function make_map(config: MapConfig) : RealMap[] {
    console.log("make_map " + config.height + "x" + config.width )
    let height: number[][] = [[], []]
    for (let i = 0; i < config.size; i++) {
        height[0][i] = config.irand(MAX_HEIGHT)
    }

    let sum = 0
    let from = 0
    let to = 1
    for (let i = 0; i < config.smooth; i++) {
        for (let j = 0; j < config.size; j++) {
            sum = height[from][j]
            for (let k = 0; k < 8; k++) {
                let loc = j + config.dirOffset[k]
                /* edges get smoothed in a wierd fashion */
                if (loc < 0 || loc >= config.size) loc = j;
                sum += height[from][loc]
            }
            height[to][j] = Math.floor(sum / 9)
        }
        // Swap to and from layers
        let tmp = to
        to = from
        from = tmp
    }

    let height_count : number[] = []

    // Count the # of cells at each height.
    for(let i = 0; i <= MAX_HEIGHT; i++) {
        height_count[i] = 0;
    }

    for(let i = 0; i < config.size; i++) {
        height_count[height[from][i]]++;
    }

    // Find the water line
    let waterline = MAX_HEIGHT
    sum = 0
    for (let i = 0; i <= MAX_HEIGHT; i++) {
        sum += height_count[i]
        if (sum * 100 / config.size > config.waterRatio && sum >= config.numCity) {
            waterline = i // This is the last height that is water
            break
        }
    }

    // Populate the 'real_map'
    let real_map : RealMap[] = []
    for (let i = 0; i < config.size; i++) {
        let r : RealMap | null = null
        if (height[from][i] > waterline)
            r = new RealMap(MAP_LAND)
        else
            r = new RealMap(MAP_SEA)
        let j = config.grid.loc_col(i)
        let k = config.grid.loc_row(i)
        r.onBoard = !(j == 0 || j == config.width - 1 || k == 0 || k == config.height - 1)
        real_map[i] = r
    }
    return real_map
}

export default class World {
    conf: MapConfig
    constructor(grid: Grid, seed: number) {
        this.conf = new MapConfig(grid, seed)
        this.conf.real_map = make_map(this.conf)
        place_cities(this.conf)
    }

    get real_map_rows() {
        let output : string[] = []
        let loc = 0
        let prev_row = 0
        let row_string = ""
        for (let i = 0 ; i < this.conf.size; i++) {
            let row = this.conf.grid.loc_row(i)
            if (row != prev_row) {
                output.push(row_string);
                row_string = ""
                prev_row = row;
            }
            row_string += this.conf.real_map[i].contents
        }
        return output;
    }
}
