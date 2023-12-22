
const UNSEEN = ' '

export class ViewMap {
    contents: string; /* MAP_LAND, MAP_SEA, MAP_CITY, 'A', 'a', etc */
    seen: number; /* date when last updated */

    constructor(contents: string = UNSEEN, seen: number = 0) {
        this.contents = contents;
        this.seen = seen;
    }
}