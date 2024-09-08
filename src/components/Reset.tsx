import { FC, useCallback } from 'react';
import { Button, Popconfirm } from 'antd';
import { ClearOutlined } from '@ant-design/icons';

const className = 'reset';

const Reset: FC = () => {
    const onConfirmHandler = useCallback(() => {
        localStorage.clear();
        window.location.reload();
    }, []);

    return (
        <Popconfirm
            placement={'topRight'}
            title={'Are you sure you wanna reset the app?'}
            onConfirm={onConfirmHandler}
            okText={'Yes'}
            cancelText={'No'}
        >
            <Button
                type={'primary'}
                shape={'circle'}
                size={'large'}
                icon={<ClearOutlined/>}
                className={className}
                danger
            />
        </Popconfirm>
    )
};

export default Reset;