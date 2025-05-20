import React from 'react';
import { Donate } from './Donate';
import './Footer.css';

export const Footer = () => {
    return <div className='footer'>
        <div className='footerNotification'>
            ⚠️
            <a
                href="https://github.com/alphazeba/shobuLink/blob/master/notifications/s3toGithubMigration.md"
            >site hosting migration notice (urls to games will break)</a>
            ⚠️
        </div>
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