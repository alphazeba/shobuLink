import { initBoard, makeValidatedMove } from "../gameLogic/board";
import { parseMove } from "../gameLogic/moveParser";

export function buildTestBoard( moves ){
    let board = initBoard();
    for( let i=0; i<moves.length; i++ ){
        let m = parseMove( moves[i] );
        board = makeValidatedMove( board, m );
    }
    return board;
}