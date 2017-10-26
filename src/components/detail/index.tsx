import * as React from 'react'
import * as _ from 'lodash'
import {Dialog, Tooltip, Position, Intent, Popover} from '@blueprintjs/core'
import l from '../../lib/lang'
import Editor from '../../components/editor'

import './detail.less'

class Detail extends React.Component<any, any> {
    ref: any = null

    static defaultProps = {
        list: [],
        indexList: {},
        onRemoveRow: _.noop,
        onEditRow: _.noop
    }
    constructor (props) {
        super (props)
        this.state = {
            dialog: '',
            showDialog: false,
            toolIndex: -1
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

    handleDialog (dialog = '') {
        const state: any = {dialog}
        if (dialog) {
            state.showDialog = true
        }else {
            state.showDialog = false
        }
        this.setState(state)
    }

    handleTool (type: string) {
        if (this.state.toolIndex === -1) {
            throw new Error('Uncaught row number')
        }
        const index = this.state.toolIndex
        if (type === 'view') {
            const data = this.props.list[index]
            this.handleDialog(data)
        }
        if (type === 'remove') {
            const id = this.props.list[index].id
            this.props.onRemoveRow(id)
        }
        if (type === 'edit') {
            const data = this.props.list[index]
            this.props.onEditRow(data)
        }
        this.setState({
            toolIndex: -1
        })
    }

    renderPopver () {
        return (
            <div className="popver-content">
                <div className="title">
                    {l`Row Operation`}
                </div>
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
                            isOpen={this.state.toolIndex === i}
                            onClose={() => {
                                this.setState({
                                    toolIndex: -1
                                })
                            }}
                        >
                            <Tooltip content={l`Show Toolbox`}>
                                <button
                                    className="pt-button pt-small pt-icon-send-to-graph"
                                    onClick={() => {
                                        this.setState({toolIndex: i})
                                    }}
                                />
                            </Tooltip>
                        </Popover>
                    </td>
                    {cloneHead.map((key, j) => {
                        let content = item[key] || ''
                        if (typeof content === 'object') {
                            return <td key={j} className={`object ${indexList[key] ? 'inde' : ''}`}>
                                ...Object
                                <span
                                    className="pt-icon-small pt-icon-caret-right more"
                                    onClick={() => this.handleDialog(content)}
                                ></span>
                            </td>
                        }
                        if (typeof content === 'boolean') {
                            return <td key={j} className={`object ${indexList[key] ? 'inde' : ''}`}>
                                {String(content)}
                                <span
                                    className="pt-icon-small pt-icon-caret-right more"
                                    onClick={() => this.handleDialog(content)}
                                ></span>
                            </td>
                        }
                        content = String(content)
                        if (content.length > 140) {
                            return <td key={j} className={`object ${indexList[key] ? 'inde' : ''}`}>
                                {content.slice(0, 140) + '......'}
                                <span
                                    className="pt-icon-small pt-icon-caret-right more"
                                    onClick={() => this.handleDialog(content)}
                                ></span>
                            </td>
                        }
                        return <td key={j} className={`${key === 'id' ? 'id-td' : ''} ${indexList[key] ? 'inde' : ''}`}>
                            {content}
                        </td>
                    })}
                </tr>
            )
        })
        const renderViewDetail = () => {
            const {dialog} = this.state
            if (typeof dialog === 'object' && !(dialog instanceof Date)) {
                return <Editor
                        data={this.state.dialog}
                        rootName={false}
                        className="editor-in-dialog"
                    />
            }
            return <pre><code>{String(dialog)}</code></pre>
        }
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
                    isOpen={this.state.showDialog}
                    title={l`Detail Information`}
                    onClose={() => this.handleDialog()}
                    iconName="eye-open"
                >
                    <div className="dialog-body">
                        {renderViewDetail()}
                    </div>
                </Dialog>
            </div>
        )
    }
}

export default Detail
