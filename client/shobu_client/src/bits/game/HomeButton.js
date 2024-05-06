import React from 'react';
import { useNavigate } from "react-router-dom";
import './HomeButton.css';


export const HomeButton = (smallVersion=true) => {

    const navigate = useNavigate();

    const goHome = () => {
        navigate( '/' );
    }

    return <button className='btn homeButton' onClick={goHome} >
        <img
            className="shobuIcon"
            src={process.env.PUBLIC_URL + '/shobuLinkIcon.svg'}
        />
        <span className="shobuName">Shobu Link</span>
    </button>
}