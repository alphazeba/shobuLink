

const options = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890-=";
export function newUnsecureGuid(){
    let output = ""
    for(let i=0;i<10;i++){
        output += getRandomOptionChar();
    }
    return output;
}

function getRandomOptionChar(){
    const i = Math.floor( Math.random() * options.length );
    return options.charAt( i );
}