
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { GameLoader } from './GameLoader';
import { MyInput } from './MyInput';
import './LoginPage.css';


export const LoginPage = () => {
    const navigate = useNavigate();
    const { redirect } = useParams();
    const loginInfo = getLoginInfo()
    var defaultName = "";
    if( loginInfo.name != null ){
        defaultName = loginInfo.name;
    }
    const [ name, setName ] = useState(defaultName);
    const [ password, setPassword ] = useState("LOGGEDIN");

    const handleChangeEvent = ( e, setStateFn ) => {
        setStateFn( e.target.value );
    }

    const submit = () => {
        setLoginInfo( name, name, password );

        navigate( decodeURIComponent( redirect ) );
    }

    return <div>
        <h1>Please log in</h1>
        <form >
            <MyInput value={name} onChange={(e)=>handleChangeEvent(e,setName)} title="Name" />
            <button className='btn joinGameButton' onClick={submit}>submit</button>
        </form>
    </div>
}

export const ForceUserToLogin = () => {
    const [ forceLogin, setForceLogin ] = useState( false );
    const location = useLocation();
    const navigate = useNavigate();
    const loginInfo = getLoginInfo();
    useEffect( () => {
        if( loginInfo.name == null || loginInfo.id == null || forceLogin ){
            navigate( "/login/" + encodeURIComponent( location.pathname ) );
        }
    });

    const onLogout = () => {
        logout();
        setForceLogin( true );
    }
    return <div className='loginBox'>
        <p>logged in as: {loginInfo.name}</p>
        <button onClick={onLogout}>logout</button>
        </div>
}

export const getLoginInfo = () => {
    const loginInfo = {
        name: localStorage.getItem("name"),
        id: localStorage.getItem("id"),
        token: localStorage.getItem("token"),
    }
    return loginInfo;
}

const setLoginInfo = ( name, id, token ) => {
    localStorage.setItem("name", name );
    localStorage.setItem("id", id );
    localStorage.setItem("token", token );
}

const logout = () => {
    localStorage.removeItem("id");
    localStorage.removeItem("token");
    localStorage.removeItem("name");
}