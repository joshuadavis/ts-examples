import React, { useState } from 'react';

type CellType = string | null;
type RowType = CellType[];

interface CellProps{
    cell: CellType;
    onClick: () => void;
}

const Cell: React.FC<CellProps> = ({ cell, onClick }) => (
    <div
        style={{
            width: '12px',
            height: '12px',
            border: '1px solid black',
            cursor: 'pointer',
            fontSize: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}
        onClick={onClick}
    >
        {cell}
    </div>
);

interface RowProps{
    cells: RowType;
    rowIndex: number;
    onCellClick: (rowIndex: number, columnIndex: number) => void;
}

const Row: React.FC<RowProps> = ({ cells, rowIndex, onCellClick }) => (
    <div style={{display: 'flex'}}>
        {cells.map((cell, i) => (
            <Cell
                key={i}
                cell={cell}
                onClick={() => onCellClick(rowIndex, i)}
            />
        ))}
    </div>
);

function initialState() : Array<RowType> {
    let rows = Array<RowType>(20)
    rows.forEach( (row, rowIndex, rowArray) => {
        rowArray[rowIndex] = Array(80).fill(null);
    })
    return rows;
}

const GameBoard: React.FC = () => {
    const [grid, setGrid] =
        useState<Array<RowType>>(initialState());

    const updateGrid = (rowIndex: number, columnIndex: number) => {
        const newGrid = [...grid];
        newGrid[rowIndex][columnIndex] = newGrid[rowIndex][columnIndex] ? null : 'X';
        setGrid(newGrid);
    };

    return (
        <div style={{display: 'flex', flexDirection: 'column'}}>
            {grid.map((row, i) => (
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

const App: React.FC = () => (
    <div>
        <GameBoard />
    </div>
);

export default App;