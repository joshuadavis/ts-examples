import {CityInfo, MAP_CITY, MAP_LAND, MAP_SEA, MapConfig, RealMap} from "./map";

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

export function place_cities(conf: MapConfig) {
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

const MAX_HEIGHT = 999

export function make_map(config: MapConfig) : RealMap[] {
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
