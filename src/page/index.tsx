import * as React from 'react'
import {Route, Router, Switch} from 'react-router-dom'
import history from '../lib/history'

import Main from './main'
import AddConn from './add-conn'
import Table from './table'


class Index extends React.Component<any, any> {
    render () {
        return (
            <Router history = {history}>
                <Main>
                    <Switch>
                        <Route path = '/'                       exact component = {AddConn}    />
                        <Route path = '/add-conn'               exact component = {AddConn}    />
                        <Route path = '/table'                  exact component = {Table}      />
                    </Switch>
                </Main>
            </Router>
        )
    }
}

export default Index
