import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { isLogin } from '../utils';
import Warning from './warning';

const PrivateRoute = ({component: Component, ...rest}) => {
    return (

        // Show the component only when the user is logged in
        // Otherwise, show error message
        <Route {...rest}   render={(props) => {
            !isLogin && alert('This is a private Route');
            return
            isLogin() ? (
                <Component {...props} /> )
            :      (     <Warning/> )

            }} />                           
    );
};

export default PrivateRoute;
