import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';

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

function HelpModal() {
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
        <Modal
            className='Modal'
            overlayClassName='Overlay'
            isOpen={showHelp}
            onRequestClose={() => setShowHelp(false)}
            contentLabel="Help Panel"
        >
            <div>
                <pre>
                    {helpText}
                </pre>
            </div>
        </Modal>
    );
}

export default HelpModal;