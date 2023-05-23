import { compareBoards, initBoard, makeValidatedMove } from "../gameLogic/board";
import { parseMove } from "../gameLogic/moveParser";
import { parsePreview } from "./stateHelper"
import { buildTestBoard } from "./testUtil";

test( "parse board", () => {
    console.log( "testing parse board" );
    let previewState = parsePreview( "AaQAAFfgAAgX4AAIF+AAAFY=" );
    let boardState = buildTestBoard( [
        "Wb1c2Wb1c2",
        "Wb4b3Wc4c3",
        "Bb1b3Wb1b3"
    ] );
    let result = compareBoards( boardState, previewState );
    console.log( "result: " + result );
    expect( result ).toBe( true );
} );

test( "test compare baords", () => {
    let sameMoves = [
        "Wb1c2Wb1c2",
        "Wb4b3Wc4c3",
        "Bb1b3Wb1b3"
    ];
    let a = buildTestBoard( sameMoves );
    let b = buildTestBoard( sameMoves );
    expect( compareBoards( a, b ) ).toBe( true );
} );