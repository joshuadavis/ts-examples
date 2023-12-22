import Grid from "./grid"
import {MapConfig, NUM_OBJECTS} from "./map"
import {make_map, place_cities} from "./land"
import {ViewMap} from "./view"
import {LINK, PieceInfo, PieceInfoOrNull} from "./piece";

class CitySelector {
    marked: number[]

    constructor(conf: MapConfig) {
        this.marked = Array(conf.size).fill(0);
    }
}

function select_cities(conf: MapConfig) {
    const citySelector = new CitySelector(conf);

    // TODO: Implement this...
}

const LIST_SIZE = 5000

export default class World {
    conf: MapConfig
    user_map: ViewMap[] = []
    comp_map: ViewMap[] = []
    user_obj: PieceInfoOrNull[] = []
    comp_obj: PieceInfoOrNull[] = []
    object: PieceInfo[] = []
    free_list: PieceInfoOrNull = null

    constructor(grid: Grid, seed: number) {
        this.conf = new MapConfig(grid, seed)
        this.conf.real_map = make_map(this.conf)
        place_cities(this.conf)
        for (let i = 0; i < this.conf.size; i++) {
            this.user_map[i] = new ViewMap();
            this.comp_map[i] = new ViewMap();
        }
        for (let i = 0; i < NUM_OBJECTS; i++) {
            this.user_obj[i] = null;
            this.comp_obj[i] = null;
        }

        // Put the fixed array of pieces in the "free_list".
        for (let i = 0; i < LIST_SIZE ; i++) {
            let obj = new PieceInfo(i);
            this.object[i] = obj;
            // obj->hits = 0; /* mark object as dead */
            // obj->owner = UNOWNED;
            LINK(this, 'free_list', obj, 'piece_link')
        }
    }

    get real_map_rows() {
        let output: string[] = []
        let loc = 0
        let prev_row = 0
        let row_string = ""
        for (let i = 0; i < this.conf.size; i++) {
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
