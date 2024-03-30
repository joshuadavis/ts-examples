import React, { useState, useEffect } from 'react';
import './App.css';
import Modal from 'react-modal';

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
    const rows = Array<RowType>(height);
    for(let i = 0; i < height; i++) {
        rows[i] = Array<CellType>(width).fill(null);
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

// Make sure to bind modal to your appElement (http://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement('#root');

const helpText =
    " Key Bindings:\n\n" +
    " QWE                                     Land:     set func to land\n" +
    " A D       movement directions           Out:      leave automove mode\n" +
    " ZXC                                     Print:    redraw screen\n" +
    " <space>:  sit                           Random:   set func to random\n" +
    " Build:    change city production        Sentry:   set func to sentry\n" +
    " Fill:     set func to fill              Transport:set func to transport\n" +
    " Grope:    set func to explore           Upgrade:  set func to repair\n" +
    " Help:     display this text             V <piece> <func>:  set city func\n" +
    " I <dir>:  set func to dir               Y:        set func to attack\n" +
    " J:        enter edit mode               <ctrl-L>: redraw screen\n" +
    " Kill:     set func to awake\n\n" +
    " Pieces:\n\n" +
    " --Piece---Yours-Enemy-Moves-Hits-Cost   --Piece---Yours-Enemy-Moves-Hits-Cost\n" +
    " army        A     a     1    1     5    transport   T     t     2    1    30\n" +
    " fighter     F     f     8    1    10    carrier     C     c     2    8    30\n" +
    " patrol      P     p     4    1    15    battleship  B     b     2   10    40\n" +
    " destroyer   D     d     2    3    20    satellite   Z     z    10    1    50\n" +
    " submarine   S     s     2    2    20\n\n" +
    " (esc to go back)"

const App: React.FC = () => {
    const [showHelp, setShowHelp] = useState<boolean>(false);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === '?') {
                setShowHelp(true);
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    return (
        <div>
            <div>? for help</div>
            <GameBoard />

            <Modal className='Modal' overlayClassName='Overlay'
                isOpen={showHelp}
                onRequestClose={() => setShowHelp(false)}
                contentLabel="Help Panel">
                {<div>
                    <pre>
                        {helpText}
                    </pre>
                </div>}
            </Modal>
        </div>
    );
}


export default App;