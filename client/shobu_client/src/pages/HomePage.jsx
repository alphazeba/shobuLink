import React from 'react';
import { Header } from '../bits/Header';
import { Screensaver } from '../bits/screensaver/screensaver';
import './HomePage.css';
import { Link } from 'react-router';

export const HomePage = ({loginState}) => {
    return <div>
            <Header loginOptional={true} loginState={loginState}/>
            <div className='homeContainer'>
                Join a game <Link className='btn myBtn' to="/findGame"> here</Link>
            </div>
            <div className='line' />
            <Screensaver />
            <div className='line' />
            <div >
                Create a game <Link className='btn myBtn' to="/createGame"> here</Link>
            </div>
        </div>;
}