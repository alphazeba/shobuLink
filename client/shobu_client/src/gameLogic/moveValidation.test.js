
import { parseMove } from "./moveParser"
import { validateFullMove } from "./moveValidation"
import { initBoard } from "./board";

test("valid move tests black", ()=>{
    let moveStrings = [
        "Wa1b2Wa1b2",
        "Wa1b2Ba1b2",
        "Wc1a3Bd1b3"
    ]
    for( let moveString of moveStrings ){
        let move = parseMove( moveString );
        let board = initBoard();
        expect( validateFullMove( board, move ) ).toBe( true );
    }
} );

test("invalid moves", () => {
    let moveStrings = [
        "Wa2b2Wa2b2",
        "Wa4b3Wa4b3"
    ]
    for( let moveString of moveStrings ){
        let move = parseMove( moveString );
        let board = initBoard();
        expect( validateFullMove( board,move ) ).toBe( false );
    }
} );