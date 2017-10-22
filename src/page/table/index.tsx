import * as React from 'react'
import {observer} from 'mobx-react'
import {parseSearch} from '../../lib/util'
import {Tree, TreeNode, ITreeNode, Tooltip, Position, NumericInput} from '@blueprintjs/core'
import l from '../../lib/lang'
import * as Pagenation from 'react-paginate'
import Icon from '../../components/svg-icon'

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

    renderRight () {
        const data = table.store.view
        if (data.detail.list.length === 0 && data.selectTableIndex === '') {
            return (
                <div className="pt-non-ideal-state">
                    <div className="pt-non-ideal-state-visual pt-non-ideal-state-icon">
                        <span className="pt-icon pt-icon-stacked-chart"></span>
                    </div>
                    <h4 className="pt-non-ideal-state-title">{l`No table has selected`}</h4>
                    <div className="pt-non-ideal-state-description">
                        {l`Select table from left category`}
                    </div>
                </div>
            )
        }
        return (
            <div className="right">
                <div className="top">
                    <div className="top-left">
                        <div className="bread">
                        </div>
                    </div>
                    <div className="top-right">
                        <Tooltip content={l`Show/Hide Index List`} position={Position.LEFT}>
                            <button
                                className="pt-button pt-small pt-icon-layout-hierarchy"
                                onClick={() => table.listIndex()}
                            ></button>
                        </Tooltip>
                    </div>
                </div>
                <div className="middle">
                    <Detail
                        list={data.detail.list}
                        indexList={data.detail.indexList}
                    />
                </div>
                <div className="bottom">
                    <div className="tool-box">
                        <div className="limit">
                            <div className="number-container">
                                <NumericInput
                                    stepSize={5}
                                    min={20}
                                    className="pt-small pt-fill"
                                    max={100}
                                    value={data.detail.limit}
                                    onValueChange={limit => table.changeLimit(limit)}
                                />
                            </div>
                            <div className="label">
                            {l`Rows`} / {l`Page`}
                            </div>
                        </div>
                        <div className="box">
                            <Tooltip content="Use javascript to query this table">
                                <Icon type="terminal" className="terminal"/>
                            </Tooltip>
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
        )
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
                {this.renderRight()}
            </div>
        )
    }
}

export default Tables
