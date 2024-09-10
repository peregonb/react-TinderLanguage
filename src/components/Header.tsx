import { FC, memo } from 'react';
import { Button } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from '@redux/hooks';

import css from '@styles/components/header.module.scss';
import cn from 'classnames';
import { mainRootSelectors } from '@redux/reducers/main/selectors';

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
                    <div className={cn(css.Header_exit, 'icon-close')}/>
                </Link>
            )
    }
}

const Header: FC = () => {
    const headline = useSelector(mainRootSelectors.headline);

    return (
        <div className={css.Header}>
            <div className={cn(css.Header_wrapper, 'wrapper')}>
                <div className={css.Header_headline}>
                    {headline}
                </div>
                <HeaderButton/>
            </div>
        </div>
    )
}

export default memo(Header);