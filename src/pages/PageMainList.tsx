import { FC, memo, useEffect, useMemo } from 'react';
import { List, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { I_listItemSingle } from '@redux/types';
import { useDispatch } from 'react-redux';
import { deleteList, setHeaderTitle } from '@redux/app-reducer';
import { Link } from 'react-router-dom';
import Reset from '@components/Reset';
import useSelector from "@hooks/useSelector";

const className = 'list';

export const PageMainList: FC = () => {
    const dispatch = useDispatch();
    const {list} = useSelector(state => state.app);
    const listTitles: Array<string> = useMemo(() => [...list.map((el: I_listItemSingle) => el.name)], [list]);

    useEffect(() => {
        dispatch(setHeaderTitle('Lists'));
    }, [dispatch]);

    return (
        <>
            <List
                className={className}
                size={'small'}
                bordered
                dataSource={listTitles}
                renderItem={(item, index) => (
                    <List.Item className={`${className}-item`}>
                        <Link
                            to={`/play/id${list[index].id}`}
                            className={`${className}-text`}>
                            {item}
                        </Link>
                        <div className={`${className}-icons`}>
                            <Link
                                className={`${className}-edit-link`}
                                to={`/edit/id${list[index].id}`}>
                                <EditOutlined className={`${className}-edit`}/>
                            </Link>
                            <Popconfirm
                                title={'Are you sure to delete this list?'}
                                onConfirm={() => {
                                    dispatch(deleteList(index));
                                }}
                                okText={'Yes'}
                                cancelText={'No'}
                                placement={'left'}
                            >
                                <DeleteOutlined className={`${className}-delete`}/>
                            </Popconfirm>
                        </div>
                    </List.Item>
                )}
            />
            <Reset/>
        </>
    )
}

export default memo(PageMainList);