import React from 'react';
import './Donate.css';
   
export const Donate = () => {
    return <div className='donateSpace hoverLift'>
        <a href='https://ko-fi.com/U6U3XZW0G' target='_blank' rel="noreferrer">
            <img 
                className='kofiButton'
                src='https://storage.ko-fi.com/cdn/kofi1.png?v=3'
                border='0'
                alt='Buy Me a Coffee at ko-fi.com'
            />
        </a>
    </div>
}