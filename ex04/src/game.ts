import {LINK, PieceInfo} from "./piece";
import {CityInfo, MAP_CITY, MAP_LAND, MAP_SEA, NUM_OBJECTS, RealMap, UNOWNED, ViewMap, win_t} from "./types";
import Game from "./game-cls";

const MAX_HEIGHT = 999

export function make_map(game: Game) {
    console.log("make_map " + game.grid.height + "x" + game.grid.width )
    let height: number[][] = [[], []]
    for (let i = 0; i < game.grid.size; i++) {
        height[0][i] = game.irand(MAX_HEIGHT)
    }

    let sum = 0
    let from = 0
    let to = 1
    for (let i = 0; i < game.smooth; i++) {
        for (let j = 0; j < game.grid.size; j++) {
            sum = height[from][j]
            for (let k = 0; k < 8; k++) {
                let loc = j + game.grid.dirOffset[k]
                /* edges get smoothed in a wierd fashion */
                if (loc < 0 || loc >= game.grid.size) loc = j;
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

    for(let i = 0; i < game.grid.size; i++) {
        height_count[height[from][i]]++;
    }

    // Find the water line
    let waterline = MAX_HEIGHT
    sum = 0
    for (let i = 0; i <= MAX_HEIGHT; i++) {
        sum += height_count[i]
        if (sum * 100 / game.grid.size > game.waterRatio && sum >= game.numCity) {
            waterline = i // This is the last height that is water
            break
        }
    }

    // Populate the 'real_map'
    let real_map : RealMap[] = []
    for (let i = 0; i < game.grid.size; i++) {
        let r : RealMap | null = null
        if (height[from][i] > waterline)
            r = new RealMap(MAP_LAND)
        else
            r = new RealMap(MAP_SEA)
        let j = game.grid.loc_col(i)
        let k = game.grid.loc_row(i)
        r.on_board = !(j === 0 || j == game.grid.width - 1 || k === 0 || k === game.grid.height - 1)
        real_map[i] = r
    }
    game.real_map = real_map
}

function remove_land(conf: Game, loc: number, num_land: number): number {
    let n = 0 /* nothing kept yet */
    for (let i = 0; i < num_land; i++) {
        if (conf.grid.dist(loc, conf.land[i]) >= conf.minCityDist) {
            conf.land[n] = conf.land[i]
            n++
        }
    }
    return n
}

function regen_land(game: Game, placed: number): number {
    let num_land = 0

    for(let i = 0; i < game.grid.size; i++) {
        if (game.real_map[i].on_board && game.real_map[i].contents === MAP_LAND) {
            game.land[num_land] = i
            num_land++
        }
    }

    if (placed > 0) {
        game.minCityDist -= 1
        if (!(game.minCityDist >= 0)) { throw new Error("minCityDist must be >= 0!") }
    }
    for (let i = 0; i < placed; i++) {
        num_land = remove_land(game, game.city[i].loc, num_land)
    }
    return num_land
}


export function place_cities(game: Game) {
    console.log("place_cities " + game.numCity)
    let num_land = 0
    let placed = 0
    while (placed < game.numCity) {
        while (num_land === 0) num_land = regen_land(game, placed)
        let i = game.irand(num_land - 1) /* select random piece of land */
        let loc = game.land[i]
        game.city[placed] = new CityInfo(loc)
        // conf.city[placed].loc = loc
        // conf.city[placed].owner = UNOWNED
        // conf.city[placed].work = 0
        // conf.city[placed].prod = NOPIECE
        // for (let i = 0; i < NUM_OBJECTS; ) {
        //     conf.city[placed].func[i] = Func.NOFUNC /* no function */
        // }

        game.real_map[loc].contents = MAP_CITY
        game.real_map[loc].city = game.city[placed]
        placed++

        /* Now remove any land too close to the selected land. */
        num_land = remove_land(game, loc, num_land)
    }
}

const LIST_SIZE = 5000

function select_cities(game: Game): boolean {
    // TODO: Implement!
    return true
}

export function init_game(game: Game) {
    game.automove = false;
    game.resigned = false;
    game.debug = false;
    game.print_debug = false;
    game.print_vmap = false;
    game.trace_pmap = false;
    game.save_movie = false;
    game.win = win_t.no_win;
    game.date = 0; /* no date yet */
    game.user_score = 0;
    game.comp_score = 0;

    let MAP_SIZE = game.grid.size

    for (let i = 0; i < MAP_SIZE; i++) {
        game.user_map[i] = new ViewMap()
        game.user_map[i].contents = ' '; /* nothing seen yet */
        game.user_map[i].seen = 0;
        game.comp_map[i] = new ViewMap()
        game.comp_map[i].contents = ' ';
        game.comp_map[i].seen = 0;
    }

    for (let i = 0; i < NUM_OBJECTS; i++) {
        game.user_obj[i] = null;
        game.comp_obj[i] = null;
    }

    game.free_list = null; /* nothing free yet */

    for (let i = 0; i < LIST_SIZE; i++) { /* for each object */
        let obj =  new PieceInfo(i);
        obj.hits = 0; /* mark object as dead */
        obj.owner = UNOWNED;
        LINK (game, 'free_list', obj, 'piece_link');
    }

    make_map(game); /* make land and water */

    do {
        for (let i = 0; i < MAP_SIZE; i++) { /* remove cities */
            if (game.real_map[i].contents === MAP_CITY)
                game.real_map[i].contents = MAP_LAND; /* land */
        }
        place_cities(game); /* place cities on game.real_map */
    } while
        (!select_cities(game)); /* choose a city for each player */
}