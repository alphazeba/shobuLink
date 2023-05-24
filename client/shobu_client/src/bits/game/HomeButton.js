import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import './HomeButton.css';


export const HomeButton = () => {

    const navigate = useNavigate();

    const goHome = () => {
        navigate( '/' );
    }

    return <button className='btn homeButton' onClick={goHome} >Shobu Link</button>
}