import { FC, memo, useEffect, useMemo } from 'react';
import { List, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { IListItemSingle } from '@redux/reducers/main/types';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from '@redux/hooks';
import { mainRootSelectors } from '@redux/reducers/main/selectors';
import { deleteList, setHeaderTitle } from '@redux/reducers/main';

import css from '@pages/Catalog/catalog.module.scss'
import cn from 'classnames';

const Catalog: FC = () => {
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
                className={css.Catalog}
                size={'small'}
                bordered
                dataSource={listTitles}
                renderItem={item => {
                    const id = list.find(el => el.name === item)!.id;

                    return (
                        <List.Item className={css.Catalog_item}>
                            <Link
                                to={`/play/${id}`}
                                className={css.Catalog_text}>
                                {item}
                            </Link>
                            <div className={css.Catalog_icons}>
                                <Link
                                    className={cn(css.Catalog_icon, css.Catalog_icon_edit)}
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
                                    <DeleteOutlined className={cn(css.Catalog_icon, css.Catalog_icon_delete)}/>
                                </Popconfirm>
                            </div>
                        </List.Item>
                    );
                }}
            />
        </>
    )
}

export default memo(Catalog);