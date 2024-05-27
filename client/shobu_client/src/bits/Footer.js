import React from 'react';
import { Donate } from './Donate';
import './Footer.css';

export const Footer = () => {
    return <div className='footer'>
        <div className='footerLeftSide'>
            <Donate/>
        </div>
        <div className='footerRightSide'>
            <a className='btn myBtn' href="/howToPlay">
                How To Play
            </a>
        </div>
    </div>
}