import React, { useEffect, useState } from 'react';
import './MyInput.css';

export const MyInput = ({title,onChange,value}) => {

    return <span className='myInput'>
        <p>{title}</p>
        <input onChange={onChange} value={value} />
    </span>
}