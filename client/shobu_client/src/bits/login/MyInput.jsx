import React from 'react';
import './MyInput.css';

export const MyInput = ({title,onChange,value,placeholder}) => {
    return <span className='myInput input-group'>
        <span className='input-group-addon'>{title + " "}</span>
        <input className='myInput-input' onChange={onChange} value={value} placeholder={placeholder} />
    </span>
}