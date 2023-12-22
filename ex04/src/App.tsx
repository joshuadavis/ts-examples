import React from 'react';
import './App.css';

import World from './world';
import Grid from './grid';
import { irand } from './math';

function App() {
    const grid: Grid = new Grid();
    const seed = irand(9999)
    const world = new World(grid, seed);

    return (
        <div className="App">
            <header className="App-header">
                Okay. seed={seed}
            </header>
            <div className="term-display">
                {world.real_map_rows.map((row, index) =>
                    <div key={index}>{row}</div>
                )}
            </div>
        </div>
    );
}

export default App;
