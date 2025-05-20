import React, { Fragment } from 'react';
import { HomeButton } from './game/HomeButton';
import { LoginOptional, LoginRequired, LoginWidget} from '../pages/LoginPage';

export const Header = ({loginOptional, loginState}) => {
    let loginRequired =  true;
    if( loginOptional ){
        loginRequired = false;
    }

    return <Fragment>
        <HomeButton/>
        <LoginWidget loginState={loginState} loginIsRequired={!loginOptional}/>
    </Fragment>
}