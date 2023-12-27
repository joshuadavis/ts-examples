import React from 'react';
import './App.css';

import Grid from './grid';
import { irand } from './math';
import { init_game } from "./game";
import Game from "./game-cls";

function App() {
    const grid: Grid = new Grid();
    const seed = irand(9999)
    const game = new Game(grid, seed);
    init_game(game)

    return (
        <div className="App">
            <header className="App-header">
                Okay. seed={seed}
            </header>
            <div className="term-display">
                {game.real_map_rows.map((row, index) =>
                    <div key={index}>{row}</div>
                )}
            </div>
        </div>
    );
}

export default App;
