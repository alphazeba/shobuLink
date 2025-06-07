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
            <Link className='btn myBtn howToPlayBtn' to="/howToPlay">
                How To Play
            </Link>
        </div>
        <div className="footerLinks">
            <a href="https://github.com/alphazeba/shobuLink">github</a>
            -
            <a href="https://github.com/alphazeba/shobuLink/issues">feedback</a>
            -
            <a href="https://aronhommas.com">about</a>
        </div>
    </div>
}