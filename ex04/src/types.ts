// Basic types, to make the code look a little more like the original.

export type MutableInteger = { value: number };

// Also some game-specific types

export enum win_t { no_win, wipeout_win, ratio_win}

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

enum Func {
    NOFUNC = -1
}

export const UNOWNED = 0

const NOPIECE = "?"

export const MAP_LAND = "+"
export const MAP_SEA = "."
export const MAP_CITY = "*"

export const UNSEEN = ' '
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

export class RealMap {
    contents: string
    on_board: boolean
    city: object | null
    piece: object | null

    constructor(contents: string) {
        this.contents = contents
        this.city = null
        this.piece = null
        this.on_board = true
    }
}


export class ViewMap {
    contents: string; /* MAP_LAND, MAP_SEA, MAP_CITY, 'A', 'a', etc */
    seen: number; /* date when last updated */

    constructor(contents: string = UNSEEN, seen: number = 0) {
        this.contents = contents;
        this.seen = seen;
    }
}

