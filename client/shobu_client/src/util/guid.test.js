import { newUnsecureGuid } from "./guid"


test("generate some guids :)", ()=>{
    for( var i =0 ;i < 5 ; i ++ ){
        console.log( newUnsecureGuid() );
    }
})