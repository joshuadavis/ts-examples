import React, {useState} from "react";

type CellType = string | null;
type RowType = CellType[];

interface CellProps {
    cell: CellType;
    onClick: () => void;
}

const Cell: React.FC<CellProps> = ({cell, onClick}) => (
    <div
        className='cell'
        onClick={onClick}
    >
        {cell}
    </div>
);

interface RowProps {
    cells: RowType;
    rowIndex: number;
    onCellClick: (rowIndex: number, columnIndex: number) => void;
}

const Row: React.FC<RowProps> = ({cells, rowIndex, onCellClick}) => (
    <div className="row">
        {cells.map((cell, i) => (
            <Cell
                key={i}
                cell={cell}
                onClick={() => onCellClick(rowIndex, i)}
            />
        ))}
    </div>
);

class Grid {
    height: number = 20
    width: number = 80

    private _rows: Array<RowType>

    constructor(other?: Grid) {
        if (other) {
            this.width = other.width
            this.height = other.height
            this._rows = [...other._rows]
        }
        else
           this._rows = this.createNewRows();
    }

    private createNewRows() {
        const rows = Array<RowType>(this.height);
        for (let i = 0; i < this.height; i++) {
            rows[i] = Array<CellType>(this.width).fill(null);
            for (let j = 0; j < this.width; j++) {
                const value = (i * this.width + j).toString(16);
                rows[i][j] = value.charAt(value.length - 1);
            }
        }
        return rows;
    }

    get rows(): Array<RowType> {
        return this._rows;
    }

    get(r:number, c:number): CellType {
        return this._rows[r][c];
    }

    set(r:number, c:number, value: string | null) {
        this._rows[r][c] = value;
    }
}

const GameBoard: React.FC = () => {
    const [grid, setGrid] =
        useState<Grid>(new Grid());

    const updateGrid = (rowIndex: number, columnIndex: number) => {
        const newGrid = new Grid(grid);
        const old = grid.get(rowIndex, columnIndex);
        newGrid.set(rowIndex, columnIndex, old ? null : 'X');
        setGrid(newGrid);
    };

    return (
        <div className="GameBoard">
            <div className="header-row">
                <div className="header-cell">one</div>
                <div className="header-cell">two</div>
            </div>
            <div className="header-row">
                <div className="header-cell">three ...</div>
                <div className="header-cell">four ...</div>
            </div>
            {grid.rows.map((row, i) => (
                <Row
                    key={i}
                    rowIndex={i}
                    cells={row}
                    onCellClick={updateGrid}
                />
            ))}
        </div>
    );
}

export default GameBoard;
