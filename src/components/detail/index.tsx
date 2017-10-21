import * as React from 'react'
import * as _ from 'lodash'
import {Dialog} from '@blueprintjs/core'
import l from '../../lib/lang'

import './detail.less'

class Detail extends React.Component<any, any> {
    ref: any = null
    static defaultProps = {
        list: []
    }
    constructor (props) {
        super (props)
        this.state = {
            dialog: ''
        }
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
    render () {
        const original = this.props.list
        const head = this.getHead(original)
        const tdArr = Array.from(head)
        const theadEl = head.map((item, i) => {
            return (
                <th key={i}>
                    {item}
                </th>
            )
        })
        const tbodyEl = original.map((item, i) => {
            return (
                <tr key={i}>
                    {tdArr.map((key, j) => {
                        const content = item[key] || ''
                        if (typeof content === 'object') {
                            return <td key={j} className="object">
                                ...Object
                                <span
                                    className="pt-icon-small pt-icon-caret-right more"
                                    onClick={() => this.handleDialog(content)}
                                ></span>
                            </td>
                        }
                        if (content.length > 140) {
                            return <td key={j} className="object">
                                {content.slice(0, 140) + '......'}
                                <span
                                    className="pt-icon-small pt-icon-caret-right more"
                                    onClick={() => this.handleDialog(content)}
                                ></span>
                            </td>
                        }
                        return <td key={j}>
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
                        <tr>{theadEl}</tr>
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
