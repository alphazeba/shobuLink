import React, { useState } from 'react';

export const ToggleButtons = ({titleValues, value, onChange}) => {

    const renderButton = (buttonTitle, buttonValue
    ) => {
        return <Selectable
            selected={buttonValue === value}
            onClick={()=>onChange(buttonValue)}
            key={buttonValue}
        >
            {buttonTitle}
        </Selectable>
    }

    return titleValues.map((tv) => renderButton(tv.title, tv.value));
}

const Selectable = ({children,selected,onClick}) => {
    let className = "btn myBtn sideSelector btn ";
    if( selected ){
        className += " selected";
    }
    return <button className={className} onClick={onClick} >
        {children}
    </button>
}