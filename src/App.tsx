import React, {useEffect} from 'react';
import {Button, Layout} from "antd";
import "./assets/styles/App.less";
import "./assets/styles/App.scss";
import {Route, useLocation} from 'react-router-dom';
import {PageMainList} from '@pages/PageMainList';
import {PageCards} from '@pages/PageCards';
import {Header} from "@components/Header";
import {PageEditItem} from '@pages/PageEditItem';

const className = 'language';

function App() {

    return (
        <Layout className={`${className}`}>
            <Header title={'Title'}>
                {useLocation().pathname === '/' && <Button type={'primary'}>Create List</Button>}
            </Header>
            <Layout className={`${className}-wrapper wrapper`}>
                <Route path={process.env.PUBLIC_URL + '/'} exact render={() => <PageMainList/>}/>
                <Route path={process.env.PUBLIC_URL + '/play:itemId?'} render={() => <PageCards/>}/>
                <Route path={process.env.PUBLIC_URL + '/edit:itemId?'} render={() => <PageEditItem/>}/>
            </Layout>
        </Layout>
    );
}

export default App;
