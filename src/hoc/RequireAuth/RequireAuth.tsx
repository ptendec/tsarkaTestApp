import React, {FC} from 'react';
import {Navigate} from 'react-router-dom'
import {useSelector} from "react-redux";
import {RootState} from "../../store";

const RequireAuth:FC= ({children}) => {
    const isAuth = useSelector((state: RootState) => state.user.isAuth)
    if (!isAuth) return <Navigate to={'/authorization'}/>
    return (
        <>
            {children}
        </>
    );
};

export default RequireAuth;
