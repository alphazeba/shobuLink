import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { MyInput } from '../bits/login/MyInput';
import './LoginPage.css';
import { HomeButton } from '../bits/game/HomeButton';

export const LoginPage = () => {
    const navigate = useNavigate();
    const { redirect } = useParams();
    const loginState = useLoginState();
    let defaultName = "";
    if( loginState.loginInfo.name != null ){
        defaultName = loginState.loginInfo.name;
    }
    const [ name, setName ] = useState( defaultName );
    // eslint-disable-next-line
    const [ password, setPassword ] = useState( "LOGGEDIN" );

    const handleChangeEvent = ( e, setStateFn ) => {
        setStateFn( e.target.value );
    }
    
    const submit = () => {
        loginState.login( name, name, password );
        navigate( decodeURIComponent( redirect ) );
    }

    return <div>
        <HomeButton />
        <h1>Please log in</h1>
        <form >
            <div>
                <MyInput value={name} onChange={(e)=>handleChangeEvent(e,setName)} title="Name" placeholder='username'/>
            </div>
            <div className='line' />
            <button className='btn myBtn' onClick={submit}>submit</button>
        </form>
    </div>
}

export const LoginRequired = () => {
    return <LoginWidget loginIsRequired={true}/>;
}

export const LoginOptional = () => {
    return <LoginWidget loginIsRequired={false}/>;
}

const LoginWidget = ({ loginIsRequired }) => {
    const [ forceLogin, setForceLogin ] = useState( false );
    const location = useLocation();
    const navigate = useNavigate();
    const loginState = useLoginState();
    useEffect( () => {
        if( (loginIsRequired && !loginState.isLoggedIn()) || forceLogin ){
            navigate( "/login/" + encodeURIComponent( location.pathname ) );
        }
    });

    const onLogout = () => {
        loginState.logout();
    }

    const renderLoggedInForm = () => {
        return <div className='loginBox'>
            <div>
                logged in as:&nbsp;
                <button className='btn myBtn' onClick={()=>navigate( "/user/" + loginState.loginInfo.id )}>
                    {loginState.loginInfo.name}
                </button>
            </div>
            <button className='myLink logoutBtn' onClick={onLogout}>logout</button>
        </div>
    }

    const renderLoggedOutForm = () => {
        return <div className='loginBox'>
            <button className='btn myBtn' onClick={()=>setForceLogin( true )}>login</button>
        </div>
    }

    if( loginState.isLoggedIn() ){
        return renderLoggedInForm();
    }
    return renderLoggedOutForm();
}

const _getLoginInfo = () => {
    const loginInfo = {
        name: localStorage.getItem("name"),
        id: localStorage.getItem("id"),
        token: localStorage.getItem("token"),
    }
    return loginInfo;
}

export const useLoginState = () => {
    const [ loginInfo, setLoginInfo ] = useState( _getLoginInfo() );

    const login = ( name, id, token ) => {
        localStorage.setItem("name", name );
        localStorage.setItem("id", id );
        localStorage.setItem("token", token );
        setLoginInfo( _getLoginInfo() );
    }

    const isLoggedIn = () => {
        return loginInfo.name != null && loginInfo.id != null;
    }

    const logout = () => {
        localStorage.removeItem("id");
        localStorage.removeItem("token");
        localStorage.removeItem("name");
        setLoginInfo( _getLoginInfo() );
    }

    return {
        loginInfo: loginInfo,
        login: login,
        logout: logout,
        isLoggedIn: isLoggedIn
    }
}