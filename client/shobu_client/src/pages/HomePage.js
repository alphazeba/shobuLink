import React from 'react';
import { Header } from '../bits/Header';

export const HomePage = () => {
    return <div>
            <Header loginOptional={true} />
            <div>
                Try creating a game <a className='btn myBtn' href={"/createGame"}> here</a>
            </div>
        </div>;
}