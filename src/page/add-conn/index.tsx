import * as React from 'react'
import { observer } from 'mobx-react'
import l from '../../lib/lang'
import {NODE_ENV} from '../../config'

import './add-conn.less'

import add from '../../store/add'

@observer
class AddConn extends React.Component<any, any> {
    componentDidMount () {
        if (NODE_ENV === 'development') {
            setTimeout(function () {
                add.add()
            }, 0)
        }
    }
    render () {
        const data = add.store.view
        return (
            <div className="add-conn-container">
                <div className="pt-card pt-elevation-2 pt-interactive">
                    <div className="line line0">
                        {l`New Connection`}
                    </div>
                    <div className="line line1">
                        <div className="label">
                            {l`Connection Name`}
                        </div>
                        <div className="pt-input-group">
                            <span className="pt-icon pt-icon-application"></span>
                            <input
                                type="text"
                                className="pt-input"
                                placeholder={l`Connection Name`}
                                value={data.connectionName}
                                onChange={e => add.change('view.connectionName', e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="line line2">
                        <div className="left">
                            <div className="label">
                                {l`address`}
                            </div>
                            <div className="pt-input-group">
                                <span className="pt-icon pt-icon-ip-address"></span>
                                <input
                                    type="text"
                                    className="pt-input"
                                    placeholder={l`address`}
                                    value={data.address}
                                    onChange={e => add.change('view.address', e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="middle">
                            <div className="sim">:</div>
                        </div>
                        <div className="right">
                            <div className="label">
                                {l`port`}
                            </div>
                            <input
                                type="text"
                                className="pt-input"
                                placeholder={l`port`}
                                value={data.port}
                                onChange={e => add.change('view.port', e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="line line3">
                        <div className="left">
                            <div className="label">
                                {l`username`}
                            </div>
                            <div className="pt-input-group">
                                <span className="pt-icon pt-icon-id-number"></span>
                                <input
                                    type="text"
                                    className="pt-input"
                                    placeholder={l`username`}
                                    value={data.username}
                                    onChange={e => add.change('view.username', e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="right">
                            <div className="label">
                                {l`password`}
                            </div>
                            <div className="pt-input-group">
                                <span className="pt-icon pt-icon-unlock"></span>
                                <input
                                    type="password"
                                    className="pt-input"
                                    placeholder={l`password`}
                                    value={data.password}
                                    onChange={e => add.change('view.password', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="line line4">
                        <button className="pt-button pt-intent-primary pt-icon-add" onClick={() => add.add()}>
                            {l`add`}
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}

export default AddConn
