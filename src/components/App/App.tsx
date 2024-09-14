import { FC, memo } from 'react';
import { Layout } from 'antd';
import { Route } from 'react-router-dom';
import Catalog from '@pages/Catalog/Catalog';
import Cards from '@pages/Cards/Cards';
import Edit from '@pages/Edit/Edit';
import Bulk from '@pages/Bulk/Bulk';
import Header from '@components/Header/Header';

import '@styles/App.scss'
import css from '@components/App/layout.module.scss'
import cn from 'classnames';

const App: FC = () => (
    <Layout className={css.Layout}>
        <div className={css.Layout_inner}>
            <Header/>
            <Layout className={cn(css.Layout_wrapper, 'wrapper')}>
                <Route path={'/'} exact render={() => <Catalog/>}/>
                <Route path={'/list'} exact render={() => <Edit/>}/>
                <Route path={'/bulk'} exact render={() => <Bulk/>}/>
                <Route path={'/list/:listId'} render={() => <Edit/>}/>
                <Route path={'/play/:listId?'} render={() => <Cards/>}/>
            </Layout>
        </div>
    </Layout>
);

export default memo(App);
