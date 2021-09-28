import { Button } from 'antd';
import React from 'react';
import {Link, useLocation} from "react-router-dom";

interface IHeaderProps {
    title: string,
}

const className = 'header';

export const Header: React.FC<IHeaderProps> = ({title, children}) => {

    const HeaderButton: React.FC = () => {
        return (
            useLocation().pathname === '/' ?
                <Link to={'/create'}><Button type={'primary'}>Create List</Button></Link> :
                <Link to={'/'}><div className={`${className}-exit icon-close`}/></Link>
        )
    }

    return (
        <div className={`${className}`}>
            <div className={`${className}-wrapper wrapper`}>
                <div className={`${className}-headline`}>
                    {title}
                </div>
                <HeaderButton/>
            </div>
        </div>
    )
}