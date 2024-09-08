import { FC, ReactNode } from 'react';
import { ConfigProvider, theme } from 'antd';

const {darkAlgorithm} = theme;

const Theme: FC<{ children?: ReactNode }> = ({children}) => (
    <ConfigProvider theme={{
        algorithm: darkAlgorithm,
        token: {
            fontFamily: 'TT Norms',
            colorPrimary: '#1cab9c',
            colorError: '#ab1c2b',
            borderRadius: 2
        }
    }}>
        {children}
    </ConfigProvider>
)

export default Theme;