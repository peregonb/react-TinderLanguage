import { FC, memo, useEffect, useMemo } from 'react';
import { List, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { IListItemSingle } from '@redux/reducers/main/types';
import { Link } from 'react-router-dom';
import Reset from '@components/Reset';
import { useDispatch, useSelector } from '@redux/hooks';
import { mainRootSelectors } from '@redux/reducers/main/selectors';
import { deleteList, setHeaderTitle } from '@redux/reducers/main';

import css from '@styles/pages/List.module.scss'
import cn from 'classnames';

const PageMainList: FC = () => {
    const dispatch = useDispatch();
    const list = useSelector(mainRootSelectors.list);

    const listTitles: Array<string> = useMemo(() => {
        return list.map((el: IListItemSingle) => el.name);
    }, [list]);

    useEffect(() => {
        dispatch(setHeaderTitle('Lists'));
    }, [dispatch]);

    return (
        <>
            <List
                className={css.List}
                size={'small'}
                bordered
                dataSource={listTitles}
                renderItem={item => {
                    const id = list.find(el => el.name === item)!.id;

                    return (
                        <List.Item className={css.List_item}>
                            <Link
                                to={`/play/${id}`}
                                className={css.List_text}>
                                {item}
                            </Link>
                            <div className={css.List_icons}>
                                <Link
                                    className={cn(css.List_icon, css.List_icon_edit)}
                                    to={`/list/${id}`}>
                                    <EditOutlined/>
                                </Link>
                                <Popconfirm
                                    title={'Are you sure to delete this list?'}
                                    onConfirm={() => dispatch(deleteList(id))}
                                    okText={'Yes'}
                                    cancelText={'No'}
                                    placement={'left'}
                                >
                                    <DeleteOutlined className={cn(css.List_icon, css.List_icon_delete)}/>
                                </Popconfirm>
                            </div>
                        </List.Item>
                    );
                }}
            />
            <Reset/>
        </>
    )
}

export default memo(PageMainList);