import * as React from 'react'
import './connection-panel.less'

import {Tooltip} from '@blueprintjs/core'
import l from '../../lib/lang'
import history from '../../lib/history'

class ConnectionPanel extends React.Component<any, any> {
    static defaultProps = {
        using: '',
        onClosePanel: () => null,
        collList: []
    }
    handleAdd () {
        this.props.onClosePanel()
        history.replace('/add-conn')
    }
    handleSelect (name) {
        const {using} = this.props
        if (using !== name) {
            this.props.onClosePanel()
            history.replace(`/table?connectionName=${name}`)
        }
    }
    render () {
        const {using, collList} = this.props
        return (
            <div className="connection-panel">
                <div className="content">
                    {collList.map((item, i) => {
                        return (
                            <Tooltip content={l`Use this connection`} key={i}>
                                <div className={`item`}>
                                    <div
                                        className={`slice ${using === item ? 'slice-select' : ''}`}
                                        onClick={this.handleSelect.bind(this, item)}
                                    >
                                        {item.slice(0, 1).toUpperCase()}
                                    </div>
                                    <div className="name">
                                        {item}
                                    </div>
                                </div>
                            </Tooltip>
                        )
                    })}
                    <Tooltip content={l`Add new connection`} key={-1}>
                        <div className="item item-add">
                            <div className="slice" onClick={this.handleAdd.bind(this)}>
                                +
                            </div>
                        </div>
                    </Tooltip>
                </div>
            </div>
        )
    }
}

export default ConnectionPanel
