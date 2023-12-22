import {LINK, PieceInfo, PieceInfoOrNull} from './piece'

class Thing {
    free_list: PieceInfoOrNull = null
}

test("Free list LINK", () => {
    let thing = new Thing()
    let pieces: PieceInfo[] = []
    for (let i = 0; i < 10; i++) {
        let piece = new PieceInfo(i)
        pieces[i] = piece;
        LINK(thing, "free_list", piece, "piece_link")
    }

    // Follow the links... start with the most recently LINK-ed node.
    let node = thing.free_list;
    expect(node).not.toBeNull()
    let n = node as PieceInfo
    expect(n.piece_link.prev).toBeNull();
    let expect_id = pieces.length - 1
    let last = node
    while (node) {
        expect(node.id).toBe(expect_id)
        last = node;
        node = node.piece_link.next;
        if (node)
            expect(node.piece_link.prev).toBe(last)
        expect_id--;
    }
    expect(node).toBeNull()
    expect(last).not.toBeNull()
    expect(expect_id).toBe(-1)
})