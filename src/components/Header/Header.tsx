import { FC, memo, useCallback, useState } from 'react';
import { Button, Drawer, Modal } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from '@redux/hooks';
import { MenuOutlined, CloseOutlined } from '@ant-design/icons';

import css from '@components/Header/header.module.scss';
import cn from 'classnames';
import { mainRootSelectors } from '@redux/reducers/main/selectors';
import { createPortal } from 'react-dom';

const HeaderButton: FC<{ triggerMenu: () => void }> = ({triggerMenu}) => {
    const {pathname} = useLocation();

    switch (pathname) {
        case '/':
            return (
                <div className={css.Header_buttons}>
                    <Link to={'/list'}>
                        <Button
                            size={'large'}
                            type={'primary'}>
                            Create List
                        </Button>
                    </Link>
                    <div className={css.Header_round} onClick={triggerMenu}>
                        <MenuOutlined style={{fontSize: '18px'}}/>
                    </div>
                </div>
            )
        default:
            return (
                <Link to={'/'}>
                    <div className={css.Header_round}>
                        <CloseOutlined style={{fontSize: '20px'}}/>
                    </div>
                </Link>
            )
    }
}

const Header: FC = () => {
    const headline = useSelector(mainRootSelectors.headline);
    const [isMenuOpen, setMenuStatus] = useState<boolean>(false);
    const [isModalOpen, setModalStatus] = useState<boolean>(false);

    const triggerMenu = useCallback(() => {
        setMenuStatus(val => !val);
    }, []);

    const triggerModal = useCallback(() => {
        setModalStatus(val => !val);
    }, []);

    const onConfirmHandler = useCallback(() => {
        localStorage.clear();
        window.location.reload();
    }, []);

    return (
        <div className={css.Header}>
            <div className={cn(css.Header_wrapper, 'wrapper')}>
                <div className={css.Header_headline}>
                    {headline}
                </div>
                <HeaderButton triggerMenu={triggerMenu}/>
            </div>

            {createPortal(
                <>
                    <Drawer
                        title={(
                            <div className={cn(css.Header_wrapper, 'wrapper')}>
                                <div className={css.Header_headline}>
                                    Menu
                                </div>
                                <div className={css.Header_round} onClick={triggerMenu}>
                                    <CloseOutlined style={{fontSize: '20px'}}/>
                                </div>
                            </div>
                        )}
                        styles={{
                            body: {padding: '10px 20px'},
                            header: {height: '60px', padding: '10px 0'},
                        }}
                        closable={false}
                        onClose={triggerMenu}
                        open={isMenuOpen}>
                        <div className={css.Header_menu}>
                            <div onClick={triggerModal}
                                 className={css.Header_menu__item}>
                                Reset app
                            </div>
                            <div className={css.Header_menu__item}>
                                Bulk import
                            </div>
                            <div className={css.Header_menu__item}>
                                Font settings
                            </div>
                        </div>
                    </Drawer>
                    <Modal
                        closable={false}
                        title={'Are you sure you want to reset the app?'}
                        open={isModalOpen}
                        onOk={onConfirmHandler}
                        onCancel={triggerModal}/>
                </>,
                document.getElementById('root')!
            )}
        </div>
    )
}

export default memo(Header);