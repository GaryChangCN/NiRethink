import * as React from 'react'
import { observer } from 'mobx-react'
import {Alert, Intent, Tooltip, Position} from '@blueprintjs/core'
import history from '../../lib/history'
import l from '../../lib/lang'
import ConnectionPanel from '../connection-panel'

import './header.less'

import app from '../../store/app'
import table from '../../store/table'
import service from '../../store/service'

@observer
class Header extends React.Component<any, any> {
    constructor (props) {
        super (props)
        this.state = {
            showPanel: false
        }
    }
    renderControl () {
        const name = table.store.connectionName
        const collList = Array.from(service.collect.keys())
        const {showPanel} = this.state
        if (collList.length === 0) {
            return <div className="left"></div>
        }
        return (
            <div className="left left-full">
                {name ? <Tooltip
                    content={l`Reconnect`}
                    position={Position.RIGHT}
                >
                    <div
                        className="refresh-conn"
                        onClick={() => table.reconnect(name)}
                    >
                        {name.slice(0, 1).toUpperCase()}
                    </div>
                </Tooltip> : <div
                        className="refresh-conn refresh-disabled"
                    >∅</div>}
                <div className="panel-container">
                    <Tooltip
                        content={l`Change Connection`}
                        position={Position.RIGHT}
                    >
                        <div
                            className="change-conn"
                            onClick={() => this.setState({
                                showPanel: !showPanel
                            })}
                        >
                            <span
                                className={`pt-icon-standard pt-icon-caret-down ${showPanel ? 'close' : ''}`}
                            ></span>
                        </div>
                    </Tooltip>
                    {showPanel && <ConnectionPanel
                        using={name}
                        collList={collList}
                        onClosePanel={() => {
                            this.setState({
                                showPanel: false
                            })
                        }}
                    />}
                </div>
            </div>
        )
    }
    render () {
        return (
            <div className="header-container">
                <nav className="pt-navbar pt-dark">
                    {this.renderControl()}
                    <div className="logo">
                        NiRethink
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

export default Header
