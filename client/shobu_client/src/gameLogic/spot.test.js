

import { addSpotVec, getDeltaVector } from "./spot";

test("spots should add together", ()=>{
    let a = [ 1, 2 ];
    let b = [ 2, 1 ];
    let result = addSpotVec( a, b );
    expect( result ).toStrictEqual( [3, 3] );
});