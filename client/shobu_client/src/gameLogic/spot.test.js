

import { addSpotVec, getDeltaVector } from "./spot";

test("spots should add together", ()=>{
    var a = [ 1, 2 ];
    var b = [ 2, 1 ];
    var result = addSpotVec( a, b );
    expect( result ).toStrictEqual( [3, 3] );
});