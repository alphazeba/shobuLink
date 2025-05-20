import React from 'react';
import { Donate } from './Donate';
import './Footer.css';
import { Link } from 'react-router';

export const Footer = () => {
    return <div className='footer'>
        <div className='footerLeftSide'>
            <Donate/>
        </div>
        <div className='footerRightSide'>
            <Link className='btn myBtn' to="/howToPlay">
                How To Play
            </Link>
        </div>
    </div>
}