
import { moveToString, parseMove } from "./moveParser";


test("This should parse the move back and forth succesfully", ()=>{
    let  testMove = "Wa1b2Wa1b2";
    let parsedMove = parseMove( testMove );
    let unparsedMove = moveToString( parsedMove );
    expect( unparsedMove ).toBe( testMove );
})
