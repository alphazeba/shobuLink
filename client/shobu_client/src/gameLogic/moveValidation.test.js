
import { parseMove } from "./moveParser"
import { validateFullMove } from "./moveValidation"
import { initBoard } from "./board";

test("valid move tests black", ()=>{
    var moveStrings = [
        "Wa1b2Wa1b2",
        "Wa1b2Ba1b2",
        "Wc1a3Bd1b3"
    ]
    for( var moveString of moveStrings ){
        var move = parseMove( moveString );
        var board = initBoard();
        expect( validateFullMove( board, move ) ).toBe( true );
    }
} );

test("invalid moves", () => {
    var moveStrings = [
        "Wa2b2Wa2b2",
        "Wa4b3Wa4b3"
    ]
    for( var moveString of moveStrings ){
        var move = parseMove( moveString );
        var board = initBoard();
        expect( validateFullMove( board,move ) ).toBe( false );
    }
} );