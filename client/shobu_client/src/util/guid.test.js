import { newUnsecureGuid } from "./guid"


test("generate some guids :)", ()=>{
    let guids = []
    for( var i =0 ;i < 5 ; i ++ ){
        let newGuid = newUnsecureGuid()
        expect( guids.includes( newGuid ) ).toBe( false );
        guids.push( newGuid );
    }
})