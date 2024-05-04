import React from 'react'
import {toCellPercent} from '../../util/styleHelper';
import './Arrow.css'

export const Arrow = ({start,vec,flipped}) => {

    function getEndpoint(val, delta) {
        const scaler = 0.25;
        if (delta == 0) {
            return val;
        }
        if (delta < 0) {
            return val + delta + scaler;
        }
        return val + delta - scaler;
    }
    let [x1,y1] = start;
    let [vx,vy] = vec;
    let x2 = getEndpoint(x1, vx);
    let y2 = getEndpoint(y1, vy);
    const offset = flipped ? -0.5 : 0.5;
    const color = "#00FF00"
    return (<div className='arrow'>
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            version="1.1" 
            direction="ltr"
            width="100%"
            height="100%"
        >
            <defs>
                <marker 
                    id='head' 
                    orient="auto" 
                    markerWidth='1' 
                    markerHeight='3' 
                    refX='0.5' 
                    refY='1'
                >
                    <path d='M0,0 V2 L1,1 Z' fill={color} />
                </marker>
                <marker 
                    id='tail' 
                    orient="auto" 
                    markerWidth='10' 
                    markerHeight='10' 
                    refX='1' 
                    refY='1'
                >
                    <circle cx="1" cy="1" r="0.5" fill={color}></circle>
                </marker>
            </defs>
            <line
            x1={toCellPercent(x1+offset, flipped)}
            y1={toCellPercent(y1+offset, flipped)}
            x2={toCellPercent(x2+offset, flipped)}
            y2={toCellPercent(y2+offset, flipped)}
            stroke-width="10" 
            stroke={color}
            marker-end="url(#head)"
            marker-start="url(#tail)"
            />
        </svg>
    </div>
    );
}