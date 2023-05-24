import React, { Fragment } from 'react';
import { HomeButton } from './game/HomeButton';
import { LoginOptional, LoginRequired } from '../pages/LoginPage';

export const Header = ({loginOptional}) => {
    let loginRequired =  true;
    if( loginOptional ){
        loginRequired = false;
    }

    return <Fragment>
        <HomeButton/>
        { loginRequired ? <LoginRequired/> : <LoginOptional/> }
    </Fragment>
}