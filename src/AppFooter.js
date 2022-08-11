import React from 'react';
import logo from "./assets/demo/flags/logoist.jpeg"

export const AppFooter = (props) => {

    return (
        <div className="layout-footer">
            <img src={logo} alt="Logo" height="20" className="mr-2" />
            Produced by
            <span className="font-medium ml-2">IST "Luis Rogerio González"</span>
        </div>
    );
}
