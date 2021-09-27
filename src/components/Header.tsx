import React, {ReactElement} from 'react';

interface IHeaderProps {
    title: string,
}

export const Header: React.FC<IHeaderProps> = ({title, children}) => {

    return (
        <div className={'header'}>
            <div className={'header-wrapper wrapper'}>
                <div className="header-headline">
                    {title}
                </div>
                {children}
            </div>
        </div>
    )
}