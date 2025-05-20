import React from 'react';
import { useNavigate } from "react-router";
import './HomeButton.css';


export const HomeButton = (smallVersion=true) => {

    const navigate = useNavigate();

    const goHome = () => {
        navigate( '/' );
    }

    return <button className='btn homeButton' onClick={goHome} >
        <img
            className="shobuIcon"
            src={'/shobuLinkIcon2.svg'}
            alt=""
        />
        <div className='nameHolder hoverLift'>
            <span className="shobuName">Shobu Link</span>
        </div>
    </button>
}