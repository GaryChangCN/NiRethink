import * as React from 'react'
import { Link } from 'react-router-dom'
import { observer } from 'mobx-react'
import {Alert, Intent} from '@blueprintjs/core'
import history from '../../lib/history'
import l from '../../lib/lang'

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
                    isOpen={!!app.store.prompt.msg}
                    onConfirm={() => app.store.prompt.callBack(app.store.prompt.value)}
                    className="prompt-container"
                    cancelButtonText={l`Cancel`}
                    intent={Intent[app.store.prompt.intent]}
                    confirmButtonText={l`Ok`}
                    onCancel={() => app.togglePrompt()}
                >
                    <div className="msg">
                        {app.store.prompt.msg}
                    </div>
                    <input
                        className="pt-input pt-fill"
                        value={app.store.prompt.value}
                        autoFocus={true}
                        onChange={e => app.change('prompt.value', e.target.value)}
                    />
                </Alert>
                <Alert
                    isOpen={!!app.store.confirm.msg}
                    onConfirm={() => app.store.confirm.callBack()}
                    className="confirm-container"
                    cancelButtonText={l`Cancel`}
                    intent={Intent[app.store.confirm.intent]}
                    confirmButtonText={l`Ok`}
                    onCancel={() => app.toggleConfirm()}
                >
                    <div className="msg">
                        {app.store.confirm.msg}
                    </div>
                </Alert>
            </div>
        )
    }
}

export default () => <Header/>
