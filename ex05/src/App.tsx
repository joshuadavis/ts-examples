import React from 'react';
import './App.css';
import HelpModal from "./HelpModal";
import GameBoard from "./GameBoard";

const App: React.FC = () => {
    return (
        <div>
            <GameBoard />
            <HelpModal />
        </div>
    );
}

export default App;