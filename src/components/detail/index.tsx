import * as React from 'react'
import * as _ from 'lodash'
import {Dialog, Tooltip, Position, Intent, Popover} from '@blueprintjs/core'
import l from '../../lib/lang'

import './detail.less'

class Detail extends React.Component<any, any> {
    ref: any = null
    toolIndex: number = -1
    static defaultProps = {
        list: [],
        indexList: {}
    }
    constructor (props) {
        super (props)
        this.state = {
            dialog: ''
        }
        this.handleTool = this.handleTool.bind(this)
    }
    private getHead (original) {
        let head = []
        original.forEach(item => {
            const keyList = Object.keys(item)
            const union = _.union(head, keyList)
            head = union
        })
        return head
    }

    handleDialog (msg = {}) {
        let dialog

        if (typeof msg === 'object') {
            dialog = JSON.stringify(msg, null, 4)
        }else {
            dialog = msg
        }
        this.setState({
            dialog
        })
    }

    handleTool (type: string) {
        if (this.toolIndex === -1) {
            throw new Error('Uncaught row number')
        }
        const index = this.toolIndex
        if (type === 'view') {
            const data = this.props.list[index]
            this.handleDialog(data)
        }
        this.toolIndex = -1
    }

    renderPopver () {
        return (
            <div className="popver-content">
                <button
                    className="pt-button pt-small pt-icon-eye-open opera"
                    onClick={() => this.handleTool('view')}
                >
                    {l`view`}
                </button>
                <button
                    className="pt-button pt-small pt-icon-edit opera"
                    onClick={() => this.handleTool('edit')}
                >
                    {l`edit`}
                </button>
                <button
                    className="pt-button pt-small pt-icon-trash opera"
                    onClick={() => this.handleTool('remove')}
                >
                    {l`remove`}
                </button>
            </div>
        )
    }

    render () {
        const original = this.props.list
        const {indexList} = this.props
        const head = this.getHead(original)
        const cloneHead = Array.from(head)
        const theadEl = head.map((item, i) => {
            return (
                <th key={i} className={indexList[item] ? 'inde' : ''}>
                    {item}
                </th>
            )
        })
        const tbodyEl = original.map((item, i) => {
            return (
                <tr key={i}>
                    <td key={-1} className="tools">
                        <Popover
                            content={this.renderPopver()}
                            position={i === 0 ? Position.BOTTOM : Position.TOP}
                        >
                            <button
                                className="pt-button pt-small pt-icon-send-to-graph"
                                onClick={() => {this.toolIndex = i}}
                            />
                        </Popover>
                    </td>
                    {cloneHead.map((key, j) => {
                        const content = item[key] || ''
                        if (typeof content === 'object') {
                            return <td key={j} className={`object ${indexList[key] ? 'inde' : ''}`}>
                                ...Object
                                <span
                                    className="pt-icon-small pt-icon-caret-right more"
                                    onClick={() => this.handleDialog(content)}
                                ></span>
                            </td>
                        }
                        if (content.length > 140) {
                            return <td key={j} className={`object ${indexList[key] ? 'inde' : ''}`}>
                                {content.slice(0, 140) + '......'}
                                <span
                                    className="pt-icon-small pt-icon-caret-right more"
                                    onClick={() => this.handleDialog(content)}
                                ></span>
                            </td>
                        }
                        return <td key={j} className={indexList[key] ? 'inde' : ''}>
                            {content}
                        </td>
                    })}
                </tr>
            )
        })
        return (
            <div className="detail-container">
                <table className="pt-table pt-striped pt-bordered pt-interactive table-container">
                    <thead>
                        <tr>
                            <th key={-1} className="tools">{l`Tools`}</th>
                            {theadEl}
                        </tr>
                    </thead>
                    <tbody>
                        {tbodyEl}
                    </tbody>
                </table>
                <Dialog
                    isOpen={!!this.state.dialog}
                    title={l`Detail Information`}
                    onClose={() => this.handleDialog('')}
                >
                    <div className="dialog-body">
                        <pre>
                            <code>
                                {this.state.dialog}
                            </code>
                        </pre>
                    </div>
                </Dialog>
            </div>
        )
    }
}

export default Detail
