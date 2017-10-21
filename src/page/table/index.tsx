import * as React from 'react'
import {observer} from 'mobx-react'
import {parseSearch} from '../../lib/util'
import {Tree, TreeNode, ITreeNode, Tooltip, Position, NumericInput} from '@blueprintjs/core'
import l from '../../lib/lang'
import * as Pagenation from 'react-paginate'

import table from '../../store/table'
import Detail from '../../components/detail'

import './table.less'

@observer
class Tables extends React.Component<any, any> {
    componentDidMount () {
        const query = parseSearch(this.props.location.search)
        const {connectionName} = query
        table.change('connectionName', connectionName)
        table.viewDbList()
    }
    async componentWillUpdate (nextProps) {
        const query = parseSearch(this.props.location.search)
        const nextQuery = parseSearch(nextProps.location.search)
        if (query.connectionName !== nextQuery.connectionName) {
            table.change('connectionName', nextQuery.connectionName)
        }
    }

    render () {
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
            <div className="tables-container">
                <div className="left">
                    <Tree
                        contents = {nodes}
                        onNodeClick = {(item: any) => table.handleClick(item.index, item.type)}
                        className = 'tree-container'
                    />
                </div>
                <div className="right">
                    <div className="top"></div>
                    <div className="middle">
                        <Detail
                            list={data.detail.list}
                        />
                    </div>
                    <div className="bottom">
                        <div className="limit">
                            <div className="number-container">
                                <NumericInput
                                    stepSize={5}
                                    min={20}
                                    className="pt-small"
                                    max={100}
                                    value={data.detail.limit}
                                    onValueChange={limit => table.changeLimit(limit)}
                                />
                            </div>
                        </div>
                        <div className="page-container">
                            <Pagenation
                                pageCount={Math.ceil(data.detail.total / data.detail.limit)}
                                pageRangeDisplayed={5}
                                marginPagesDisplayed={2}
                                disableInitialCallback={true}
                                onPageChange={i => table.changePageSelect(i)}
                                initialPage={data.detail.select}
                                forcePage={data.detail.select}
                                pageClassName="pt-button pt-small"
                                previousLabel=""
                                nextLabel=""
                                previousLinkClassName="pt-button pt-small pt-icon-arrow-left"
                                nextLinkClassName="pt-button pt-small pt-icon-arrow-right"
                                activeClassName="pt-active"
                            />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Tables
