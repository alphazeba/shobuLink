let _1bitMask = 0b1

export class BitFeeder {
    constructor( bString ){
        this.bString = bString;
        this.index = 0;
    }

    setIndex( i ){
        this.index = i;
    }

    getBit( i ){
        let byteOffset = Math.floor( i/8 );
        let targetByte = this.bString.length - ( byteOffset+1 );
        let byte = this.bString.charCodeAt( targetByte );
        let bitOffset = i % 8;
        return ( byte >> bitOffset ) & _1bitMask;
    }

    getNextBit(){
        let output = this.getBit( this.index );
        this.index += 1;
        return output;
    }

    getBitFeederJumped( numBits ){
        let output = new BitFeeder( this.bString );
        output.setIndex( this.index + numBits );
        return output;
    }
}