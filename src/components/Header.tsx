import { FC, memo } from 'react';
import { Button } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import useSelector from "@hooks/useSelector";

const className = 'header';

const HeaderButton: FC = () => {
    const {pathname} = useLocation();

    switch (pathname) {
        case '/':
            return (
                <Link to={'/create'}>
                    <Button type={'primary'}>Create List</Button>
                </Link>
            )
        default:
            return (
                <Link to={'/'}>
                    <div className={`${className}-exit icon-close`}/>
                </Link>
            )
    }
}

const Header: FC = () => {
    const {headline} = useSelector(state => state.app);

    return (
        <div className={`${className}`}>
            <div className={`${className}-wrapper wrapper`}>
                <div className={`${className}-headline`}>
                    {headline}
                </div>
                <HeaderButton/>
            </div>
        </div>
    )
}

export default memo(Header);