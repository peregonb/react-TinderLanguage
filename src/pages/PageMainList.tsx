import {List, Popconfirm} from 'antd';
import {EditOutlined, DeleteOutlined} from '@ant-design/icons';
import React from "react";
import {I_listItem, I_listItemSingle, I_state} from "@redux/types";
import {connect} from 'react-redux';
import {deleteList, setList} from "@redux/app-reducer";
import { Link } from 'react-router-dom';

const className = 'list';

interface I_props {
    list: I_listItem,
    deleteList: (id: number) => void
}

export const PageMainListContainer: React.FC<I_props> = ({list, deleteList}) => {
    const listTitles = [...list.map((el: I_listItemSingle) => el.name)];

    return (
        <List
            className={className}
            size={'small'}
            bordered
            dataSource={listTitles}
            renderItem={(item, index) => (
                <List.Item className={`${className}-item`}>
                    <Link className={`${className}-text`} to={'/edit'}>{item}</Link>
                    <div className={`${className}-icons`}>
                        <EditOutlined className={`${className}-edit`}/>
                        <Popconfirm
                            title="Are you sure to delete this list?"
                            onConfirm={() => deleteList(index)}
                            okText="Yes"
                            cancelText="No"
                            placement="left"
                        >
                            <DeleteOutlined className={`${className}-delete`}/>
                        </Popconfirm>
                    </div>
                </List.Item>
            )}
        />
    )
}

let mapStateToProps = (state: I_state) => {
    return {
        list: state.app.list,
    }
};

export const PageMainList = connect(mapStateToProps, {setList, deleteList})(PageMainListContainer);