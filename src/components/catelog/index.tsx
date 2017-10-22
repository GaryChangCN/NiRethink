import * as React from 'react'
import {Tree, TreeNode, ITreeNode, Tooltip, Position} from '@blueprintjs/core'
import l from '../../lib/lang'
import * as _ from 'lodash'
import {observer} from 'mobx-react'
import table from '../../store/table'

import './catelog.less'

@observer
class Catelog extends React.Component<any, any> {
    static defaultProps = {
        data: {
            dbList: [],
            tableList: []
        },
        className: '',
        onNodeClick: _.noop
    }
    render () {
        const {className} = this.props
        const data = table.store.view
        const nodes: any = data.dbList.map((dbName, i) => {
            let childNodes = []
            if (i === (data.selectDbIndex as any)) {
                childNodes = data.tableList.map((tableName, j) => {
                    let select = false
                    if (j === (data.selectTableIndex as any)) {
                        select = true
                    }
                    return {
                        index: j,
                        id: j,
                        type: 'child',
                        iconName: select ? 'pt-icon-full-stacked-chart' : 'pt-icon-stacked-chart',
                        label: tableName,
                        className: `child-item ${select ? 'child-item-select' : ''}`,
                        secondaryLabel: (
                            <Tooltip content={l`Drop Table`} position={Position.RIGHT}>
                                <button
                                    className="pt-button pt-small pt-icon-trash remove-table"
                                ></button>
                            </Tooltip>
                        )
                    }
                })
            }
            return {
                index: i,
                id: i,
                type: 'parent',
                iconName: 'database',
                label: dbName,
                className: 'parent-item',
                isExpanded: childNodes.length > 0 ? true : false,
                childNodes,
                secondaryLabel: (
                    <Tooltip
                        content={l`Drop Database`}
                        position={i === 0 ? Position.BOTTOM : Position.RIGHT}>
                        <button
                            className="pt-button pt-small pt-icon-trash remove-db"
                        ></button>
                    </Tooltip>
                )
            }
        })
        return (
            <Tree
                contents = {nodes}
                onNodeClick = {(item: any) => table.handleClick(item.index, item.type)}
                className = {className}
            />
        )
    }
}

export default Catelog
