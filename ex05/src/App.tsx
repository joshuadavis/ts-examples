import React, {useState} from 'react';
import './App.css';

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

function initialState(): Array<RowType> {
    const height = 20;
    const width = 80;
    const rows = Array<RowType>(height).fill(Array<CellType>(width).fill(null));
    for(let i = 0; i < height; i++) {
        for (let j = 0 ; j < width ; j++) {
            const value = (i * width + j).toString(16);
            rows[i][j] = value.charAt(value.length - 1);
        }
    }
    return rows;
}

const GameBoard: React.FC = () => {
    const [grid, setGrid] =
        useState<Array<RowType>>(initialState());

    const updateGrid = (rowIndex: number, columnIndex: number) => {
        const newGrid = [...grid];
        console.log(`rowIndex=${rowIndex} columnIndex=${columnIndex}`)
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
        <GameBoard/>
    </div>
);

export default App;