import React from 'react';
import {Layout} from "antd";
import "./assets/styles/App.less";
import "./assets/styles/App.scss";
import {Route} from 'react-router-dom';
import {PageMainList} from '@pages/PageMainList';
import {PageCards} from '@pages/PageCards';
import {Header} from "@components/Header";
import {PageEditItem} from '@pages/PageEditItem';
import {PageCreateItem} from '@pages/PageCreateItem';

const className = 'language';

function App() {

    return (
        <Layout className={`${className}`}>
            <Header title={'Title'}/>
            <Layout className={`${className}-wrapper wrapper`}>
                <Route path={process.env.PUBLIC_URL + '/'} exact render={() => <PageMainList/>}/>
                <Route path={process.env.PUBLIC_URL + '/create'} render={() => <PageCreateItem/>}/>
                <Route path={process.env.PUBLIC_URL + '/play:itemId?'} render={() => <PageCards/>}/>
                <Route path={process.env.PUBLIC_URL + '/edit/id:itemId?'} render={() => <PageCreateItem/>}/>
            </Layout>
        </Layout>
    );
}

export default App;
