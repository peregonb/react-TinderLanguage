import {Button} from 'antd';
import React from 'react';
import {connect} from 'react-redux';
import {Link, useLocation} from "react-router-dom";
import {I_state} from "@redux/types";

interface IHeaderProps {
    headline: string,
}

const className = 'header';

const HeaderContainer: React.FC<IHeaderProps> = ({headline}) => {

    const HeaderButton: React.FC = () => {
        return (
            useLocation().pathname === '/' ?
                <Link to={'/create'}><Button type={'primary'}>Create List</Button></Link> :
                <Link to={'/'}>
                    <div className={`${className}-exit icon-close`}/>
                </Link>
        )
    }

    return (
        <div className={`${className}`}>
            <div className={`${className}-wrapper wrapper`}>
                <div className={`${className}-headline`}>
                    { headline }
                </div>
                <HeaderButton/>
            </div>
        </div>
    )
}

let mapStateToProps = (state: I_state) => {
    return {
        headline: state.app.headline
    }
};

export const Header = connect(
    mapStateToProps, {}
)(HeaderContainer);