
import { moveToString, parseMove } from "./moveParser";


test("This should parse the move back and forth succesfully", ()=>{
    var  testMove = "Wa1b2Wa1b2";
    var parsedMove = parseMove( testMove );
    var unparsedMove = moveToString( parsedMove );
    expect( unparsedMove ).toBe( testMove );
})
