import {UNOWNED} from "./map";

export type PieceInfoOrNull = PieceInfo | null;

export class Link {
    next : PieceInfoOrNull = null
    prev : PieceInfoOrNull = null
}

export class PieceInfo {
    id: number
    piece_link: Link = new Link()
    loc_link: Link = new Link()
    cargo_link: Link = new Link()
    owner: number = UNOWNED
    type: number = 0
    loc: number = 0
    func: number = 0
    hits: number = 0
    moved: number = 0
    ship: PieceInfoOrNull = null
    cargo: PieceInfoOrNull = null
    count: number = 0
    range: number = 0

    constructor(id: number) {
        this.id = id;
    }
}

function to_link(thing: PieceInfo, link_name:string) : Link {
    return (thing as any)[link_name] as Link;
}

export function LINK(head: any, head_field: string, obj: PieceInfo, link_field: string) {
    let obj_link = to_link(obj, link_field);
    obj_link.prev = null
    obj_link.next = head[head_field]
    if (head[head_field] != null) {
        let head_link : Link = to_link(head[head_field], link_field)
        head_link.prev = obj;
    }
    head[head_field] = obj
}
