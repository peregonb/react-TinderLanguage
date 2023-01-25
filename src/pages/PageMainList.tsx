import React, {useEffect} from 'react';
import {List, Popconfirm} from 'antd';
import {EditOutlined, DeleteOutlined} from '@ant-design/icons';
import {I_listItemSingle, I_state} from '@redux/types';
import {connect} from 'react-redux';
import {deleteList, setHeaderTitle, setList} from '@redux/app-reducer';
import {Link} from 'react-router-dom';
import Reset from '@components/Reset';

const className = 'list';

interface I_props {
    list: I_listItemSingle[],
    deleteList: (id: number) => void
    setHeaderTitle: (headline: string) => void
}

export const PageMainListContainer: React.FC<I_props> = ({list, deleteList, setHeaderTitle}) => {
    const listTitles = [...list.map((el: I_listItemSingle) => el.name)];
    useEffect(() => setHeaderTitle('Lists'), [])

    return (
        <>
            <List
                className={className}
                size={'small'}
                bordered
                dataSource={listTitles}
                renderItem={(item, index) => (
                    <List.Item className={`${className}-item`}>
                        <Link to={`/play/id${list[index].id}`} className={`${className}-text`}>{item}</Link>
                        <div className={`${className}-icons`}>
                            <Link className={`${className}-edit-link`} to={`/edit/id${list[index].id}`}>
                                <EditOutlined className={`${className}-edit`}/>
                            </Link>
                            <Popconfirm
                                title={'Are you sure to delete this list?'}
                                onConfirm={() => deleteList(index)}
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

let mapStateToProps = (state: I_state) => {
    return {
        list: state.app.list,
    }
};

export const PageMainList = connect(
    mapStateToProps, {setList, deleteList, setHeaderTitle}
)(PageMainListContainer);