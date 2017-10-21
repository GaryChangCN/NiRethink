import * as React from 'react'
import { Link } from 'react-router-dom'
import { observer } from 'mobx-react'
import {Alert} from '@blueprintjs/core'
import history from '../../lib/history'

import './header.less'

import app from '../../store/app'
import table from '../../store/table'

@observer
class Header extends React.Component<any, any> {
    render () {
        return (
            <div className="header-container">
                <nav className="pt-navbar pt-dark">
                    <div className="left">
                        {table.store.connectionName.slice(0, 1).toUpperCase()}
                    </div>
                    <div className="logo" onClick={() => {history.push('/')}}>
                        NieRethink
                    </div>
                    <div className="right"></div>
                </nav>
                <Alert
                    isOpen={!!app.store.alert}
                    onConfirm={() => app.toggleAlert('')}
                >
                    {app.store.alert}
                </Alert>
            </div>
        )
    }
}

export default () => <Header/>
