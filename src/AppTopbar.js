import React from "react";
import { Link } from "react-router-dom";
import logo from "./assets/demo/flags/logoist.jpeg"
export const AppTopbar = (props) => {
    return (
        <div className="layout-topbar">
            <Link to="/" className="layout-topbar-logo">
                <img src={logo} alt="logo" />
                <span>SERVICIO TÉCNICO</span>
            </Link>

            <button type="button" className="p-link  layout-menu-button layout-topbar-button" onClick={props.onToggleMenuClick}>
                <i className="pi pi-bars" />
            </button>

            <button type="button" className="p-link layout-topbar-menu-button layout-topbar-button" onClick={props.onMobileTopbarMenuClick}>
                <i className="pi pi-ellipsis-v" />
            </button>
        </div>
    );
};
