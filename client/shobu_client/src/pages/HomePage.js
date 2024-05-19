import React from 'react';
import { Header } from '../bits/Header';
import { Screensaver } from '../bits/screensaver/screensaver';
import './HomePage.css';

export const HomePage = ({loginState}) => {
    return <div>
            <Header loginOptional={true} loginState={loginState}/>
            <div className='homeContainer'>
                Try creating a game <a className='btn myBtn' href={"/createGame"}> here</a>
            </div>
            <div className='line' />
            <Screensaver />
        </div>;
}